class Container {
  static of (value){
    return new Container(value)
  }
  constructor (value) {
    this._value = value;
  }
  map(fn) {
    return Container.of(fn(value));
  }
}

class MayBe {
  constructor (value) {
    this._value = value;
  };
  static of (value) {
    return this.isNothing() ? new MayBe(value) : new MayBe(null);
  }
  isNothing () {
    return this._value ? true : false
  }
  map (fn) {
    return MayBe.of(fn(this._value));
  }
}

exports = {Container, MayBe}
