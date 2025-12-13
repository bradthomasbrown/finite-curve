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
        const _6f_ = new FinitePoint();
		const _c5_ = new FinitePoint(P.x!, P.y!);
		while (n > 0n) {
			if ((n & 1n) != 0n) this.add(_6f_, _6f_, _c5_);
			this.double(_c5_, _c5_);
			n >>= 1n;
		}
        _6f_.move(Q);
		return Q;
	}

    /**
     * Negate a point in this FiniteField.
     * @param {FinitePoint} P - The point to negate.
     */
    negate(P:FinitePoint):void {
        P.y = this.F.inverse(P.y!);
    }

    /**
     * Given a point with a known `x`, solve for `y` over this elliptic curve.
     * - Note: Method assumes that the order of the field this elliptic curve is over is equivalent to 3 mod 4 and that `x` is a valid `x` coordinate.
     * @param {FinitePoint} P - The point with known `x` to solve for `y`.
     */
    solve_p3mod4(P:FinitePoint):void {
        const _00_ = this.F.power(P.x!, 3);
        const _a5_ = this.F.multiply(this.a, P.x!);
        const _fe_ = this.F.add(_00_, _a5_);
        const _e1_ = this.F.add(_fe_, this.b);
        P.y = this.F.sqrt_p3mod4(_e1_);
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
        if ((x === undefined && y === undefined) || x === Infinity) {
            this.x = undefined;
            this.y = undefined;
            this.isIdentity = true;
        } else {
		    this.x = BigInt(x!);
		    this.y = BigInt(y!);
		    this.isIdentity = false;
        }
	}

    /**
     * Move the properties of this FinitePoint to another FinitePoint.
     * @param {FinitePoint} Q - The FinitePoint that will receive the copied properties.
     */
    move(Q:FinitePoint):void {
        FinitePoint.move(Q, this);
    }

    /**
     * Create a new FinitePoint with properties copied from this FinitePoint.
     * @returns {FinitePoint} A new FinitePoint with properties matching this FinitePoint.
     */
    copy():FinitePoint {
        return FinitePoint.copy(this);
    }

    /**
     * Move the properties of a FinitePoint to another FinitePoint.
     * @param {FinitePoint} P - The FinitePoint whose properties will be copied.
     * @param {FinitePoint} Q - The FinitePoint that will receive the copied properties.
     */
    static move(Q:FinitePoint, P:FinitePoint):void {
        Q.x = P.x;
        Q.y = P.y;
        Q.isIdentity = P.isIdentity;
    }

    /**
     * Create a new FinitePoint with properties copied from a FinitePoint.
     * @param {FinitePoint} P - The FinitePoint to copy.
     * @returns {FinitePoint} A new FinitePoint with properties matching FinitePoint `P`.
     */
    static copy(P:FinitePoint):FinitePoint {
        const Q = new FinitePoint();
        FinitePoint.move(Q, P);
        return Q;
    }

}

export { FinitePoint, FiniteCurve };