import { FiniteField } from "@bradthomasbrown/finite-field";

/**
 * The FiniteCurve class, representing an instance of an elliptic curve over a finite field.
 */
class FiniteCurve {

    /**
     * The finite field this elliptic curve is defined over.
     * @type {FiniteField}
     */
    F:FiniteField

    /**
     * Parameter `a` of the elliptic curve.
     * @type {bigint}
     */
    a:bigint

    /**
     * Parameter `b` of the elliptic curve.
     * @type {bigint}
     */
    b:bigint

    /**
     * Creates an instance of an elliptic curve over a finite field.
     * @param {FiniteField} F - The finite field this elliptic curve is defined over.
     * @param {bigint|number} a - Parameter `a` of the elliptic curve.
     * @param {bigint|number} b - Parameter `b` of the elliptic curve.
     */
	constructor(F:FiniteField, a:bigint|number, b:bigint|number) {
		this.F = F;
		this.a = BigInt(a);
		this.b = BigInt(b);
	}

    /**
     * Add two points over this instance of elliptic curve.
     * @param {FinitePoint} R - The FinitePoint that will receive the sum of P and Q.
     * @param {FinitePoint} P - The augend or first operator of an addition operation.
     * @param {FinitePoint} Q - The addend or second operator of an addition operation.
     * @returns {FinitePoint} The FinitePoint receiving the sum of the addtion operation.
     */
	add(R:FinitePoint, P:FinitePoint, Q:FinitePoint):FinitePoint {
		if (P.isIdentity) {
            R.x = Q.x;
            R.y = Q.y;
            R.isIdentity = Q.isIdentity;
            return R;
        }
		if (Q.isIdentity) {
            R.x = P.x;
            R.y = P.y;
            R.isIdentity = P.isIdentity;
            return R;
        }
		function _5f_() {
			R.x = undefined;
			R.y = undefined;
			R.isIdentity = true;
			return R;
		}
		let _4a_ = undefined;
		if (P.x != Q.x || P.y != Q.y) {
			const _15_ = this.F.subtract(Q.y as bigint, P.y as bigint);
			const _61_ = this.F.subtract(Q.x as bigint, P.x as bigint);
			if (_61_ == 0n) return _5f_();
			const _6e_ = this.F.reciprocal(_61_);
			_4a_ = this.F.multiply(_15_, _6e_);
		} else {
			const _05_ = this.F.multiply(Q.x as bigint, P.x as bigint);
			const _dc_ = this.F.multiply(3n, _05_);
			const _d2_ = this.F.add(_dc_, this.a);
			const _f9_ = this.F.multiply(2n, P.y as bigint);
			if (_f9_ == 0n) return _5f_();
			const _86_ = this.F.reciprocal(_f9_);
			_4a_ = this.F.multiply(_d2_, _86_);
		}
		const _83_ = this.F.multiply(_4a_, _4a_);
		const _38_ = this.F.subtract(_83_, P.x as bigint);
		const _c7_ = this.F.subtract(_38_, Q.x as bigint);
		const _f4_ = this.F.subtract(P.x as bigint, _c7_);
		const _9d_ = this.F.multiply(_4a_, _f4_);
		const _3b_ = this.F.subtract(_9d_, P.y as bigint);
		R.x = _c7_;
		R.y = _3b_;
		R.isIdentity = false;
		return R;
	}

    /**
     * Double a point over this instance of elliptic curve (adding one point to itself)
     * @param {FinitePoint} Q - The FinitePoint where that will receive the doubling of P.
     * @param {FinitePoint} P - The point to be doubled.
     * @returns {FinitePoint} The FinitePoint receiving the doubled point result.
     */
	double(Q:FinitePoint, P:FinitePoint):FinitePoint {
        return this.add(Q, P, P);
    }

    /**
     * Multiply a point by a scalar over this instance of an elliptic curve.
     * @param {FinitePoint} Q - The FinitePoint that will receive the product of n and P.
     * @param {bigint|number} n - The scalar multiplier of the multiplication operation.
     * @param {FinitePoint} P - The FinitePoint multiplicand of the multiplication operation.
     * @returns {FinitePoint} The FinitePoint receiving the product of the multiplication operation.
     */
	multiply(Q:FinitePoint, n:bigint|number, P:FinitePoint):FinitePoint {
        n = BigInt(n);
		Q.x = undefined;
		Q.y = undefined;
		Q.isIdentity = true;
		const _c5_ = new FinitePoint(P.x as bigint, P.y as bigint);
		while (n > 0n) {
			if ((n & 1n) != 0n) this.add(Q, Q, _c5_);
			this.double(_c5_, _c5_);
			n >>= 1n;
		}
		return Q;
	}

    pointAt(x:bigint|number, y:bigint|number):FinitePoint
    pointAt(x:number):FinitePoint
	pointAt(x:bigint|number, y?:bigint|number):FinitePoint {
        if (x == Infinity || y === undefined) return new FinitePoint();
		return new FinitePoint(x, y);
	}

}

/**
 * The FinitePoint class, representing an instance of a point on an elliptic curve over a finite field.
 */
class FinitePoint {

    x:bigint|undefined
    y:bigint|undefined
    isIdentity:boolean

    constructor(x:bigint|number, y:bigint|number)
    constructor()
    constructor(x:number)
	constructor(x?:bigint|number, y?:bigint|number) {
		this.x = typeof x == "number" ? BigInt(x) : x;
		this.y = typeof y == "number" ? BigInt(y) : y;
		this.isIdentity = x === undefined && y === undefined;
	}

}

export { FiniteCurve, FinitePoint };