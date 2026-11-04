#!/bin/zsh
# Synthesises the Saizul Amin portfolio sound-effect set with ffmpeg (no external assets).
set -e
OUT="public/saizul/sfx"
mkdir -p "$OUT"
gen() { ffmpeg -v error -y -f lavfi -i "$2" -af "$3" -ar 48000 -ac 2 "$OUT/$1.wav"; }

# Camera moves / transitions
gen whoosh     "anoisesrc=d=0.7:c=pink:r=48000:a=0.9" "bandpass=f=1400:width_type=h:w=2000,volume='sin(PI*t/0.7)^2':eval=frame,volume=2.5"
gen whoosh-big "anoisesrc=d=1.2:c=pink:r=48000:a=0.9" "lowpass=f=2200,volume='sin(PI*t/1.2)^3':eval=frame,volume=3"
gen swipe      "anoisesrc=d=0.3:c=white:r=48000:a=0.8" "bandpass=f=3000:width_type=h:w=3000,volume='sin(PI*t/0.3)^2':eval=frame,volume=2"
# Particle formation: bright crackle with fast flutter
gen particles  "anoisesrc=d=1.4:c=white:r=48000:a=0.7" "highpass=f=5000,tremolo=f=22:d=0.9,volume='sin(PI*t/1.4)':eval=frame,volume=2.2"
# Metallic assembly: inharmonic partials with short noise hit
gen metal      "aevalsrc='(0.5*sin(2*PI*523*t)+0.35*sin(2*PI*1307*t)+0.25*sin(2*PI*2211*t)+0.18*sin(2*PI*3571*t))*exp(-t*5)':d=1.0:s=48000" "aecho=0.7:0.4:30:0.3,volume=1.4"
# Digital energy / data pulse
gen pulse      "aevalsrc='0.8*sin(2*PI*(120*t-80*t*t))*exp(-t*9)+0.3*sin(2*PI*2000*t)*exp(-t*40)':d=0.5:s=48000" "volume=1.2"
# Hologram activation: rising sweep with shimmer
gen holo       "aevalsrc='0.45*sin(2*PI*(400*t+900*t*t))*(1-exp(-t*20))*exp(-t*2.5)':d=0.7:s=48000" "tremolo=f=30:d=0.5,aecho=0.6:0.4:50:0.25,volume=1.6"
# UI click
gen click      "aevalsrc='0.7*sin(2*PI*3200*t)*exp(-t*140)+0.5*sin(2*PI*900*t)*exp(-t*70)':d=0.08:s=48000" "volume=1"
# Notification ping
gen ping       "aevalsrc='(0.5*sin(2*PI*1318*t)*lt(t,0.12)+0.5*sin(2*PI*1976*t)*gte(t,0.1))*exp(-t*6)':d=0.6:s=48000" "volume=1.1"
# Graph growth: rising chirp
gen rise       "aevalsrc='0.45*sin(2*PI*(300*t+375*t*t))*(t/1.2)^0.8':d=1.2:s=48000" "afade=t=out:st=1.05:d=0.15,volume=1.4"
# Data stream: gated warbling blips
gen data       "aevalsrc='0.35*sin(2*PI*(900+500*sin(2*PI*7*t))*t)*gt(sin(2*PI*14*t),0)':d=0.9:s=48000" "afade=t=in:d=0.05,afade=t=out:st=0.75:d=0.15,volume=1.3"
# AI energy build-up: low drone swelling with rising hum
gen energy     "aevalsrc='(0.5*sin(2*PI*55*t)+0.35*sin(2*PI*110*t)+0.2*sin(2*PI*(220+120*t)*t))*(t/2.6)^1.3':d=2.6:s=48000" "afade=t=out:st=2.4:d=0.2,volume=1.8"
# Network connection blip
gen connect    "aevalsrc='0.6*sin(2*PI*(600*t+2500*t*t))*exp(-t*18)':d=0.18:s=48000" "volume=1.1"
# Satellite beeps
gen sat        "aevalsrc='0.4*sin(2*PI*2400*t)*(lt(t,0.06)+between(t,0.12,0.18)+between(t,0.24,0.3))':d=0.4:s=48000" "volume=1.2"
# Cinematic impact
gen impact     "aevalsrc='0.9*sin(2*PI*(55*t-25*t*t))*exp(-t*4)':d=1.2:s=48000" "lowpass=f=900,aecho=0.8:0.5:90|180:0.35|0.2,volume=1.6"
# Digital resonance tail
gen resonance  "aevalsrc='(0.3*sin(2*PI*220*t)+0.25*sin(2*PI*330*t)+0.2*sin(2*PI*440*t)+0.15*sin(2*PI*660*t))*exp(-t*1.2)*(1-exp(-t*30))':d=3.2:s=48000" "aecho=0.7:0.5:120|240:0.4|0.25,volume=1.8"

# Keyboard keys (same design as the B1 set)
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
