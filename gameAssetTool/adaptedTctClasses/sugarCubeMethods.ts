interface Array<T> {
  includesAny: (items: T[]) => boolean;
  includesAll: (items: T[]) => boolean;
  random: () => T;
  delete: (...item: T[]) => void;
  countWith: (predicate: (item: T) => boolean, thisArg?: any) => number;
}
Array.prototype.includesAny = function (items: any[]) {
  for (var item in items) if (this.includes(item)) return true;
  return false;
};
Array.prototype.includesAll = function (items: any[]) {
  for (var item in items) if (!this.includes(item)) return false;
  return true;
};
Array.prototype.random = function () {
  return this[Math.round(Math.random() * this.length)];
};
Array.prototype.delete = function (...items: any[]) {
  for (let item of items)
    do {
      var index: number = this.indexOf(item);
      this.splice(index, index > -1 ? 1 : 0);
    } while (index > -1);
};
Array.prototype.countWith = function (
  predicate: (item: any) => boolean,
  thisArg?: any
) {
  if (!thisArg) thisArg = this;
  return (<any[]>(<unknown>this)).filter((i) => predicate.call(thisArg, i))
    .length;
};
