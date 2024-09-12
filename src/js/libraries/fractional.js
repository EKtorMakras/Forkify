/*
  Fraction: an ES6 class to preserve decimal precision in rational number arithmetic
  Notes:
  - reliably preserves decimal precision for floats that can be represented in decimal with 16 decimal places or less
  - for decimals with more than 16 decimal places, precision is preserved up to 16 decimal places
  CONSTRUCTOR:
    constructor([a|Number|Fraction]) => [Fraction]: returns a Fraction from a number
  STATIC METHODS:
    gcd([a|Number], [b|Number]) => [Number]       recursively finds greatest common denominator of a and b
    lcm([a|Number], [b|Number]) => [Number]       finds the lowest common multiple of a and b (depends on gcd(a,b))
  INSTANCE METHODS:
    reduce() => []                                reduces the fraction to simplest terms (used internally to always keep simplest terms)
    add([n|Number|Fraction]) => [Fraction]        returns fraction plus n
    subtract([n|Number|Fraction]) => [Fraction]   returns fraction minus n
    multiply([n|Number|Fraction]) => [Fraction]   returns fraction multiplied by n
    divide([n|Number|Fraction]) => [Fraction]     returns fraction divided by n
    mod([n|Number|Fraction]) => [Fraction]        returns fraction mod n
    lt([n|Number|Fraction]) => [Boolean]          returns true if fraction is less than n
    gt([n|Number|Fraction]) => [Boolean]          returns true if fraction is greater than n
    toNumber() => [Number]                        returns the native Number representation of the fraction
*/

class Fraction {
  constructor(num) {
    if (typeof num === "number") {
      this.numerator = num;
      this.denominator = 1;
    } else if (num instanceof Fraction) {
      this.numerator = num.numerator;
      this.denominator = num.denominator;
    } else {
      throw new Error("Invalid conversion to Fraction");
    }

    // we always want the numerator to be an integer
    // convert float to integer via string manipulation
    // (since multiplication sometimes results in floating point errors)
    if (this.numerator % 1 !== 0) {
      let exp = (this.numerator + "").replace(/^-?\d*\.?|0+$/g, "").length; // count number of decimal places
      this.numerator = parseInt((this.numerator + "").replace(".", "")); // strip decimal point and parse as integer
      this.denominator = Math.pow(10, exp);
    }

    // new fractions should always be in lowest terms
    this.reduce();
  }

  // GCD utility (recursive algorithm)
  static gcd(a, b) {
    return b ? Fraction.gcd(b, a % b) : a;
  }

  // LCM utility (depends on Fraction.gcd)
  static lcm(a, b) {
    return Math.abs(a * b) / Fraction.gcd(a, b);
  }

  // reduces fraction to simplest terms
  reduce() {
    let d = Fraction.gcd(this.numerator, this.denominator);
    this.numerator /= d;
    this.denominator /= d;
  }

  // add a number or fraction to this fraction
  add(n) {
    if (!(n instanceof Fraction)) n = new Fraction(n);
    let output = new Fraction(this); // copy this fraction

    let multiple = Fraction.lcm(output.denominator, n.denominator);
    output.numerator = output.numerator * (multiple / output.denominator) + n.numerator * (multiple / n.denominator);
    output.denominator = multiple;
    output.reduce();
    return output;
  }

  // subtract a number or fraction from this fraction
  subtract(n) {
    if (!(n instanceof Fraction)) n = new Fraction(n);
    let output = new Fraction(this); // copy this fraction

    let multiple = Fraction.lcm(output.denominator, n.denominator);
    output.numerator = output.numerator * (multiple / output.denominator) - n.numerator * (multiple / n.denominator);
    output.denominator = multiple;
    output.reduce();
    return output;
  }

  // multiply this fraction by a number or fraction
  multiply(n) {
    if (!(n instanceof Fraction)) n = new Fraction(n);
    let output = new Fraction(this); // copy this fraction

    output.numerator *= n.numerator;
    output.denominator *= n.denominator;
    output.reduce();
    return output;
  }

  // divide this fraction by a number or fraction
  divide(n) {
    if (!(n instanceof Fraction)) n = new Fraction(n);
    let output = new Fraction(this); // copy this fraction

    output.numerator *= n.denominator;
    output.denominator *= n.numerator;
    output.reduce();
    return output;
  }

  // mod this fraction by a number or fraction (same as JS modulo operator '%')
  mod(n) {
    if (!(n instanceof Fraction)) n = new Fraction(n);
    let output = new Fraction(this); // copy this fraction

    if (output.gt(0)) {
      while (output.gt(n)) {
        output = output.subtract(n);
      }
    } else {
      while (output.lt(n)) {
        output = output.add(n);
      }
    }

    return output.toNumber();
  }

  // check if this fraction is less than a number or fraction
  lt(n) {
    if (!(n instanceof Fraction)) n = new Fraction(n);
    let output = new Fraction(this); // copy this fraction

    return output.toNumber() < n.toNumber();
  }

  // check if this fraction is greater than a number or fraction
  gt(n) {
    if (!(n instanceof Fraction)) n = new Fraction(n);
    let output = new Fraction(this); // copy this fraction

    return output.toNumber() > n.toNumber();
  }

  // get String representation of fraction
  toString() {
    // Check if the fraction is a whole number
    if (this.denominator === 1) {
      return this.numerator.toString();
    } else {
      // Convert the fraction to a string in the format "numerator/denominator"
      return `${this.numerator}/${this.denominator}`;
    }
  }

  // get Number representation of fraction
  toNumber() {
    return this.numerator / this.denominator;
  }

  toMixedNumber() {
    const whole = Math.floor(this.numerator / this.denominator);
    const remainderNumerator = this.numerator % this.denominator;
    if (whole === 0) {
      return this.toString(); // No whole number to display
    } else if (remainderNumerator === 0) {
      return whole.toString(); // It's a whole number, no fraction part
    } else {
      return `${whole} ${remainderNumerator}/${this.denominator}`;
    }
  }
}

export function createFraction(num) {
  // Attempt to parse the input as a number
  const parsedNum = parseFloat(num);

  // Check if the parsing was successful
  if (!isNaN(parsedNum)) {
    // If successful, use the parsed number to create a new Fraction instance
    return new Fraction(parsedNum);
  } else if (num instanceof Fraction) {
    // If the input is already a Fraction instance, return it as is
    return new num();
  } else {
    // If the input cannot be parsed as a number and is not a Fraction instance, return an empty string
    return null;
  }
}
