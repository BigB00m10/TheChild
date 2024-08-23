interface Window {
  serialize: (value: any) => Uint8Array;
  deserialize: (serialized: Uint8Array) => any;
}
(() => {
  let BinSerialType = {
    undefined: 0,
    null: 1,
    NaN: 2,
    Infinity: 3,
    NegativeInfinity: 4,
    boolTrue: 5,
    boolFalse: 6,
    byte: 7,
    sbyte: 8,
    short: 9, //2 bytes
    ushort: 10,
    int24: 11, //3 bytes
    uint24: 12,
    int: 13, //4 bytes
    uint: 14,
    int48: 15, //6 bytes
    uint48: 16,
    bigInt: 17, //arbitrary length integer
    ieee754_32: 18, //Single precision (4 bytes) with floating point
    ieee754_64: 19, //Double precision (8 bytes) with floating point
    string: 20,
    object: 21,
    record: 22, //object where all values are of the same type
    array: 23,
    singleTypeArray: 24, //all values of the array have the same type
    dateTime: 25,
    byteArray: 26,
    clampedByteArray: 27,
    regex: 28,
    symbol: 29, //javascript symbol
    function: 30,
  }; //5bit
  const shiftBytesRight = (value, amount) =>
    Math.floor(value / Math.pow(2, 8 * amount));
  const shiftBytesLeft = (value, amount) => value * Math.pow(2, 8 * amount);
  function writeNumberValue(
    value: number,
    bytes: number[],
    start: number,
    length: number
  ): void {
    for (let byteIndex = start; byteIndex < length; byteIndex++)
      bytes.push(shiftBytesRight(value, byteIndex) & 255);
  }
  function writeTypeLength(
    type: number,
    length: number,
    bytes: number[]
  ): void {
    if (type) {
      bytes.push(type + ((length & 7) << 5));
      length >>= 3;
    }
    let lengthStart = bytes.length;
    if (length > 0xffffffff) bytes.push(255, 0, 0, 0, 0, 0, 0);
    else if (length > 0xffff) bytes.push(254, 0, 0, 0, 0);
    else if (length > 252) bytes.push(253, 0, 0);
    else bytes.push(length);
    for (
      let byteIndex = lengthStart + 1;
      byteIndex < bytes.length;
      byteIndex++
    ) {
      bytes[byteIndex] = length & 255;
      length >>= 8;
    }
  }
  const textEncoder = new TextEncoder();
  const writeStringValue = (value: string, bytes: number[]) =>
    bytes.push(...textEncoder.encode(value));
  function writeInto(value: any, bytes: number[]): void {
    switch (typeof value) {
      case "undefined":
        bytes.push(BinSerialType.undefined);
        break;
      case "number":
        let negative = +(value < 0);
        value = Math.abs(value);
        if (isNaN(value)) bytes.push(BinSerialType.NaN);
        else if (value === Infinity)
          bytes.push(
            negative ? BinSerialType.NegativeInfinity : BinSerialType.Infinity
          );
        else if (value % 1 || value > 0xffffffffffff) {
          let exponent = Math.floor(Math.log(value) / Math.LN2),
            fraction = (value * Math.pow(2, -exponent) - 1) * Math.pow(2, 52);
          bytes.push(BinSerialType.ieee754_64, fraction & 255);
          exponent += 1023;
          writeNumberValue(fraction, bytes, 1, 7);
          bytes[bytes.length - 1] += (exponent << 4) & 255;
          bytes.push((exponent >> 4) + negative * 128);
        } else if (value > 0xffffffff) {
          //Integer that fits in 6 bytes
          bytes.push(negative ? BinSerialType.int48 : BinSerialType.uint48);
          writeNumberValue(value, bytes, 0, 6);
        } else if (value > 0xffffff) {
          bytes.push(negative ? BinSerialType.int : BinSerialType.uint);
          writeNumberValue(value, bytes, 0, 4);
        } else if (value > 0xffff) {
          bytes.push(negative ? BinSerialType.int24 : BinSerialType.uint24);
          writeNumberValue(value, bytes, 0, 3);
        } else if (value > 255) {
          //Integer that fits in 2 bytes
          bytes.push(negative ? BinSerialType.short : BinSerialType.ushort);
          writeNumberValue(value, bytes, 0, 2);
        }
        //Integer that fits in a byte
        else
          bytes.push(
            negative ? BinSerialType.sbyte : BinSerialType.byte,
            value
          );
        break;
      case "bigint":
        let bigIntBytes: number[] = [];
        do {
          bigIntBytes.push(Number(value & 255n));
          value >>= 8n;
        } while (value);
        writeTypeLength(BinSerialType.bigInt, bigIntBytes.length, bytes);
        bytes.push(...bigIntBytes);
        break;
      case "object":
        if (value == null) bytes.push(BinSerialType.null);
        else if (value instanceof Date) {
          bytes.push(BinSerialType.dateTime);
          writeInto(value.getTime(), bytes);
        } else if (value instanceof RegExp) {
          bytes.push(BinSerialType.regex);
          writeStringValue(value.source + "\0", bytes);
          bytes.push(
            +value.global +
              (+value.ignoreCase << 1) +
              (+value.multiline << 2) +
              (+value.dotAll << 3) +
              (+value.unicode << 4) +
              (+value.sticky << 5)
          );
        } else if (Array.isArray(value)) {
          writeTypeLength(BinSerialType.array, value.length, bytes);
          value.forEach((element) => writeInto(element, bytes));
        } else if (
          value instanceof Uint8Array ||
          value instanceof Uint8ClampedArray
        ) {
          writeTypeLength(
            value instanceof Uint8Array
              ? BinSerialType.byteArray
              : BinSerialType.clampedByteArray,
            value.length,
            bytes
          );
          for (let byteIndex = 0; byteIndex < value.length; byteIndex += 32766)
            bytes.push(...value.slice(byteIndex, byteIndex + 32766));
        } else {
          let keys = Object.keys(value);
          writeTypeLength(BinSerialType.object, keys.length, bytes);
          keys.forEach((key: string) => {
            writeTypeLength(0, key.length, bytes);
            writeStringValue(key, bytes);
            writeInto(value[key], bytes);
          });
        }
        break;
      case "string":
        let characterBytes = [];
        writeStringValue(value, characterBytes);
        writeTypeLength(BinSerialType.string, characterBytes.length, bytes);
        bytes.push(...characterBytes);
        break;
      case "boolean":
        if (value) bytes.push(BinSerialType.boolTrue);
        else bytes.push(BinSerialType.boolFalse);
        break;
      default:
        bytes.push(BinSerialType.null);
    }
  }
  window.serialize = (value: any) => {
    let result: number[] = [];
    writeInto(value, result);
    return new Uint8Array(result);
  };
  function readUInt(
    source: Uint8Array,
    offset: number,
    length: number
  ): number {
    let result = source[offset];
    for (let byteIndex = offset + 1; byteIndex < offset + length; byteIndex++)
      result += shiftBytesLeft(source[byteIndex], byteIndex - offset);
    return result;
  }
  function readSize(
    source: Uint8Array,
    offset: number,
    noType: boolean = false
  ): [number, number] {
    if (noType) offset--;
    let size = source[offset + 1];
    let nextIndex = offset + 2;
    switch (size) {
      case 255:
        size = readUInt(source, offset + 2, 6);
        nextIndex += 6;
        break;
      case 254:
        size = readUInt(source, offset + 2, 4);
        nextIndex += 4;
        break;
      case 253:
        size = readUInt(source, offset + 2, 2);
        nextIndex += 2;
        break;
    }
    if (!noType) size = size * Math.pow(2, 3) + (source[offset] >> 5);
    return [size, nextIndex];
  }
  const textDecoder = new TextDecoder();
  const readString = (source: Uint8Array, start: number, end: number): string =>
    textDecoder.decode(source.slice(start, end));
  function readFrom(serialized: Uint8Array, offset: number = 0): [any, number] {
    let type = serialized[offset] & 31;
    switch (type) {
      case BinSerialType.undefined:
        return [undefined, ++offset];
      case BinSerialType.null:
        return [null, ++offset];
      case BinSerialType.NaN:
        return [NaN, ++offset];
      case BinSerialType.Infinity:
        return [Infinity, ++offset];
      case BinSerialType.NegativeInfinity:
        return [-Infinity, ++offset];
      case BinSerialType.boolTrue:
        return [true, ++offset];
      case BinSerialType.boolFalse:
        return [false, ++offset];
      case BinSerialType.byte:
        return [serialized[++offset], ++offset];
      case BinSerialType.sbyte:
        return [-serialized[++offset], ++offset];
      case BinSerialType.short:
        return [-readUInt(serialized, ++offset, 2), offset + 2];
      case BinSerialType.ushort:
        return [readUInt(serialized, ++offset, 2), offset + 2];
      case BinSerialType.int24:
        return [-readUInt(serialized, ++offset, 3), offset + 3];
      case BinSerialType.uint24:
        return [readUInt(serialized, ++offset, 3), offset + 3];
      case BinSerialType.int:
        return [-readUInt(serialized, ++offset, 4), offset + 4];
      case BinSerialType.uint:
        return [readUInt(serialized, ++offset, 4), offset + 4];
      case BinSerialType.int48:
        return [-readUInt(serialized, ++offset, 6), offset + 6];
      case BinSerialType.uint48:
        return [readUInt(serialized, ++offset, 6), offset + 6];
      case BinSerialType.ieee754_64:
        let view = new DataView(serialized.buffer);
        return [view.getFloat64(++offset, true), offset + 8];
      case BinSerialType.byteArray:
      case BinSerialType.clampedByteArray:
        let [baSize, baNextIndex] = readSize(serialized, offset);
        let slice = serialized.slice(baNextIndex, baNextIndex + baSize);
        return [
          type == BinSerialType.byteArray
            ? slice
            : new Uint8ClampedArray(slice),
          baNextIndex + baSize,
        ];
      case BinSerialType.bigInt:
        let [biSize, biNextIndex] = readSize(serialized, offset);
        let bigInt = BigInt(serialized[biNextIndex]);
        for (let byteIndex = 1; byteIndex < biSize; byteIndex++)
          bigInt +=
            BigInt(serialized[biNextIndex + byteIndex]) <<
            BigInt(byteIndex * 8);
        return [bigInt, biNextIndex + biSize];
      case BinSerialType.string:
        let [sSize, sNextIndex] = readSize(serialized, offset),
          sEnd = sNextIndex + sSize;
        return [textDecoder.decode(serialized.slice(sNextIndex, sEnd)), sEnd];
      case BinSerialType.regex:
        let cEnd = serialized.indexOf(0, offset);
        let flagByte = serialized[cEnd + 1];
        let flags = "";
        if (flagByte & 1) flags += "g";
        if (flagByte & 0b10) flags += "i";
        if (flagByte & 0b100) flags += "m";
        if (flagByte & 0b1000) flags += "s";
        if (flagByte & 0b10000) flags += "u";
        if (flagByte & 0b100000) flags += "y";
        return [
          new RegExp(readString(serialized, offset, cEnd), flags),
          cEnd + 2,
        ];
      case BinSerialType.dateTime:
        let [timestamp, afterDate] = readFrom(serialized, offset + 1);
        return [new Date(timestamp), afterDate];
      case BinSerialType.array:
        let [aSize, aNextIndex] = readSize(serialized, offset),
          array = new Array(aSize),
          element: any;
        for (let index = 0; index < aSize; index++) {
          [element, aNextIndex] = readFrom(serialized, aNextIndex);
          array[index] = element;
        }
        return [array, aNextIndex];
      case BinSerialType.object:
        let [oSize, oNextIndex] = readSize(serialized, offset);
        let object = {};
        for (let index = 0; index < oSize; index++) {
          let [sSize, sNextIndex] = readSize(serialized, oNextIndex, true),
            sEnd = sSize + sNextIndex,
            key = readString(serialized, sNextIndex, sEnd);
          [object[key], oNextIndex] = readFrom(serialized, sEnd);
        }
        return [object, oNextIndex];
    }
  }
  window.deserialize = (serialized: Uint8Array) => readFrom(serialized)[0];
})();
