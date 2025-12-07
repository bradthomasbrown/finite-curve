# finite-curve
This is a simple, minimal implementation of elliptical curve arithmetic over finite fields in TypeScript/JavaScript. 

## Why?
There is surprisingly little information on all aspects of the "cryptographic stack" in JavaScript and elsewhere that is simple and minimal. This repository is part of a series of repositories that builds up this stack from first principles, including:
- [Finite field arithmetic](https://github.com/bradthomasbrown/finite-field)
- Elliptic curves over finite fields (this repository)
- Sponge constructions
- Keccak
- The concrete instances of secp256k1, Keccak-256, and more as well as how these are made from the above concepts
- ECDSA
- Interacting with EVM nodes
- And potentially more

## Dependencies
- [@bradthomasbrown/finite-field](https://github.com/bradthomasbrown/finite-field) (this should be installed when you install the `finite-curve` package, but this is listed here for completeness)

## Installation
```sh
npm i @bradthomasbrown/finite-curve
```

## Usage
```js
import { FiniteField } from "@bradthomasbrown/finite-field";
import { FiniteCurve, FinitePoint } from "@bradthomasbrown/finite-curve";

const p = // secp256k1 field order
      (1n << 256n)
    - (1n << 32n)
    - 977n;
const q = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n; // order n of the generator point of secp256k1
const F = new FiniteField(p);
const G = new FiniteField(q);
const E = new FiniteCurve(F, 0, 7); // secp256k1

const P = new FinitePoint( // generator point of secp256k1
    0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,
    0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n
);
const s = G.reciprocal(2);
const R = new FinitePoint();
E.multiply(R, s, P);
console.log({ x: R.x, y: R.y });
// x: 86918276961810349294276103416548851884759982251107n
// y: 87194829221142880348582938487511785107150118762739500766654458540580527283772n
// # note the relatively extremely low value of x after halving the generator point,
// # a characteristic of SEC 2 curves (https://bitcoin.stackexchange.com/a/113122)
```