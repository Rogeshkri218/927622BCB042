class NumberStorage {
  constructor(maxSize = 10) {
    this.maxSize = maxSize;
    this.numbers = [];
  }

  add(number) {
    if (this.numbers.includes(number)) return false;

    if (this.numbers.length >= this.maxSize) {
      this.numbers.shift();
    }
    this.numbers.push(number);
    return true;
  }

  getAll() {
    return [...this.numbers];
  }

  average() {
    if (this.numbers.length === 0) return 0;
    const sum = this.numbers.reduce((acc, val) => acc + val, 0);
    return +(sum / this.numbers.length).toFixed(2);
  }
}

module.exports = NumberStorage;
