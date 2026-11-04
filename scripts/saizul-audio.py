"""Builds the complete audio for the Saizul Amin portfolio film from timeline.json.

1. Voice-over: each line is synthesised with macOS `say` (Evan Enhanced), cleaned up
   (EQ, de-esser, compression, -13 LUFS) and placed so lines never overlap.
2. Mix: voice + every sound effect + one keyboard key per typed character are summed
   into public/saizul/audio/mix.wav. Effects duck under the voice.

Usage: python3 scripts/saizul-audio.py            (regenerate voice + mix)
       python3 scripts/saizul-audio.py --mix-only (reuse existing voice files)
"""
import array, json, math, pathlib, subprocess, sys, wave

ROOT = pathlib.Path(__file__).resolve().parent.parent
TIMELINE = ROOT / "src/videos/SaizulPortfolio/timeline.json"
VO_OUT = ROOT / "src/videos/SaizulPortfolio/voiceover.json"
SFX_DIR = ROOT / "public/saizul/sfx"
VO_DIR = ROOT / "public/saizul/vo"
MIX = ROOT / "public/saizul/audio/mix.wav"
SR = 48000
VOICE, RATE = "Evan (Enhanced)", 175
LEAD, TAIL, GAP = 2, 6, 4  # frames of padding around each line; gap between chained lines
SFX_DUCK, KEY_DUCK = 0.55, 0.8

VOICE_CHAIN = ",".join([
    "silenceremove=start_periods=1:start_threshold=-65dB:start_silence=0.08",
    "areverse,silenceremove=start_periods=1:start_threshold=-65dB:start_silence=0.08,areverse",
    "apad=pad_dur=0.15",
    "highpass=f=90", "equalizer=f=250:t=q:w=1:g=-3", "equalizer=f=3500:t=q:w=1.2:g=4",
    "highshelf=f=9000:g=3", "deesser=i=0.4",
    "acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=2",
    "loudnorm=I=-13:TP=-1.0:LRA=7", "alimiter=limit=0.9", "adelay=80:all=1",
])

tl = json.loads(TIMELINE.read_text())
FPS = tl["fps"]
scene_start, scene_len, t = {}, {}, 0
for name, frames in tl["scenes"]:
    scene_start[name], scene_len[name] = t, frames
    t += frames
TOTAL_FRAMES = t

def run(*cmd):
    return subprocess.run(cmd, check=True, capture_output=True, text=True)

def duration(path):
    return float(run("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)).stdout)

def lufs(path):
    err = subprocess.run(["ffmpeg", "-i", str(path), "-af", "apad=pad_dur=1,ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(err.rsplit("I:", 1)[1].split("LUFS")[0])

def synth(name, text):
    aiff, wav = VO_DIR / f"{name}.aiff", VO_DIR / f"{name}.wav"
    run("say", "-v", VOICE, "-r", str(RATE), "-o", str(aiff), text)
    run("ffmpeg", "-v", "error", "-y", "-i", str(aiff), "-af", VOICE_CHAIN, "-ar", str(SR), "-ac", "2", str(wav))
    aiff.unlink()
    gain = -13.0 - lufs(wav)  # second pass: every line lands at the same loudness
    tmp = wav.with_suffix(".tmp.wav")
    run("ffmpeg", "-v", "error", "-y", "-i", str(wav), "-af", f"volume={gain:.2f}dB,alimiter=limit=0.89", "-ar", str(SR), "-ac", "2", str(tmp))
    tmp.replace(wav)

def read_wav(path):
    with wave.open(str(path)) as w:
        assert w.getframerate() == SR and w.getnchannels() == 2 and w.getsampwidth() == 2, path
        data = array.array("h", w.readframes(w.getnframes()))
    return array.array("f", (x / 32768 for x in data))

# ---- 1. voice-over -------------------------------------------------------
VO_DIR.mkdir(parents=True, exist_ok=True)
placements, prev_end = [], {}
for name, scene, at, text in tl["vo"]:
    if "--mix-only" not in sys.argv:
        synth(name, text)
    frames = round(duration(VO_DIR / f"{name}.wav") * FPS)
    speech = frames - LEAD - TAIL
    start = max(at or 0, prev_end[scene] + GAP if scene in prev_end else 0)
    flag = "  <-- OVERRUNS SCENE" if start + speech > scene_len[scene] + 6 else ""
    prev_end[scene] = start + speech
    placements.append({"file": f"saizul/vo/{name}.wav", "from": scene_start[scene] + start - LEAD, "frames": frames, "text": text})
    print(f"{name} {scene:10} local {start:3}-{start + speech:3} / {scene_len[scene]}{flag}  {text[:60]}")
VO_OUT.write_text(json.dumps(placements, indent=1))

# ---- 2. mix ----------------------------------------------------------------
n = (TOTAL_FRAMES * SR // FPS + SR) * 2
mix = array.array("f", bytes(4 * n))
vo_spans = [(p["from"], p["from"] + p["frames"]) for p in placements]
under_voice = lambda frame: any(a - 3 <= frame < b for a, b in vo_spans)

cache = {}
def sfx(name):
    if name not in cache:
        s = read_wav(SFX_DIR / f"{name}.wav")
        peak = max(abs(x) for x in s) or 1
        cache[name] = array.array("f", (x * 0.7 / peak for x in s))  # every effect peaks at -3 dBFS
    return cache[name]

def add(samples, frame, gain):
    o = int(frame * SR / FPS) * 2
    end = min(len(samples), len(mix) - o)
    for i in range(end):
        mix[o + i] += samples[i] * gain

for scene, at, name, vol in tl["sfx"]:
    f = scene_start[scene] + at
    add(sfx(name), f, vol * (SFX_DUCK if under_voice(f) else 1))

keys = ["key1", "key2", "key3", "key4"]
count = 0
for b, cue in enumerate(tl["typing"].values()):
    chars = cue["text"].replace("\n", "")
    for k, ch in enumerate(chars):
        if ch == " ":
            continue
        f = scene_start[cue["scene"]] + cue["start"] + math.floor(k * cue["fpc"])
        vol = (0.2 + ((k * 5 + b) % 4) * 0.025) * cue["vol"]
        add(sfx(keys[(k * 3 + b) % 4]), f, vol * (KEY_DUCK if under_voice(f) else 1))
        count += 1

for p in placements:
    add(read_wav(ROOT / "public" / p["file"]), p["from"], 0.85)

# Soft-knee limiter: untouched below -2.5 dBFS, smoothly capped at -1 dBFS.
knee, ceiling = 0.75, 0.89
out = array.array("h", bytes(2 * len(mix)))
for i, x in enumerate(mix):
    a = abs(x)
    if a > knee:
        a = knee + (ceiling - knee) * math.tanh((a - knee) / (ceiling - knee))
        x = math.copysign(a, x)
    out[i] = int(max(-1, min(1, x)) * 32767)
MIX.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(MIX), "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(out.tobytes())
print(f"mix: {len(tl['sfx'])} effects, {count} key presses, {len(placements)} voice lines -> {MIX.relative_to(ROOT)}")

# True-peak safety: limit at 4x oversampling so inter-sample peaks from sharp key clicks stay under -1 dBTP.
tmp = MIX.with_suffix(".tmp.wav")
run("ffmpeg", "-v", "error", "-y", "-i", str(MIX), "-af",
    "aresample=192000,alimiter=limit=0.8:attack=1:release=40:level=disabled,aresample=48000",
    "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", str(tmp))
tmp.replace(MIX)
