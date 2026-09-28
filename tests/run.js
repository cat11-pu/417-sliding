import assert from "node:assert";
import { expiredOf, keptOf, allowedAt } from "../sliding.js";
import { step, close } from "../sliderun.js";
import { render } from "../app.js";

const base = {
  budget: 1, window: 5, quota: 3,
  state: { stamps: [], last: -1, refused: [], evicted: 0, asks: [], ledger: [], applied: [] },
  events: [{ id: 1, kind: "ask", at: 1 }],
  bad_at_code: "E_BAD_AT", back_code: "E_BACK",
  event_error_code: "E_BAD_EVENT"
};

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("expiredOf returns a list", () => {
  assert.ok(Array.isArray(expiredOf([1, 2], 8, 5)));
});

check("keptOf returns a list", () => {
  assert.ok(Array.isArray(keptOf([3, 7], 8, 5)));
});

check("allowedAt returns a boolean", () => {
  assert.strictEqual(typeof allowedAt([7], 3), "boolean");
});

check("step returns a state", () => {
  assert.strictEqual(typeof step(base).state, "object");
});

check("render counts events", () => {
  assert.strictEqual(typeof render(base).count_events, "number");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
