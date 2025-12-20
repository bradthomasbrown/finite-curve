import { FiniteField as FiniteField0 } from "ff_a";
import { FiniteField as FiniteField1 } from "@bradthomasbrown/finite-field/p3mod4";
import { FiniteCurve as FiniteCurve0 } from "fc_a";
import { FiniteCurve as FiniteCurve1 } from "./dist/finite-curve.js";
import { FinitePoint } from "./dist/finite-curve.js";

const p = 95;
const F0 = new FiniteField0(p);
const F1 = new FiniteField1(p);
const E0 = new FiniteCurve0(F0, 2, 3);
const E1 = new FiniteCurve1(F1, 2, 3);

console.log("sqrt");
for (let i = 1; i < p; i++) {
    const s0 = F0.sqrt_p3mod4(i);
    const s1 = F1.sqrt(i);
    console.log(`\t${i}, ${s1} === ${s0}, ${s1 === s0}`);
    if (s1 !== s0) throw new Error(`mismatch on a = ${i}, [${s0} ${s1}]`);
}

console.log("solve");
for (let i = 0n; i < p; i++) {
    const P0 = new FinitePoint(); P0.x = i;
    const P1 = new FinitePoint(); P1.x = i;
    E0.solve_p3mod4(P0);
    E1.solve(P1);
    console.log(`\t${i}, (${P0.x}, ${P0.y}) === (${P1.x}, ${P1.y}), ${P1.equals(P0)}`);
    if (!P1.equals(P0)) throw new Error(`mismatch on ${i}, [(${P0.x}, ${P0.y}) != (${P1.x}, ${P1.y}`);
}