interface Window {
  unpack: (base92: string) => any;
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
  const shiftBytesLeft = (value: number, amount: number) =>
    value * Math.pow(2, 8 * amount);
  let S = Uint8Array,
    kKatz = Uint16Array,
    ZnKatz = Int32Array,
    pnKatz = new S([
      0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5,
      5, 5, 5, 0, 0, 0, 0,
    ]),
    ynKatz = new S([
      0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10,
      11, 11, 12, 12, 13, 13, 0, 0,
    ]),
    BnKatz = new S([
      16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
    ]),
    MrKatz = function (r: Uint8Array, n: number) {
      for (var t = new kKatz(31), e = 0; e < 31; ++e) t[e] = n += 1 << r[e - 1];
      for (var i = new ZnKatz(t[30]), e = 1; e < 30; ++e)
        for (var a = t[e]; a < t[e + 1]; ++a) i[a] = ((a - t[e]) << 5) | e;
      return { b: t, r: i };
    },
    SrKatz = MrKatz(pnKatz, 2),
    nrKatz = SrKatz.b,
    HnKatz = SrKatz.r;
  (nrKatz[28] = 258), (HnKatz[258] = 28);
  for (
    var UrKatz = MrKatz(ynKatz, 0),
      FrKatz = UrKatz.b,
      EnKatz = new kKatz(32768),
      OKatz = 0;
    OKatz < 32768;
    ++OKatz
  ) {
    var enKatz = ((OKatz & 43690) >> 1) | ((OKatz & 21845) << 1);
    (enKatz = ((enKatz & 52428) >> 2) | ((enKatz & 13107) << 2)),
      (enKatz = ((enKatz & 61680) >> 4) | ((enKatz & 3855) << 4)),
      (EnKatz[OKatz] = (((enKatz & 65280) >> 8) | ((enKatz & 255) << 8)) >> 1);
  }
  for (
    var QKatz = function (r: Uint8Array, n: number, t: number) {
        for (var e = r.length, i = 0, a = new kKatz(n); i < e; ++i)
          r[i] && ++a[r[i] - 1];
        var o = new kKatz(n);
        for (i = 1; i < n; ++i) o[i] = (o[i - 1] + a[i - 1]) << 1;
        var s: Uint16Array;
        if (t) {
          s = new kKatz(1 << n);
          var l = 15 - n;
          for (i = 0; i < e; ++i)
            if (r[i])
              for (
                var f = (i << 4) | r[i],
                  h = n - r[i],
                  u = o[r[i] - 1]++ << h,
                  v = u | ((1 << h) - 1);
                u <= v;
                ++u
              )
                s[EnKatz[u] >> l] = f;
        } else
          for (s = new kKatz(e), i = 0; i < e; ++i)
            r[i] && (s[i] = EnKatz[o[r[i] - 1]++] >> (15 - r[i]));
        return s;
      },
      tnKatz = new S(288),
      OKatz = 0;
    OKatz < 144;
    ++OKatz
  )
    tnKatz[OKatz] = 8;
  for (var OKatz = 144; OKatz < 256; ++OKatz) tnKatz[OKatz] = 9;
  for (var OKatz = 256; OKatz < 280; ++OKatz) tnKatz[OKatz] = 7;
  for (var OKatz = 280; OKatz < 288; ++OKatz) tnKatz[OKatz] = 8;
  for (var wnKatz = new S(32), OKatz = 0; OKatz < 32; ++OKatz)
    wnKatz[OKatz] = 5;
  let unpacker = {
    bufferLen: 16384,
    buffer: new S(16384),
    decoder: new TextDecoder(),
    mapping: new S(256).fill(255),
    table: [
      32, 33, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
      51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68,
      69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
      87, 88, 89, 90, 91, 93, 94, 95, 97, 98, 99, 100, 101, 102, 103, 104, 105,
      106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
      121, 122, 123, 124, 125, 126,
    ],
    maybeExtendMemory: (e: number) => {
      (e = (0 | e) >>> 0),
        (unpacker.buffer = new S((e + (e & unpacker.bufferLen)) | 0));
    },
    setMemory: (e: number, t: number) =>
      (unpacker.buffer[(0 | e) >>> 0] = 255 & (0 | t)),
    decode128bitsChars: (chars: Uint8Array) => {
      (chars[0] = 255 & unpacker.mapping[0 | chars[0]]),
        (chars[1] = 255 & unpacker.mapping[0 | chars[1]]),
        (chars[2] = 255 & unpacker.mapping[0 | chars[2]]),
        (chars[3] = 255 & unpacker.mapping[0 | chars[3]]),
        (chars[4] = 255 & unpacker.mapping[0 | chars[4]]),
        (chars[5] = 255 & unpacker.mapping[0 | chars[5]]),
        (chars[6] = 255 & unpacker.mapping[0 | chars[6]]),
        (chars[7] = 255 & unpacker.mapping[0 | chars[7]]),
        (chars[8] = 255 & unpacker.mapping[0 | chars[8]]),
        (chars[9] = 255 & unpacker.mapping[0 | chars[9]]),
        (chars[10] = 255 & unpacker.mapping[0 | chars[10]]),
        (chars[11] = 255 & unpacker.mapping[0 | chars[11]]),
        (chars[12] = 255 & unpacker.mapping[0 | chars[12]]),
        (chars[13] = 255 & unpacker.mapping[0 | chars[13]]),
        (chars[14] = 255 & unpacker.mapping[0 | chars[14]]),
        (chars[15] = 255 & unpacker.mapping[0 | chars[15]]);
    },
    decode128bitsString: (buffer: Uint8Array, str: string, offset: number) => (
      (buffer[0] = 255 & str.charCodeAt(0 | offset)),
      (buffer[1] = 255 & str.charCodeAt((offset + 1) | 0)),
      (buffer[2] = 255 & str.charCodeAt((offset + 2) | 0)),
      (buffer[3] = 255 & str.charCodeAt((offset + 3) | 0)),
      (buffer[4] = 255 & str.charCodeAt((offset + 4) | 0)),
      (buffer[5] = 255 & str.charCodeAt((offset + 5) | 0)),
      (buffer[6] = 255 & str.charCodeAt((offset + 6) | 0)),
      (buffer[7] = 255 & str.charCodeAt((offset + 7) | 0)),
      (buffer[8] = 255 & str.charCodeAt((offset + 8) | 0)),
      (buffer[9] = 255 & str.charCodeAt((offset + 9) | 0)),
      (buffer[10] = 255 & str.charCodeAt((offset + 10) | 0)),
      (buffer[11] = 255 & str.charCodeAt((offset + 11) | 0)),
      (buffer[12] = 255 & str.charCodeAt((offset + 12) | 0)),
      (buffer[13] = 255 & str.charCodeAt((offset + 13) | 0)),
      (buffer[14] = 255 & str.charCodeAt((offset + 14) | 0)),
      (buffer[15] = 255 & str.charCodeAt((offset + 15) | 0)),
      buffer
    ),
    decodeChar: (value: number) =>
      (0 | unpacker.mapping[(0 | value) >>> 0]) >>> 0,
    getMemorySubarray: (e: number, t: number) =>
      unpacker.buffer.subarray(
        0 | (e = (0 | e) >>> 0),
        0 | (t = (0 | t) >>> 0)
      ),
    V: (r: Uint8Array, n: number, t: number) => {
      let e = (n / 8) | 0;
      return ((r[e] | (r[e + 1] << 8)) >> (n & 7)) & t;
    },
    Tr: QKatz(tnKatz, 9, 1),
    Ir: QKatz(wnKatz, 5, 1),
    Nn: (r: Uint8Array) => {
      for (var n = r[0], t = 1; t < r.length; ++t) r[t] > n && (n = r[t]);
      return n;
    },
    c: (r: number, n?: string) => {
      throw new Error(n || "");
    },
    mn: (r: number) => ((r + 7) / 8) | 0,
    Rn: (r: Uint8Array, n: number) => {
      var t = (n / 8) | 0;
      return (r[t] | (r[t + 1] << 8) | (r[t + 2] << 16)) >> (n & 7);
    },
    X: (r: Uint8Array, n: number, t: number) => (
      (n == null || n < 0) && (n = 0),
      (t == null || t > r.length) && (t = r.length),
      new S(r.subarray(n, t))
    ),
  };
  function readUInt(source: Uint8Array, offset: number, length: number): number {
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
  const readString = (source: Uint8Array, start: number, end: number): string =>
    unpacker.decoder.decode(source.slice(start, end));
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
        return [
          unpacker.decoder.decode(serialized.slice(sNextIndex, sEnd)),
          sEnd,
        ];
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
  unpacker.table.forEach(
    (value, index) => (unpacker.mapping[value] = 255 & index)
  );
  window.unpack = (base92: string): any => {
    var b92offset = 0,
      deflatedLen = 0,
      ob92 = 0,
      ib92 = 0,
      ub92 = new S(64),
      sb92 = ub92.subarray(0, 16),
      cb92 = ub92.subarray(16, 32),
      ab92 = ub92.subarray(32, 48),
      _b92 = ub92.subarray(48, 64),
      im = Math.imul,
      b92len = base92.length,
      Cb92 = (b92len - 65) | 0;
    if (
      (unpacker.maybeExtendMemory(((13 * b92len + (b92len % 2) * 6) / 8) | 0),
      0 == ((base92.charCodeAt(0) - 126) | 0) || 0 == (0 | b92len))
    )
      return S.of(126);
    if ((0 | b92len) < 2) return S.of();
    var db92 = unpacker.setMemory.bind(unpacker);
    function yb92(e: Uint8Array) {
      Eb92(e, 0),
        Eb92(e, 2),
        Eb92(e, 4),
        Eb92(e, 6),
        Eb92(e, 8),
        Eb92(e, 10),
        Eb92(e, 12),
        Eb92(e, 14);
    }
    function Eb92(buffer: Uint8Array, offset: number) {
      for (
        ob92 =
          (ob92 << 13) |
          (im(buffer[0 | offset], 91) + buffer[(offset + 1) | 0]) |
          0,
          ib92 = ((ib92 + 13) | 0) >>> 0;
        8 <= (0 | ib92);

      )
        db92(0 | deflatedLen, (ob92 >> (ib92 - 8)) & 255),
          (deflatedLen = ((deflatedLen + 1) | 0) >>> 0),
          (ib92 = ((ib92 - 8) | 0) >>> 0);
    }
    for (
      ;
      (0 | b92offset) < (0 | Cb92);
      b92offset = ((b92offset + 64) | 0) >>> 0
    )
      unpacker.decode128bitsChars(
        unpacker.decode128bitsString(sb92, base92, 0 | b92offset)
      ),
        unpacker.decode128bitsChars(
          unpacker.decode128bitsString(cb92, base92, (b92offset + 16) | 0)
        ),
        unpacker.decode128bitsChars(
          unpacker.decode128bitsString(ab92, base92, (b92offset + 32) | 0)
        ),
        unpacker.decode128bitsChars(
          unpacker.decode128bitsString(_b92, base92, (b92offset + 48) | 0)
        ),
        yb92(sb92),
        yb92(cb92),
        yb92(ab92),
        yb92(_b92);
    for (
      ;
      (0 | b92offset) < ((b92len - 1) | 0);
      b92offset = ((b92offset + 2) | 0) >>> 0
    )
      for (
        sb92[0] = unpacker.decodeChar(base92.charCodeAt(0 | b92offset)),
          sb92[1] = unpacker.decodeChar(base92.charCodeAt((b92offset + 1) | 0)),
          ob92 = (ob92 << 13) | (im(sb92[0], 91) + sb92[1]) | 0,
          ib92 = ((ib92 + 13) | 0) >>> 0;
        8 <= (0 | ib92);

      )
        unpacker.setMemory(0 | deflatedLen, (ob92 >> (ib92 - 8)) & 255),
          (deflatedLen = ((deflatedLen + 1) | 0) >>> 0),
          (ib92 = ((ib92 - 8) | 0) >>> 0);
    if (b92len % 2 == 1)
      for (
        ob92 =
          (ob92 << 6) |
          unpacker.decodeChar(base92.charCodeAt((b92len - 1) | 0)),
          ib92 = ((ib92 + 6) | 0) >>> 0;
        8 <= (0 | ib92);

      )
        unpacker.setMemory(0 | deflatedLen, (ob92 >> (ib92 - 8)) & 255),
          (deflatedLen = ((deflatedLen + 1) | 0) >>> 0),
          (ib92 = ((ib92 - 8) | 0) >>> 0);
    let deflated = unpacker.buffer.subarray(0, 0 | ((0 | deflatedLen) >>> 0));
    let prop: any = {},
      i = deflated.length,
      t = new S(i * 3),
      e: number[],
      a = 0,
      l = 2;
    var f = function (Cn: number) {
        let In = t.length;
        if (Cn > In) {
          let gn = new S(Math.max(In * 2, Cn));
          gn.set(t), (t = gn);
        }
      },
      h = 0,
      u = 0,
      v = 0,
      M: Uint16Array,
      m: Uint16Array,
      x: number,
      g: number,
      z = i * 8;
    do {
      if (!M) {
        h = unpacker.V(deflated, u, 1);
        let U = unpacker.V(deflated, u + 1, 3);
        if (((u += 3), U))
          if (U == 1) (M = unpacker.Tr), (m = unpacker.Ir), (x = 9), (g = 5);
          else if (U == 2) {
            let Z = unpacker.V(deflated, u, 31) + 257,
              D = unpacker.V(deflated, u + 10, 15) + 4,
              w = Z + unpacker.V(deflated, u + 5, 31) + 1;
            u += 14;
            for (var p = new S(w), F = new S(19), T = 0; T < D; ++T)
              F[BnKatz[T]] = unpacker.V(deflated, u + T * 3, 7);
            u += D * 3;
            for (
              let G = unpacker.Nn(F),
                H = (1 << G) - 1,
                E = QKatz(F, G, 1),
                T = 0;
              T < w;

            ) {
              let L = E[unpacker.V(deflated, u, H)];
              u += L & 15;
              let A = L >> 4;
              if (A < 16) p[T++] = A;
              else {
                let q = 0,
                  B = 0;
                for (
                  A == 16
                    ? ((B = 3 + unpacker.V(deflated, u, 3)),
                      (u += 2),
                      (q = p[T - 1]))
                    : A == 17
                    ? ((B = 3 + unpacker.V(deflated, u, 7)), (u += 3))
                    : A == 18 &&
                      ((B = 11 + unpacker.V(deflated, u, 127)), (u += 7));
                  B--;

                )
                  p[T++] = q;
              }
            }
            let R = p.subarray(0, Z),
              N = p.subarray(Z);
            (x = unpacker.Nn(R)),
              (g = unpacker.Nn(N)),
              (M = QKatz(R, x, 1)),
              (m = QKatz(N, g, 1));
          } else unpacker.c(1);
        else {
          let A = unpacker.mn(u) + 4,
            y = deflated[A - 4] | (deflated[A - 3] << 8),
            I = A + y;
          if (I > i) {
            l && unpacker.c(0);
            break;
          }
          f(v + y),
            t.set(deflated.subarray(A, I), v),
            (prop.b = v += y),
            (prop.p = u = I * 8),
            (prop.f = h);
          continue;
        }
        if (u > z) {
          l && unpacker.c(0);
          break;
        }
      }
      f(v + 131072);
      for (var hn = (1 << x) - 1, Y = (1 << g) - 1, rn = u; ; rn = u) {
        let q = M[unpacker.Rn(deflated, u) & hn],
          J = q >> 4;
        if (((u += q & 15), u > z)) {
          l && unpacker.c(0);
          break;
        }
        if ((q || unpacker.c(2), J < 256)) t[v++] = J;
        else if (J == 256) {
          (rn = u), (M = null);
          break;
        } else {
          let K = J - 254;
          if (J > 264) {
            let T = J - 257,
              P = pnKatz[T];
            (K = unpacker.V(deflated, u, (1 << P) - 1) + nrKatz[T]), (u += P);
          }
          let _ = m[unpacker.Rn(deflated, u) & Y],
            vn = _ >> 4;
          _ || unpacker.c(3), (u += _ & 15);
          let N = FrKatz[vn];
          if (vn > 3) {
            let P = ynKatz[vn];
            (N += unpacker.Rn(deflated, u) & ((1 << P) - 1)), (u += P);
          }
          if (u > z) {
            l && unpacker.c(0);
            break;
          }
          f(v + 131072);
          let cn = v + K;
          if (v < N) {
            let Pn = a - N,
              $n = Math.min(N, cn);
            for (Pn + v < 0 && unpacker.c(3); v < $n; ++v) t[v] = e[Pn + v];
          }
          for (; v < cn; ++v) t[v] = t[v - N];
        }
      }
      (prop.l = M),
        (prop.p = rn),
        (prop.b = v),
        (prop.f = h),
        M && ((h = 1), (prop.m = x), (prop.d = m), (prop.n = g));
    } while (!h);
    return readFrom(unpacker.X(t, 0, v))[0];
  };
})();
let unpack = window.unpack;
