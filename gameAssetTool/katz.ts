interface Window {
  Katz: any;
}
(function () {
  var S = Uint8Array,
    k = Uint16Array,
    Zn = Int32Array,
    pn = new S([
      0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5,
      5, 5, 5, 0, 0, 0, 0,
    ]),
    yn = new S([
      0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10,
      11, 11, 12, 12, 13, 13, 0, 0,
    ]),
    Bn = new S([
      16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
    ]),
    Mr = function (r: Uint8Array, n: number) {
      for (var t = new k(31), e = 0; e < 31; ++e) t[e] = n += 1 << r[e - 1];
      for (var i = new Zn(t[30]), e = 1; e < 30; ++e)
        for (var a = t[e]; a < t[e + 1]; ++a) i[a] = ((a - t[e]) << 5) | e;
      return { b: t, r: i };
    },
    Sr = Mr(pn, 2),
    nr = Sr.b,
    Hn = Sr.r;
  (nr[28] = 258), (Hn[258] = 28);
  for (
    var Ur = Mr(yn, 0), Fr = Ur.b, rr = Ur.r, En = new k(32768), O = 0;
    O < 32768;
    ++O
  ) {
    var en = ((O & 43690) >> 1) | ((O & 21845) << 1);
    (en = ((en & 52428) >> 2) | ((en & 13107) << 2)),
      (en = ((en & 61680) >> 4) | ((en & 3855) << 4)),
      (En[O] = (((en & 65280) >> 8) | ((en & 255) << 8)) >> 1);
  }
  for (
    var Q = function (r: Uint8Array, n: number, t: number) {
        for (var e = r.length, i = 0, a = new k(n); i < e; ++i)
          r[i] && ++a[r[i] - 1];
        var o = new k(n);
        for (i = 1; i < n; ++i) o[i] = (o[i - 1] + a[i - 1]) << 1;
        var s: Uint16Array;
        if (t) {
          s = new k(1 << n);
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
                s[En[u] >> l] = f;
        } else
          for (s = new k(e), i = 0; i < e; ++i)
            r[i] && (s[i] = En[o[r[i] - 1]++] >> (15 - r[i]));
        return s;
      },
      tn = new S(288),
      O = 0;
    O < 144;
    ++O
  )
    tn[O] = 8;
  for (var O = 144; O < 256; ++O) tn[O] = 9;
  for (var O = 256; O < 280; ++O) tn[O] = 7;
  for (var O = 280; O < 288; ++O) tn[O] = 8;
  for (var wn = new S(32), O = 0; O < 32; ++O) wn[O] = 5;
  var Dr = Q(tn, 9, 0),
    Tr = Q(tn, 9, 1),
    Cr = Q(wn, 5, 0),
    Ir = Q(wn, 5, 1),
    Nn = function (r: Uint8Array) {
      for (var n = r[0], t = 1; t < r.length; ++t) r[t] > n && (n = r[t]);
      return n;
    },
    V = function (r: Uint8Array, n, t) {
      var e = (n / 8) | 0;
      return ((r[e] | (r[e + 1] << 8)) >> (n & 7)) & t;
    },
    Rn = function (r: Uint8Array, n) {
      var t = (n / 8) | 0;
      return (r[t] | (r[t + 1] << 8) | (r[t + 2] << 16)) >> (n & 7);
    },
    mn = function (r: number) {
      return ((r + 7) / 8) | 0;
    },
    X = function (r: Uint8Array, n, t) {
      return (
        (n == null || n < 0) && (n = 0),
        (t == null || t > r.length) && (t = r.length),
        new S(r.subarray(n, t))
      );
    },
    Zr = [
      "unexpected EOF",
      "invalid block type",
      "invalid length/literal",
      "invalid distance",
      "stream finished",
      "no stream handler",
      ,
      "no callback",
      "invalid UTF-8 data",
      "extra field too long",
      "date not in range 1980-2099",
      "filename too long",
      "stream finishing",
      "invalid zip data",
    ],
    c = (r: number, n?: string) => {
      throw new Error(n || Zr[r]);
    },
    nn = function (r: Uint8Array, n: number, t: number) {
      t <<= n & 7;
      var e = (n / 8) | 0;
      (r[e] |= t), (r[e + 1] |= t >> 8);
    },
    zn = function (r: Uint8Array, n: number, t: number) {
      t <<= n & 7;
      var e = (n / 8) | 0;
      (r[e] |= t), (r[e + 1] |= t >> 8), (r[e + 2] |= t >> 16);
    },
    kn = function (r: Uint16Array, n: number) {
      for (var t = [], e = 0; e < r.length; ++e)
        r[e] && t.push({ s: e, f: r[e] });
      var i = t.length,
        a = t.slice();
      if (!i) return { t: an, l: 0 };
      if (i == 1) {
        var o = new S(t[0].s + 1);
        return (o[t[0].s] = 1), { t: o, l: 1 };
      }
      t.sort(function (I, Z) {
        return I.f - Z.f;
      }),
        t.push({ s: -1, f: 25001 });
      var s = t[0],
        l = t[1],
        f = 0,
        h = 1,
        u = 2;
      for (t[0] = { s: -1, f: s.f + l.f, l: s, r: l }; h != i - 1; )
        (s = t[t[f].f < t[u].f ? f++ : u++]),
          (l = t[f != h && t[f].f < t[u].f ? f++ : u++]),
          (t[h++] = { s: -1, f: s.f + l.f, l: s, r: l });
      for (var v = a[0].s, e = 1; e < i; ++e) a[e].s > v && (v = a[e].s);
      var M = new k(v + 1),
        m = Wn(t[h - 1], M, 0);
      if (m > n) {
        var e = 0,
          x = 0,
          g = m - n,
          z = 1 << g;
        for (
          a.sort(function (Z, D) {
            return M[D.s] - M[Z.s] || Z.f - D.f;
          });
          e < i;
          ++e
        ) {
          var U = a[e].s;
          if (M[U] > n) (x += z - (1 << (m - M[U]))), (M[U] = n);
          else break;
        }
        for (x >>= g; x > 0; ) {
          var A = a[e].s;
          M[A] < n ? (x -= 1 << (n - M[A]++ - 1)) : ++e;
        }
        for (; e >= 0 && x; --e) {
          var y = a[e].s;
          M[y] == n && (--M[y], ++x);
        }
        m = n;
      }
      return { t: new S(M), l: m };
    },
    Wn = function (r: any, n: Uint16Array, t: number) {
      return r.s == -1
        ? Math.max(Wn(r.l, n, t + 1), Wn(r.r, n, t + 1))
        : (n[r.s] = t);
    },
    tr = function (r: Uint8Array) {
      for (var n = r.length; n && !r[--n]; );
      for (
        var t = new k(++n),
          e = 0,
          i = r[0],
          a = 1,
          o = function (l: number) {
            t[e++] = l;
          },
          s = 1;
        s <= n;
        ++s
      )
        if (r[s] == i && s != n) ++a;
        else {
          if (!i && a > 2) {
            for (; a > 138; a -= 138) o(32754);
            a > 2 &&
              (o(a > 10 ? ((a - 11) << 5) | 28690 : ((a - 3) << 5) | 12305),
              (a = 0));
          } else if (a > 3) {
            for (o(i), --a; a > 6; a -= 6) o(8304);
            a > 2 && (o(((a - 3) << 5) | 8208), (a = 0));
          }
          for (; a--; ) o(i);
          (a = 1), (i = r[s]);
        }
      return { c: t.subarray(0, e), n };
    },
    xn = function (r: Uint16Array, n: Uint8Array) {
      for (var t = 0, e = 0; e < n.length; ++e) t += r[e] * n[e];
      return t;
    },
    er = function (r: Uint8Array, n: number, t: Uint8Array) {
      var e = t.length,
        i = mn(n + 2);
      (r[i] = e & 255),
        (r[i + 1] = e >> 8),
        (r[i + 2] = r[i] ^ 255),
        (r[i + 3] = r[i + 1] ^ 255);
      for (var a = 0; a < e; ++a) r[i + a + 4] = t[a];
      return (i + 4 + e) * 8;
    },
    ir = function (
      r: Uint8Array,
      n: Uint8Array,
      t: number,
      e: Int32Array,
      i: Uint16Array,
      a: Uint16Array,
      o: number,
      s: number,
      l: number,
      f: number,
      h: number
    ) {
      nn(n, h++, t), ++i[256];
      for (
        var u = kn(i, 15),
          v = u.t,
          M = u.l,
          m = kn(a, 15),
          x = m.t,
          g = m.l,
          z = tr(v),
          U = z.c,
          A = z.n,
          y = tr(x),
          I = y.c,
          Z = y.n,
          D = new k(19),
          w = 0;
        w < U.length;
        ++w
      )
        ++D[U[w] & 31];
      for (var w = 0; w < I.length; ++w) ++D[I[w] & 31];
      for (
        var p = kn(D, 7), F = p.t, T = p.l, G = 19;
        G > 4 && !F[Bn[G - 1]];
        --G
      );
      var H = (f + 5) << 3,
        E = xn(i, tn) + xn(a, wn) + o,
        L =
          xn(i, v) +
          xn(a, x) +
          o +
          14 +
          3 * G +
          xn(D, F) +
          2 * D[16] +
          3 * D[17] +
          7 * D[18];
      if (l >= 0 && H <= E && H <= L) return er(n, h, r.subarray(l, l + f));
      let q: Uint16Array, B: Uint8Array, R: Uint16Array, N: Uint8Array;
      if ((nn(n, h, 1 + (L < E ? 1 : 0)), (h += 2), L < E)) {
        (q = Q(v, M, 0)), (B = v), (R = Q(x, g, 0)), (N = x);
        let hn = Q(F, T, 0);
        nn(n, h, A - 257), nn(n, h + 5, Z - 1), nn(n, h + 10, G - 4), (h += 14);
        for (let w = 0; w < G; ++w) nn(n, h + 3 * w, F[Bn[w]]);
        h += 3 * G;
        for (let Y = [U, I], rn = 0; rn < 2; ++rn)
          for (let J = Y[rn], w = 0; w < J.length; ++w) {
            let K = J[w] & 31;
            nn(n, h, hn[K]),
              (h += F[K]),
              K > 15 && (nn(n, h, (J[w] >> 5) & 127), (h += J[w] >> 12));
          }
      } else (q = Dr), (B = tn), (R = Cr), (N = wn);
      for (let w = 0; w < s; ++w) {
        let P = e[w];
        if (P > 255) {
          var K = (P >> 18) & 31;
          zn(n, h, q[K + 257]),
            (h += B[K + 257]),
            K > 7 && (nn(n, h, (P >> 23) & 31), (h += pn[K]));
          var _ = P & 31;
          zn(n, h, R[_]),
            (h += N[_]),
            _ > 3 && (zn(n, h, (P >> 5) & 8191), (h += yn[_]));
        } else zn(n, h, q[P]), (h += B[P]);
      }
      return zn(n, h, q[256]), h + B[256];
    },
    Br = new Zn([
      65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632,
    ]),
    an = new S(0),
    Er = function (
      r: Uint8Array,
      n: number,
      t: number,
      e: number,
      i: number,
      a: any
    ) {
      let o = a.z || r.length,
        s = new S(e + o + 5 * (1 + Math.ceil(o / 7e3)) + i),
        l = s.subarray(e, s.length - i),
        f = a.l,
        h = (a.r || 0) & 7;
      if (n) {
        h && (l[0] = a.r >> 3);
        for (
          var u = Br[n - 1],
            v = u >> 13,
            M = u & 8191,
            m = (1 << t) - 1,
            x = a.p || new k(32768),
            g = a.h || new k(m + 1),
            z = Math.ceil(t / 3),
            U = 2 * z,
            A = function (_n: number) {
              return (r[_n] ^ (r[_n + 1] << z) ^ (r[_n + 2] << U)) & m;
            },
            y = new Zn(25e3),
            I = new k(288),
            Z = new k(32),
            D = 0,
            w = 0,
            p = a.i || 0,
            F = 0,
            T = a.w || 0,
            G = 0;
          p + 2 < o;
          ++p
        ) {
          var H = A(p),
            E = p & 32767,
            L = g[H];
          if (((x[E] = L), (g[H] = E), T <= p)) {
            var q = o - p;
            if ((D > 7e3 || F > 24576) && (q > 423 || !f)) {
              (h = ir(r, l, 0, y, I, Z, w, F, G, p - G, h)),
                (F = D = w = 0),
                (G = p);
              for (var B = 0; B < 286; ++B) I[B] = 0;
              for (var B = 0; B < 30; ++B) Z[B] = 0;
            }
            var R = 2,
              N = 0,
              hn = M,
              Y = (E - L) & 32767;
            if (q > 2 && H == A(p - Y))
              for (
                var rn = Math.min(v, q) - 1,
                  J = Math.min(32767, p),
                  K = Math.min(258, q);
                Y <= J && --hn && E != L;

              ) {
                if (r[p + R] == r[p + R - Y]) {
                  for (var P = 0; P < K && r[p + P] == r[p + P - Y]; ++P);
                  if (P > R) {
                    if (((R = P), (N = Y), P > rn)) break;
                    for (
                      var _ = Math.min(Y, P - 2), vn = 0, B = 0;
                      B < _;
                      ++B
                    ) {
                      var cn = (p - Y + B) & 32767,
                        Pn = x[cn],
                        $n = (cn - Pn) & 32767;
                      $n > vn && ((vn = $n), (L = cn));
                    }
                  }
                }
                (E = L), (L = x[E]), (Y += (E - L) & 32767);
              }
            if (N) {
              y[F++] = 268435456 | (Hn[R] << 18) | rr[N];
              var Cn = Hn[R] & 31,
                In = rr[N] & 31;
              (w += pn[Cn] + yn[In]), ++I[257 + Cn], ++Z[In], (T = p + R), ++D;
            } else (y[F++] = r[p]), ++I[r[p]];
          }
        }
        for (p = Math.max(p, T); p < o; ++p) (y[F++] = r[p]), ++I[r[p]];
        (h = ir(r, l, f, y, I, Z, w, F, G, p - G, h)),
          f ||
            ((a.r = (h & 7) | (l[(h / 8) | 0] << 3)),
            (h -= 7),
            (a.h = g),
            (a.p = x),
            (a.i = p),
            (a.w = T));
      } else {
        for (var p = a.w || 0; p < o + f; p += 65535) {
          var gn = p + 65535;
          gn >= o && ((l[(h / 8) | 0] = f), (gn = o)),
            (h = er(l, h + 1, r.subarray(p, gn)));
        }
        a.i = o;
      }
      return X(s, 0, e + mn(h) + i);
    },
    On = function (r: any, n: any) {
      var t = {};
      for (var e in r) t[e] = r[e];
      for (var e in n) t[e] = n[e];
      return t;
    };
  window.Katz = {
    deflate: function (r: any, n: any) {
      let i = { l: 1, w: null };
      n = n || {};
      if (n.dictionary) {
        var a = n.dictionary.subarray(-32768),
          o = new S(a.length + r.length);
        o.set(a), o.set(r, a.length), (r = o), (i.w = a.length);
      }
      return Er(
        r,
        n.level == null ? 9 : n.level,
        n.mem == null
          ? i.l
            ? Math.ceil(Math.max(8, Math.min(13, Math.log(r.length))) * 1.5)
            : 20
          : 12 + n.mem,
        0,
        0,
        i
      );
    },
    inflate: function (r: Uint8Array, g: any) {
      let n: any = { i: 2 },
        t = g && g.out,
        e = g && g.dictionary,
        i = r.length,
        a = e ? e.length : 0;
      if (!i) return t || new S(0);
      let o = !t,
        s = o || n.i != 2,
        l = n.i;
      o && (t = new S(i * 3));
      var f = function (Cn: number) {
          let In = t.length;
          if (Cn > In) {
            let gn = new S(Math.max(In * 2, Cn));
            gn.set(t), (t = gn);
          }
        },
        h = n.f || 0,
        u = n.p || 0,
        v = n.b || 0,
        M = n.l,
        m = n.d,
        x = n.m,
        g = n.n,
        z = i * 8;
      do {
        if (!M) {
          h = V(r, u, 1);
          let U = V(r, u + 1, 3);
          if (((u += 3), U))
            if (U == 1) (M = Tr), (m = Ir), (x = 9), (g = 5);
            else if (U == 2) {
              let Z = V(r, u, 31) + 257,
                D = V(r, u + 10, 15) + 4,
                w = Z + V(r, u + 5, 31) + 1;
              u += 14;
              for (var p = new S(w), F = new S(19), T = 0; T < D; ++T)
                F[Bn[T]] = V(r, u + T * 3, 7);
              u += D * 3;
              for (
                let G = Nn(F), H = (1 << G) - 1, E = Q(F, G, 1), T = 0;
                T < w;

              ) {
                let L = E[V(r, u, H)];
                u += L & 15;
                let A = L >> 4;
                if (A < 16) p[T++] = A;
                else {
                  let q = 0,
                    B = 0;
                  for (
                    A == 16
                      ? ((B = 3 + V(r, u, 3)), (u += 2), (q = p[T - 1]))
                      : A == 17
                      ? ((B = 3 + V(r, u, 7)), (u += 3))
                      : A == 18 && ((B = 11 + V(r, u, 127)), (u += 7));
                    B--;

                  )
                    p[T++] = q;
                }
              }
              let R = p.subarray(0, Z),
                N = p.subarray(Z);
              (x = Nn(R)), (g = Nn(N)), (M = Q(R, x, 1)), (m = Q(N, g, 1));
            } else c(1);
          else {
            let A = mn(u) + 4,
              y = r[A - 4] | (r[A - 3] << 8),
              I = A + y;
            if (I > i) {
              l && c(0);
              break;
            }
            s && f(v + y),
              t.set(r.subarray(A, I), v),
              (n.b = v += y),
              (n.p = u = I * 8),
              (n.f = h);
            continue;
          }
          if (u > z) {
            l && c(0);
            break;
          }
        }
        s && f(v + 131072);
        for (var hn = (1 << x) - 1, Y = (1 << g) - 1, rn = u; ; rn = u) {
          let q = M[Rn(r, u) & hn],
            J = q >> 4;
          if (((u += q & 15), u > z)) {
            l && c(0);
            break;
          }
          if ((q || c(2), J < 256)) t[v++] = J;
          else if (J == 256) {
            (rn = u), (M = null);
            break;
          } else {
            let K = J - 254;
            if (J > 264) {
              let T = J - 257,
                P = pn[T];
              (K = V(r, u, (1 << P) - 1) + nr[T]), (u += P);
            }
            let _ = m[Rn(r, u) & Y],
              vn = _ >> 4;
            _ || c(3), (u += _ & 15);
            let N = Fr[vn];
            if (vn > 3) {
              let P = yn[vn];
              (N += Rn(r, u) & ((1 << P) - 1)), (u += P);
            }
            if (u > z) {
              l && c(0);
              break;
            }
            s && f(v + 131072);
            let cn = v + K;
            if (v < N) {
              let Pn = a - N,
                $n = Math.min(N, cn);
              for (Pn + v < 0 && c(3); v < $n; ++v) t[v] = e[Pn + v];
            }
            for (; v < cn; ++v) t[v] = t[v - N];
          }
        }
        (n.l = M),
          (n.p = rn),
          (n.b = v),
          (n.f = h),
          M && ((h = 1), (n.m = x), (n.d = m), (n.n = g));
      } while (!h);
      return v != t.length && o ? X(t, 0, v) : t.subarray(0, v);
    },
  };
  let wr = function (r: any, n: string, t: any, e: any) {
    for (let i in r) {
      let a = r[i],
        o = n + i,
        s = e;
      Array.isArray(a) && ((s = On(e, a[1])), (a = a[0])),
        a instanceof S
          ? (t[o] = [a, s])
          : ((t[(o += "/")] = [new S(0), s]), wr(a, o, t, e));
    }
  };
})();
