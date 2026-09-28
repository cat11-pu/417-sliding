// app.js：渲染结果
import { expiredOf, keptOf, allowedAt } from "./sliding.js";
import { step, close } from "./sliderun.js";

export function render(spec) {
  const events = spec.events || [];
  const half = Math.ceil(events.length / 2);
  const first = step(spec);
  const closed = close(Object.assign({}, spec, { state: first.state }));
  const r1 = step(Object.assign({}, spec, { events: events.slice(0, half) }));
  const r2 = step(Object.assign({}, spec, { state: r1.state, events: events.slice(half) }));
  const closedTwo = close(Object.assign({}, spec, { state: r2.state }));
  const replay = step(Object.assign({}, spec, { state: closed.state }));
  const wide = step(Object.assign({}, spec, { budget: spec.budget + 2 }));
  const full = step(Object.assign({}, spec, { events: events, budget: events.length + 2 }));
  const fullClosed = close(Object.assign({}, spec, { state: full.state }));
  const fingerprint = function (state) {
    return JSON.stringify({
      stamps: state.stamps, last: state.last, refused: state.refused,
      evicted: state.evicted, asks: state.asks, ledger: state.ledger,
      applied: state.applied.length
    });
  };
  return { stamps: closed.state.stamps.slice(),
           refused: closed.state.refused.map(function (row) { return [row[0]]; }),
           evicted: closed.state.evicted,
           asks: closed.state.asks.map(function (row) { return [row[0], row[1]]; }),
           served_first: first.served, served_wide: wide.served,
           pair_differs: first.served !== wide.served,
           ledger_before: first.ledger_before, ledger: first.ledger,
           catchup_n: closed.catchup, ledger_after: closed.state.ledger.length,
           mid_differs: fingerprint(r2.state) !== fingerprint(first.state),
           closed_equal: fingerprint(closedTwo.state) === fingerprint(closed.state),
           replay_new: replay.served, judged: first.judged, judged_bound: first.judged_bound,
           full_diff: fingerprint(closed.state) === fingerprint(fullClosed.state) ? 0 : 1,
           count_events: events.length,
           tail: expiredOf([1, 2, 3], 8, 5).length + keptOf([3, 7], 8, 5).length
             + (allowedAt([7], 3) ? 1 : 0) };
}
