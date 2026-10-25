#!/bin/zsh
# Produces Modelltests (DTZ, or telc B1 with --exam telc-b1) end to end for a batch of sets and seeds them LOCALLY as draft:
#   author (all 4 skills in parallel, Claude Opus 5.5 medium) → images (Sprechen photos) → audio (Hören track, Sprechen
#   lines; eleven_v4_turbo) → seed (local mt_* + Storage). Each step is cached/resumable, so a re-run continues.
# All Claude calls go through the Message Batches API (DRAFT_BATCH=1, 50% cheaper, a few minutes per round trip);
# DRAFT_BATCH=0 scripts/modelltest/batch.sh … runs them live. Stops on a credit-balance error. Production seeding and review stay manual (CLAUDE.md §4, §10).
#
# telc B1: after drafting, check-set.ts finds names/themes repeated across the skills of a set; each flagged Teil is
# re-drafted once (it then sees the other skills' files). No images (telc Sprechen has no photos).
#
# scripts/modelltest/batch.sh 8 9 10            logs in .unit-cache/batch/
# scripts/modelltest/batch.sh --exam telc-b1 2 3 4
set -u; setopt pipefail
cd "$(dirname "$0")/../.."
export PATH="/opt/homebrew/bin:$PATH" DRAFT_BATCH=${DRAFT_BATCH:-1}
EXAM=dtz
[[ ${1:-} == --exam ]] && { EXAM=$2; shift 2 }
[[ $EXAM == dtz || $EXAM == telc-b1 ]] || { echo "unknown exam $EXAM"; exit 1 }
AUTHOR=scripts/modelltest/author.ts; [[ $EXAM == telc-b1 ]] && AUTHOR=scripts/modelltest/author-telc-b1.ts
SETS=("$@")
(( ${#SETS} )) || { echo "usage: batch.sh <set> [set…]"; exit 1 }
LOG=.unit-cache/batch; mkdir -p $LOG; rm -f $LOG/*.log
run() { npx tsx --env-file=.env.local "$@" 2>&1 | grep -v deprecated }
billing() { grep -lq "credit balance" $LOG/*.log 2>/dev/null && { echo "BILLING STOP: top up the Anthropic credit"; exit 2 } }

echo "== author ${SETS[*]}"
for skill in hoeren lesen schreiben sprechen; do
  ( for n in $SETS; do echo "=== $skill $n"; run $AUTHOR --skill $skill --set $n || echo "AUTHOR FAILED $skill $n"; billing; done ) > $LOG/author-$skill.log 2>&1 &
done
wait; billing
grep -h "AUTHOR FAILED\|still .* issue" $LOG/author-*.log && { echo "fix the failed units (see $LOG), then re-run"; exit 1 }

if [[ $EXAM == telc-b1 ]]; then
  for n in $SETS; do
    echo "== check set $n"
    run scripts/modelltest/check-set.ts --set $n > $LOG/check-$n.log && continue
    # "hoeren Teil 2: …" → re-draft that Teil once, then check again.
    for unit in $(grep -o "^[a-z]* Teil [0-9]" $LOG/check-$n.log | sort -u | tr ' ' '_'); do
      parts=(${(s:_:)unit})
      echo "   redraft ${parts[1]} Teil ${parts[3]}"
      run $AUTHOR --skill ${parts[1]} --set $n --teil ${parts[3]} --force >> $LOG/check-$n.log; billing
    done
    run scripts/modelltest/check-set.ts --set $n >> $LOG/check-$n.log || { echo "set $n still has repeats (see $LOG/check-$n.log)"; exit 1 }
  done
fi

for n in $SETS; do
  [[ $EXAM == dtz ]] && { echo "== images $n"; run scripts/modelltest/images.ts --set $n > $LOG/images-$n.log || { echo "images $n failed"; exit 1 } }
  for s in hoeren sprechen; do echo "== audio $s $n"; run scripts/modelltest/audio.ts --exam $EXAM --set $n --skill $s > $LOG/audio-$s-$n.log || { echo "audio $s $n failed"; exit 1 }; done
  for s in hoeren lesen schreiben sprechen; do echo "== seed $s $n"; npx tsx --env-file=.env.development.local scripts/modelltest/seed.ts --exam $EXAM --skill $s --set $n 2>&1 | grep -v deprecated > $LOG/seed-$s-$n.log || { echo "seed $s $n failed"; exit 1 }; done
done
echo "ALL DONE: review in /admin/modelltests"
