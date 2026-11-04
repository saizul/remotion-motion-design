#!/bin/zsh
# Synthesises the B1 Test Birmingham sound-effect set with ffmpeg (no external assets).
set -e
OUT="public/b1/sfx"
mkdir -p "$OUT"
gen() { ffmpeg -v error -y -f lavfi -i "$2" -af "$3" -ar 48000 -ac 2 "$OUT/$1.wav"; }

# Airy whoosh: noise shaped by a sine envelope, band-limited.
gen whoosh      "anoisesrc=d=0.7:c=pink:r=48000:a=0.9" "bandpass=f=1400:width_type=h:w=2000,volume='sin(PI*t/0.7)^2':eval=frame,volume=2.5"
gen whoosh-big  "anoisesrc=d=1.1:c=pink:r=48000:a=0.9" "lowpass=f=2200,volume='sin(PI*t/1.1)^3':eval=frame,volume=3"
# Bubble pop: fast downward pitch blip.
gen pop         "aevalsrc='sin(2*PI*(900*t-2500*t*t))*exp(-t*28)':d=0.18:s=48000" "volume=0.9"
gen pop-high    "aevalsrc='sin(2*PI*(1400*t-3000*t*t))*exp(-t*32)':d=0.15:s=48000" "volume=0.8"
# Soft UI tick.
gen tick        "aevalsrc='sin(2*PI*2200*t)*exp(-t*90)':d=0.06:s=48000" "volume=0.7"
# Impact: low thump + short noise transient.
gen impact      "aevalsrc='0.9*sin(2*PI*(95*t-60*t*t))*exp(-t*7)+0':d=0.6:s=48000" "lowpass=f=2500,volume=1.4"
# Riser: rising chirp with swelling envelope.
gen riser       "aevalsrc='0.5*sin(2*PI*(220*t+260*t*t))*(t/2.1)^1.5':d=2.1:s=48000" "highpass=f=150,afade=t=out:st=1.95:d=0.15"
# Chime for achievements / check marks.
gen ding        "aevalsrc='(0.6*sin(2*PI*1568*t)+0.35*sin(2*PI*2093*t)+0.2*sin(2*PI*3136*t))*exp(-t*6)':d=0.9:s=48000" "volume=0.7"
# Logo shimmer: stacked bell partials with staggered decays.
gen shimmer     "aevalsrc='(0.5*sin(2*PI*1318.5*t)*exp(-t*3)+0.4*sin(2*PI*1760*(t))*exp(-t*3.5)*gt(t,0.06)+0.35*sin(2*PI*2637*t)*exp(-t*4)*gt(t,0.12)+0.25*sin(2*PI*3520*t)*exp(-t*5)*gt(t,0.18))':d=1.6:s=48000" "aecho=0.6:0.5:60|120:0.3|0.2,volume=3.5"
# Digital blip for sound-wave / UI elements.
gen blip        "aevalsrc='sin(2*PI*1200*t)*exp(-t*25)*gt(t,0)+sin(2*PI*1800*(t-0.07))*exp(-(t-0.07)*25)*gt(t,0.07)':d=0.25:s=48000" "volume=0.6"
# Keyboard keys: bright click (band-passed noise) + short low "thock"; 4 variants for natural typing.
key() {
  ffmpeg -v error -y -f lavfi -i "anoisesrc=d=0.06:c=white:a=0.8" -f lavfi -i "aevalsrc='$3*sin(2*PI*$2*t)*exp(-t*80)':d=0.06:s=48000" \
    -filter_complex "[0]bandpass=f=$4:width_type=h:w=2500,afade=t=out:st=0:d=0.018[c];[c][1]amix=inputs=2:normalize=0,volume=1.6" \
    -ar 48000 -ac 2 "$OUT/$1.wav"
}
key key1 170 0.6 3200
key key2 210 0.5 3800
key key3 150 0.7 2800
key key4 240 0.45 4200
echo "sfx done"
