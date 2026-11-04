"""Builds the audio for the Bengali B1 Test Birmingham ad from its timeline.json.

- Voice: the ElevenLabs Bengali voice-over, cleaned (EQ, de-esser, compression) and
  normalised to -14 LUFS, placed at `voOffset` frames.
- Effects: every cue in timeline["sfx"], ducked while the voice is speaking.
- Typing: one key press per typed grapheme (Bengali conjuncts count as one), using the
  same Intl.Segmenter rules as the on-screen typewriter so sound and letters stay in sync.
No music. Output: public/b1bn/audio/mix.wav

Usage: python3 scripts/b1bn-audio.py
"""
import array, json, math, pathlib, subprocess, wave

ROOT = pathlib.Path(__file__).resolve().parent.parent
TIMELINE = ROOT / "src/videos/B1Bangla/timeline.json"
SFX_DIR = ROOT / "public/b1bn/sfx"
VO_SRC = ROOT / "public/b1bn/vo.wav"
VO_CLEAN = ROOT / "public/b1bn/audio/vo-clean.wav"
MIX = ROOT / "public/b1bn/audio/mix.wav"
SR = 48000
SFX_DUCK, KEY_DUCK = 0.35, 0.55

# Clean + loud voice: remove rumble and broadband hiss/noise, cut mud, lift presence,
# tame sibilance, compress, then normalise to -13 LUFS.
VOICE_CHAIN = ",".join([
    "highpass=f=85", "lowpass=f=14000",
    "afftdn=nr=14:nf=-42:tn=1",
    "equalizer=f=250:t=q:w=1:g=-3", "equalizer=f=3200:t=q:w=1.2:g=3.5",
    "highshelf=f=9000:g=2", "deesser=i=0.4",
    "acompressor=threshold=-22dB:ratio=3:attack=6:release=100:makeup=2.5",
    "loudnorm=I=-13:TP=-1.2:LRA=7", "alimiter=limit=0.9",
])

def run(*cmd):
    return subprocess.run(cmd, check=True, capture_output=True, text=True)

tl = json.loads(TIMELINE.read_text())
FPS = tl["fps"]
starts, t = {}, 0
for name, frames in tl["scenes"]:
    starts[name] = t
    t += frames
TOTAL = t

# Grapheme split for every cue (same rules the browser uses for the typewriter).
graphemes = json.loads(run("node", "-e", """
const tl = JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'));
const seg = new Intl.Segmenter('bn', { granularity: 'grapheme' });
const out = {};
for (const [id, c] of Object.entries(tl.typing)) out[id] = [...seg.segment(c.text.replace(/\\n/g, ''))].map((s) => s.segment);
console.log(JSON.stringify(out));
""", str(TIMELINE)).stdout)

def read_wav(path):
    with wave.open(str(path)) as w:
        assert w.getframerate() == SR and w.getnchannels() == 2 and w.getsampwidth() == 2, path
        data = array.array("h", w.readframes(w.getnframes()))
    return array.array("f", (x / 32768 for x in data))

# ---- voice ---------------------------------------------------------------
VO_CLEAN.parent.mkdir(parents=True, exist_ok=True)
# Optional trim of unwanted audio at the start (timeline["voTrimStart"], seconds), with a short fade-in.
trim = tl.get("voTrimStart", 0)
chain = (f"atrim=start={trim},asetpts=PTS-STARTPTS,afade=t=in:d=0.02," if trim else "") + VOICE_CHAIN
run("ffmpeg", "-v", "error", "-y", "-i", str(VO_SRC), "-af", chain, "-ar", str(SR), "-ac", "2", str(VO_CLEAN))
err = subprocess.run(["ffmpeg", "-i", str(VO_CLEAN), "-af", "silencedetect=noise=-38dB:d=0.3", "-f", "null", "-"], capture_output=True, text=True).stderr
sil = [float(l.split("silence_start: ")[1]) for l in err.splitlines() if "silence_start" in l]
sil_end = [float(l.split("silence_end: ")[1].split(" ")[0]) for l in err.splitlines() if "silence_end" in l]
vo = read_wav(VO_CLEAN)
vo_len = len(vo) / 2 / SR
# Speech spans (in composition frames) for ducking.
edges = [0.0] + [x for pair in zip(sil, sil_end) for x in pair] + [vo_len]
spans = [((edges[i] * FPS) + tl["voOffset"], (edges[i + 1] * FPS) + tl["voOffset"]) for i in range(0, len(edges) - 1, 2)]

# Extra voice clips (e.g. the spoken course name): same clean-up chain, optional end trim.
extra = []
for x in tl.get("extraVo", []):
    out_path = VO_CLEAN.with_name(f"{x['id']}.wav")
    pre = f"atrim=end={x['trimEnd']},afade=t=out:st={x['trimEnd'] - 0.05}:d=0.05," if "trimEnd" in x else ""
    run("ffmpeg", "-v", "error", "-y", "-i", str(ROOT / "public/b1bn" / x["src"]), "-af", pre + VOICE_CHAIN, "-ar", str(SR), "-ac", "2", str(out_path))
    samples = read_wav(out_path)
    extra.append((samples, x["from"]))
    spans.append((x["from"], x["from"] + len(samples) / 2 / SR * FPS))

speaking = lambda f: any(a - 3 <= f < b for a, b in spans)

# ---- mix -------------------------------------------------------------------
mix = array.array("f", bytes(4 * ((TOTAL * SR // FPS + SR) * 2)))

def add(samples, frame, gain):
    o = int(frame * SR / FPS) * 2
    for i in range(min(len(samples), len(mix) - o)):
        mix[o + i] += samples[i] * gain

cache = {}
def sfx(name):
    if name not in cache:
        s = read_wav(SFX_DIR / f"{name}.wav")
        peak = max(abs(x) for x in s) or 1
        cache[name] = array.array("f", (x * 0.7 / peak for x in s))  # every effect peaks at -3 dBFS
    return cache[name]

for scene, at, name, vol in tl["sfx"]:
    f = starts[scene] + at
    add(sfx(name), f, vol * (SFX_DUCK if speaking(f) else 1))

keys, presses = ["key1", "key2", "key3", "key4"], 0
for b, (cid, c) in enumerate(tl["typing"].items()):
    for k, g in enumerate(graphemes[cid]):
        if g.strip() == "":
            continue
        f = starts[c["scene"]] + c["start"] + math.floor(k * c["fpc"])
        vol = (0.2 + ((k * 5 + b) % 4) * 0.025) * c["vol"]
        add(sfx(keys[(k * 3 + b) % 4]), f, vol * (KEY_DUCK if speaking(f) else 1))
        presses += 1

add(vo, tl["voOffset"], 1.0)
for samples, frame in extra:
    add(samples, frame, 1.0)

out = array.array("h", (int(max(-1, min(1, x)) * 32767) for x in mix))
with wave.open(str(MIX), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(out.tobytes())
# True-peak safety at 4x oversampling.
tmp = MIX.with_suffix(".tmp.wav")
run("ffmpeg", "-v", "error", "-y", "-i", str(MIX), "-af", "aresample=192000,alimiter=limit=0.8:attack=1:release=40:level=disabled,aresample=48000",
    "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", str(tmp))
tmp.replace(MIX)
print(f"voice {vo_len:.1f}s ({len(spans)} speech spans), {len(tl['sfx'])} effects, {presses} key presses -> {MIX.relative_to(ROOT)}")
