"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/dayjs/dayjs.min.js
var require_dayjs_min = __commonJS({
  "node_modules/dayjs/dayjs.min.js"(exports, module2) {
    !(function(t, e) {
      "object" == typeof exports && "undefined" != typeof module2 ? module2.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs = e();
    })(exports, (function() {
      "use strict";
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|YYYY|YY|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
        var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
        return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
      } }, m = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, v = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date()) return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, c), s2 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), c);
        return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return void 0 === t2;
      } }, g = "en", D = {};
      D[g] = M;
      var p = "$isDayjsObject", S = function(t2) {
        return t2 instanceof _ || !(!t2 || !t2[p]);
      }, w = function t2(e2, n2, r2) {
        var i2;
        if (!e2) return g;
        if ("string" == typeof e2) {
          var s2 = e2.toLowerCase();
          D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
          var u2 = e2.split("-");
          if (!i2 && u2.length > 1) return t2(u2[0]);
        } else {
          var a2 = e2.name;
          D[a2] = e2, i2 = a2;
        }
        return !r2 && i2 && (g = i2), i2 || !r2 && g;
      }, O = function(t2, e2) {
        if (S(t2)) return t2.clone();
        var n2 = "object" == typeof e2 ? e2 : {};
        return n2.date = t2, n2.args = arguments, new _(n2);
      }, b = v;
      b.l = w, b.i = S, b.w = function(t2, e2) {
        return O(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _ = (function() {
        function M2(t2) {
          this.$L = w(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
        }
        var m2 = M2.prototype;
        return m2.parse = function(t2) {
          this.$d = (function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (null === e2) return /* @__PURE__ */ new Date(NaN);
            if (b.u(e2)) return /* @__PURE__ */ new Date();
            if (e2 instanceof Date) return new Date(e2);
            if ("string" == typeof e2 && !/Z$/i.test(e2)) {
              var r2 = e2.match($);
              if (r2) {
                var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
              }
            }
            return new Date(e2);
          })(t2), this.init();
        }, m2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, m2.$utils = function() {
          return b;
        }, m2.isValid = function() {
          return !(this.$d.toString() === l);
        }, m2.isSame = function(t2, e2) {
          var n2 = O(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t2, e2) {
          return O(t2) < this.startOf(e2);
        }, m2.isBefore = function(t2, e2) {
          return this.endOf(e2) < O(t2);
        }, m2.$g = function(t2, e2, n2) {
          return b.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r2 = !!b.u(e2) || e2, f2 = b.p(t2), l2 = function(t3, e3) {
            var i2 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r2 ? i2 : i2.endOf(a);
          }, $2 = function(t3, e3) {
            return b.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
          switch (f2) {
            case h:
              return r2 ? l2(1, 0) : l2(31, 11);
            case c:
              return r2 ? l2(1, M3) : l2(0, M3 + 1);
            case o:
              var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
              return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
            case a:
            case d:
              return $2(v2 + "Hours", 0);
            case u:
              return $2(v2 + "Minutes", 1);
            case s:
              return $2(v2 + "Seconds", 2);
            case i:
              return $2(v2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === c || o2 === h) {
            var y2 = this.clone().set(d, 1);
            y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else l2 && this.$d[l2]($2);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[b.p(t2)]();
        }, m2.add = function(r2, f2) {
          var d2, l2 = this;
          r2 = Number(r2);
          var $2 = b.p(f2), y2 = function(t2) {
            var e2 = O(l2);
            return b.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
          };
          if ($2 === c) return this.set(c, this.$M + r2);
          if ($2 === h) return this.set(h, this.$y + r2);
          if ($2 === a) return y2(1);
          if ($2 === o) return y2(7);
          var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M3;
          return b.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid()) return n2.invalidDate || l;
          var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i3, s3) {
            return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s3);
          }, d2 = function(t3) {
            return b.s(s2 % 12 || 12, t3, "0");
          }, $2 = f2 || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          };
          return r2.replace(y, (function(t3, r3) {
            return r3 || (function(t4) {
              switch (t4) {
                case "YY":
                  return String(e2.$y).slice(-2);
                case "YYYY":
                  return b.s(e2.$y, 4, "0");
                case "M":
                  return a2 + 1;
                case "MM":
                  return b.s(a2 + 1, 2, "0");
                case "MMM":
                  return h2(n2.monthsShort, a2, c2, 3);
                case "MMMM":
                  return h2(c2, a2);
                case "D":
                  return e2.$D;
                case "DD":
                  return b.s(e2.$D, 2, "0");
                case "d":
                  return String(e2.$W);
                case "dd":
                  return h2(n2.weekdaysMin, e2.$W, o2, 2);
                case "ddd":
                  return h2(n2.weekdaysShort, e2.$W, o2, 3);
                case "dddd":
                  return o2[e2.$W];
                case "H":
                  return String(s2);
                case "HH":
                  return b.s(s2, 2, "0");
                case "h":
                  return d2(1);
                case "hh":
                  return d2(2);
                case "a":
                  return $2(s2, u2, true);
                case "A":
                  return $2(s2, u2, false);
                case "m":
                  return String(u2);
                case "mm":
                  return b.s(u2, 2, "0");
                case "s":
                  return String(e2.$s);
                case "ss":
                  return b.s(e2.$s, 2, "0");
                case "SSS":
                  return b.s(e2.$ms, 3, "0");
                case "Z":
                  return i2;
              }
              return null;
            })(t3) || i2.replace(":", "");
          }));
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, l2) {
          var $2, y2 = this, M3 = b.p(d2), m3 = O(r2), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function() {
            return b.m(y2, m3);
          };
          switch (M3) {
            case h:
              $2 = D2() / 12;
              break;
            case c:
              $2 = D2();
              break;
            case f:
              $2 = D2() / 3;
              break;
            case o:
              $2 = (g2 - v2) / 6048e5;
              break;
            case a:
              $2 = (g2 - v2) / 864e5;
              break;
            case u:
              $2 = g2 / n;
              break;
            case s:
              $2 = g2 / e;
              break;
            case i:
              $2 = g2 / t;
              break;
            default:
              $2 = g2;
          }
          return l2 ? $2 : b.a($2);
        }, m2.daysInMonth = function() {
          return this.endOf(c).$D;
        }, m2.$locale = function() {
          return D[this.$L];
        }, m2.locale = function(t2, e2) {
          if (!t2) return this.$L;
          var n2 = this.clone(), r2 = w(t2, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, m2.clone = function() {
          return b.w(this.$d, this);
        }, m2.toDate = function() {
          return new Date(this.valueOf());
        }, m2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m2.toISOString = function() {
          return this.$d.toISOString();
        }, m2.toString = function() {
          return this.$d.toUTCString();
        }, M2;
      })(), Y = _.prototype;
      return O.prototype = Y, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach((function(t2) {
        Y[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      })), O.extend = function(t2, e2) {
        return t2.$i || (t2(e2, _, O), t2.$i = true), O;
      }, O.locale = w, O.isDayjs = S, O.unix = function(t2) {
        return O(1e3 * t2);
      }, O.en = D[g], O.Ls = D, O.p = {}, O;
    }));
  }
});

// node_modules/dayjs/plugin/customParseFormat.js
var require_customParseFormat = __commonJS({
  "node_modules/dayjs/plugin/customParseFormat.js"(exports, module2) {
    !(function(e, t) {
      "object" == typeof exports && "undefined" != typeof module2 ? module2.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_customParseFormat = t();
    })(exports, (function() {
      "use strict";
      var e = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, t = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, n = /\d/, r = /\d\d/, i = /\d\d?/, o = /\d*[^-_:/,()\s\d]+/, s = {}, a = function(e2) {
        return (e2 = +e2) + (e2 > 68 ? 1900 : 2e3);
      };
      var f = function(e2) {
        return function(t2) {
          this[e2] = +t2;
        };
      }, h = [/[+-]\d\d:?(\d\d)?|Z/, function(e2) {
        (this.zone || (this.zone = {})).offset = (function(e3) {
          if (!e3) return 0;
          if ("Z" === e3) return 0;
          var t2 = e3.match(/([+-]|\d\d)/g), n2 = 60 * t2[1] + (+t2[2] || 0);
          return 0 === n2 ? 0 : "+" === t2[0] ? -n2 : n2;
        })(e2);
      }], u = function(e2) {
        var t2 = s[e2];
        return t2 && (t2.indexOf ? t2 : t2.s.concat(t2.f));
      }, d = function(e2, t2) {
        var n2, r2 = s.meridiem;
        if (r2) {
          for (var i2 = 1; i2 <= 24; i2 += 1) if (e2.indexOf(r2(i2, 0, t2)) > -1) {
            n2 = i2 > 12;
            break;
          }
        } else n2 = e2 === (t2 ? "pm" : "PM");
        return n2;
      }, c = { A: [o, function(e2) {
        this.afternoon = d(e2, false);
      }], a: [o, function(e2) {
        this.afternoon = d(e2, true);
      }], Q: [n, function(e2) {
        this.month = 3 * (e2 - 1) + 1;
      }], S: [n, function(e2) {
        this.milliseconds = 100 * +e2;
      }], SS: [r, function(e2) {
        this.milliseconds = 10 * +e2;
      }], SSS: [/\d{3}/, function(e2) {
        this.milliseconds = +e2;
      }], s: [i, f("seconds")], ss: [i, f("seconds")], m: [i, f("minutes")], mm: [i, f("minutes")], H: [i, f("hours")], h: [i, f("hours")], HH: [i, f("hours")], hh: [i, f("hours")], D: [i, f("day")], DD: [r, f("day")], Do: [o, function(e2) {
        var t2 = s.ordinal, n2 = e2.match(/\d+/);
        if (this.day = n2[0], t2) for (var r2 = 1; r2 <= 31; r2 += 1) t2(r2).replace(/\[|\]/g, "") === e2 && (this.day = r2);
      }], w: [i, f("week")], ww: [r, f("week")], M: [i, f("month")], MM: [r, f("month")], MMM: [o, function(e2) {
        var t2 = u("months"), n2 = (u("monthsShort") || t2.map((function(e3) {
          return e3.slice(0, 3);
        }))).indexOf(e2) + 1;
        if (n2 < 1) throw new Error();
        this.month = n2 % 12 || n2;
      }], MMMM: [o, function(e2) {
        var t2 = u("months").indexOf(e2) + 1;
        if (t2 < 1) throw new Error();
        this.month = t2 % 12 || t2;
      }], Y: [/[+-]?\d+/, f("year")], YY: [r, function(e2) {
        this.year = a(e2);
      }], YYYY: [/\d{4}/, f("year")], Z: h, ZZ: h };
      function l(n2) {
        var r2, i2;
        r2 = n2, i2 = s && s.formats;
        for (var o2 = (n2 = r2.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (function(t2, n3, r3) {
          var o3 = r3 && r3.toUpperCase();
          return n3 || i2[r3] || e[r3] || i2[o3].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (function(e2, t3, n4) {
            return t3 || n4.slice(1);
          }));
        }))).match(t), a2 = o2.length, f2 = 0; f2 < a2; f2 += 1) {
          var h2 = o2[f2], u2 = c[h2], d2 = u2 && u2[0], l2 = u2 && u2[1];
          o2[f2] = l2 ? { regex: d2, parser: l2 } : h2.replace(/^\[|\]$/g, "");
        }
        return function(e2) {
          for (var t2 = {}, n3 = 0, r3 = 0; n3 < a2; n3 += 1) {
            var i3 = o2[n3];
            if ("string" == typeof i3) r3 += i3.length;
            else {
              var s2 = i3.regex, f3 = i3.parser, h3 = e2.slice(r3), u3 = s2.exec(h3)[0];
              f3.call(t2, u3), e2 = e2.replace(u3, "");
            }
          }
          return (function(e3) {
            var t3 = e3.afternoon;
            if (void 0 !== t3) {
              var n4 = e3.hours;
              t3 ? n4 < 12 && (e3.hours += 12) : 12 === n4 && (e3.hours = 0), delete e3.afternoon;
            }
          })(t2), t2;
        };
      }
      return function(e2, t2, n2) {
        n2.p.customParseFormat = true, e2 && e2.parseTwoDigitYear && (a = e2.parseTwoDigitYear);
        var r2 = t2.prototype, i2 = r2.parse;
        r2.parse = function(e3) {
          var t3 = e3.date, r3 = e3.utc, o2 = e3.args;
          this.$u = r3;
          var a2 = o2[1];
          if ("string" == typeof a2) {
            var f2 = true === o2[2], h2 = true === o2[3], u2 = f2 || h2, d2 = o2[2];
            h2 && (d2 = o2[2]), s = this.$locale(), !f2 && d2 && (s = n2.Ls[d2]), this.$d = (function(e4, t4, n3, r4) {
              try {
                if (["x", "X"].indexOf(t4) > -1) return new Date(("X" === t4 ? 1e3 : 1) * e4);
                var i3 = l(t4)(e4), o3 = i3.year, s2 = i3.month, a3 = i3.day, f3 = i3.hours, h3 = i3.minutes, u3 = i3.seconds, d3 = i3.milliseconds, c3 = i3.zone, m2 = i3.week, M2 = /* @__PURE__ */ new Date(), Y = a3 || (o3 || s2 ? 1 : M2.getDate()), p = o3 || M2.getFullYear(), v = 0;
                o3 && !s2 || (v = s2 > 0 ? s2 - 1 : M2.getMonth());
                var D, w = f3 || 0, g = h3 || 0, y = u3 || 0, L = d3 || 0;
                return c3 ? new Date(Date.UTC(p, v, Y, w, g, y, L + 60 * c3.offset * 1e3)) : n3 ? new Date(Date.UTC(p, v, Y, w, g, y, L)) : (D = new Date(p, v, Y, w, g, y, L), m2 && (D = r4(D).week(m2).toDate()), D);
              } catch (e5) {
                return /* @__PURE__ */ new Date("");
              }
            })(t3, a2, r3, n2), this.init(), d2 && true !== d2 && (this.$L = this.locale(d2).$L), u2 && t3 != this.format(a2) && (this.$d = /* @__PURE__ */ new Date("")), s = {};
          } else if (a2 instanceof Array) for (var c2 = a2.length, m = 1; m <= c2; m += 1) {
            o2[1] = a2[m - 1];
            var M = n2.apply(this, o2);
            if (M.isValid()) {
              this.$d = M.$d, this.$L = M.$L, this.init();
              break;
            }
            m === c2 && (this.$d = /* @__PURE__ */ new Date(""));
          }
          else i2.call(this, e3);
        };
      };
    }));
  }
});

// node_modules/dayjs/plugin/duration.js
var require_duration = __commonJS({
  "node_modules/dayjs/plugin/duration.js"(exports, module2) {
    !(function(t, s) {
      "object" == typeof exports && "undefined" != typeof module2 ? module2.exports = s() : "function" == typeof define && define.amd ? define(s) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_duration = s();
    })(exports, (function() {
      "use strict";
      var t, s, n = 1e3, i = 6e4, e = 36e5, r = 864e5, o = 31536e6, u = 2628e6, d = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/, a = /\[([^\]]+)]|YYYY|YY|Y|M{1,2}|D{1,2}|H{1,2}|m{1,2}|s{1,2}|SSS/g, h = { years: o, months: u, days: r, hours: e, minutes: i, seconds: n, milliseconds: 1, weeks: 6048e5 }, c = function(t2) {
        return t2 instanceof g;
      }, f = function(t2, s2, n2) {
        return new g(t2, n2, s2.$l);
      }, m = function(t2) {
        return s.p(t2) + "s";
      }, l = function(t2) {
        return t2 < 0;
      }, $ = function(t2) {
        return l(t2) ? Math.ceil(t2) : Math.floor(t2);
      }, y = function(t2) {
        return Math.abs(t2);
      }, v = function(t2, s2) {
        return t2 ? l(t2) ? { negative: true, format: "" + y(t2) + s2 } : { negative: false, format: "" + t2 + s2 } : { negative: false, format: "" };
      }, g = (function() {
        function l2(t2, s2, n2) {
          var i2 = this;
          if (this.$d = {}, this.$l = n2, void 0 === t2 && (this.$ms = 0, this.parseFromMilliseconds()), s2) return f(t2 * h[m(s2)], this);
          if ("number" == typeof t2) return this.$ms = t2, this.parseFromMilliseconds(), this;
          if ("object" == typeof t2) return Object.keys(t2).forEach((function(s3) {
            i2.$d[m(s3)] = t2[s3];
          })), this.calMilliseconds(), this;
          if ("string" == typeof t2) {
            var e2 = t2.match(d);
            if (e2) {
              var r2 = e2.slice(2).map((function(t3) {
                return null != t3 ? Number(t3) : 0;
              }));
              return this.$d.years = r2[0], this.$d.months = r2[1], this.$d.weeks = r2[2], this.$d.days = r2[3], this.$d.hours = r2[4], this.$d.minutes = r2[5], this.$d.seconds = r2[6], this.calMilliseconds(), this;
            }
          }
          return this;
        }
        var y2 = l2.prototype;
        return y2.calMilliseconds = function() {
          var t2 = this;
          this.$ms = Object.keys(this.$d).reduce((function(s2, n2) {
            return s2 + (t2.$d[n2] || 0) * h[n2];
          }), 0);
        }, y2.parseFromMilliseconds = function() {
          var t2 = this.$ms;
          this.$d.years = $(t2 / o), t2 %= o, this.$d.months = $(t2 / u), t2 %= u, this.$d.days = $(t2 / r), t2 %= r, this.$d.hours = $(t2 / e), t2 %= e, this.$d.minutes = $(t2 / i), t2 %= i, this.$d.seconds = $(t2 / n), t2 %= n, this.$d.milliseconds = t2;
        }, y2.toISOString = function() {
          var t2 = v(this.$d.years, "Y"), s2 = v(this.$d.months, "M"), n2 = +this.$d.days || 0;
          this.$d.weeks && (n2 += 7 * this.$d.weeks);
          var i2 = v(n2, "D"), e2 = v(this.$d.hours, "H"), r2 = v(this.$d.minutes, "M"), o2 = this.$d.seconds || 0;
          this.$d.milliseconds && (o2 += this.$d.milliseconds / 1e3, o2 = Math.round(1e3 * o2) / 1e3);
          var u2 = v(o2, "S"), d2 = t2.negative || s2.negative || i2.negative || e2.negative || r2.negative || u2.negative, a2 = e2.format || r2.format || u2.format ? "T" : "", h2 = (d2 ? "-" : "") + "P" + t2.format + s2.format + i2.format + a2 + e2.format + r2.format + u2.format;
          return "P" === h2 || "-P" === h2 ? "P0D" : h2;
        }, y2.toJSON = function() {
          return this.toISOString();
        }, y2.format = function(t2) {
          var n2 = t2 || "YYYY-MM-DDTHH:mm:ss", i2 = { Y: this.$d.years, YY: s.s(this.$d.years, 2, "0"), YYYY: s.s(this.$d.years, 4, "0"), M: this.$d.months, MM: s.s(this.$d.months, 2, "0"), D: this.$d.days, DD: s.s(this.$d.days, 2, "0"), H: this.$d.hours, HH: s.s(this.$d.hours, 2, "0"), m: this.$d.minutes, mm: s.s(this.$d.minutes, 2, "0"), s: this.$d.seconds, ss: s.s(this.$d.seconds, 2, "0"), SSS: s.s(this.$d.milliseconds, 3, "0") };
          return n2.replace(a, (function(t3, s2) {
            return s2 || String(i2[t3]);
          }));
        }, y2.as = function(t2) {
          return this.$ms / h[m(t2)];
        }, y2.get = function(t2) {
          var s2 = this.$ms, n2 = m(t2);
          return "milliseconds" === n2 ? s2 %= 1e3 : s2 = "weeks" === n2 ? $(s2 / h[n2]) : this.$d[n2], s2 || 0;
        }, y2.add = function(t2, s2, n2) {
          var i2;
          return i2 = s2 ? t2 * h[m(s2)] : c(t2) ? t2.$ms : f(t2, this).$ms, f(this.$ms + i2 * (n2 ? -1 : 1), this);
        }, y2.subtract = function(t2, s2) {
          return this.add(t2, s2, true);
        }, y2.locale = function(t2) {
          var s2 = this.clone();
          return s2.$l = t2, s2;
        }, y2.clone = function() {
          return f(this.$ms, this);
        }, y2.humanize = function(s2) {
          return t().add(this.$ms, "ms").locale(this.$l).fromNow(!s2);
        }, y2.valueOf = function() {
          return this.asMilliseconds();
        }, y2.milliseconds = function() {
          return this.get("milliseconds");
        }, y2.asMilliseconds = function() {
          return this.as("milliseconds");
        }, y2.seconds = function() {
          return this.get("seconds");
        }, y2.asSeconds = function() {
          return this.as("seconds");
        }, y2.minutes = function() {
          return this.get("minutes");
        }, y2.asMinutes = function() {
          return this.as("minutes");
        }, y2.hours = function() {
          return this.get("hours");
        }, y2.asHours = function() {
          return this.as("hours");
        }, y2.days = function() {
          return this.get("days");
        }, y2.asDays = function() {
          return this.as("days");
        }, y2.weeks = function() {
          return this.get("weeks");
        }, y2.asWeeks = function() {
          return this.as("weeks");
        }, y2.months = function() {
          return this.get("months");
        }, y2.asMonths = function() {
          return this.as("months");
        }, y2.years = function() {
          return this.get("years");
        }, y2.asYears = function() {
          return this.as("years");
        }, l2;
      })(), p = function(t2, s2, n2) {
        return t2.add(s2.years() * n2, "y").add(s2.months() * n2, "M").add(s2.days() * n2, "d").add(s2.hours() * n2, "h").add(s2.minutes() * n2, "m").add(s2.seconds() * n2, "s").add(s2.milliseconds() * n2, "ms");
      };
      return function(n2, i2, e2) {
        t = e2, s = e2().$utils(), e2.duration = function(t2, s2) {
          var n3 = e2.locale();
          return f(t2, { $l: n3 }, s2);
        }, e2.isDuration = c;
        var r2 = i2.prototype.add, o2 = i2.prototype.subtract;
        i2.prototype.add = function(t2, s2) {
          return c(t2) ? p(this, t2, 1) : r2.bind(this)(t2, s2);
        }, i2.prototype.subtract = function(t2, s2) {
          return c(t2) ? p(this, t2, -1) : o2.bind(this)(t2, s2);
        };
      };
    }));
  }
});

// node_modules/dayjs/plugin/utc.js
var require_utc = __commonJS({
  "node_modules/dayjs/plugin/utc.js"(exports, module2) {
    !(function(t, i) {
      "object" == typeof exports && "undefined" != typeof module2 ? module2.exports = i() : "function" == typeof define && define.amd ? define(i) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_utc = i();
    })(exports, (function() {
      "use strict";
      var t = "minute", i = /[+-]\d\d(?::?\d\d)?/g, e = /([+-]|\d\d)/g;
      return function(s, f, n) {
        var u = f.prototype;
        n.utc = function(t2) {
          var i2 = { date: t2, utc: true, args: arguments };
          return new f(i2);
        }, u.utc = function(i2) {
          var e2 = n(this.toDate(), { locale: this.$L, utc: true });
          return i2 ? e2.add(this.utcOffset(), t) : e2;
        }, u.local = function() {
          return n(this.toDate(), { locale: this.$L, utc: false });
        };
        var r = u.parse;
        u.parse = function(t2) {
          t2.utc && (this.$u = true), this.$utils().u(t2.$offset) || (this.$offset = t2.$offset), r.call(this, t2);
        };
        var o = u.init;
        u.init = function() {
          if (this.$u) {
            var t2 = this.$d;
            this.$y = t2.getUTCFullYear(), this.$M = t2.getUTCMonth(), this.$D = t2.getUTCDate(), this.$W = t2.getUTCDay(), this.$H = t2.getUTCHours(), this.$m = t2.getUTCMinutes(), this.$s = t2.getUTCSeconds(), this.$ms = t2.getUTCMilliseconds();
          } else o.call(this);
        };
        var a = u.utcOffset;
        u.utcOffset = function(s2, f2) {
          var n2 = this.$utils().u;
          if (n2(s2)) return this.$u ? 0 : n2(this.$offset) ? a.call(this) : this.$offset;
          if ("string" == typeof s2 && (s2 = (function(t2) {
            void 0 === t2 && (t2 = "");
            var s3 = t2.match(i);
            if (!s3) return null;
            var f3 = ("" + s3[0]).match(e) || ["-", 0, 0], n3 = f3[0], u3 = 60 * +f3[1] + +f3[2];
            return 0 === u3 ? 0 : "+" === n3 ? u3 : -u3;
          })(s2), null === s2)) return this;
          var u2 = Math.abs(s2) <= 16 ? 60 * s2 : s2;
          if (0 === u2) return this.utc(f2);
          var r2 = this.clone();
          if (f2) return r2.$offset = u2, r2.$u = false, r2;
          var o2 = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
          return (r2 = this.local().add(u2 + o2, t)).$offset = u2, r2.$x.$localOffset = o2, r2;
        };
        var h = u.format;
        u.format = function(t2) {
          var i2 = t2 || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
          return h.call(this, i2);
        }, u.valueOf = function() {
          var t2 = this.$utils().u(this.$offset) ? 0 : this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset());
          return this.$d.valueOf() - 6e4 * t2;
        }, u.isUTC = function() {
          return !!this.$u;
        }, u.toISOString = function() {
          return this.toDate().toISOString();
        }, u.toString = function() {
          return this.toDate().toUTCString();
        };
        var l = u.toDate;
        u.toDate = function(t2) {
          return "s" === t2 && this.$offset ? n(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate() : l.call(this);
        };
        var c = u.diff;
        u.diff = function(t2, i2, e2) {
          if (t2 && this.$u === t2.$u) return c.call(this, t2, i2, e2);
          var s2 = this.local(), f2 = n(t2).local();
          return c.call(s2, f2, i2, e2);
        };
      };
    }));
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => LogTrackerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_state = require("@codemirror/state");
var import_obsidian2 = require("obsidian");

// src/core/time.ts
var import_dayjs = __toESM(require_dayjs_min());
var import_customParseFormat = __toESM(require_customParseFormat());
var import_duration = __toESM(require_duration());
var import_utc = __toESM(require_utc());
import_dayjs.default.extend(import_customParseFormat.default);
import_dayjs.default.extend(import_duration.default);
import_dayjs.default.extend(import_utc.default);
function formatInstant(instant, format, useUTC) {
  const d = useUTC ? import_dayjs.default.utc(instant) : (0, import_dayjs.default)(instant);
  return d.format(format);
}
function parseStamp(text, format, useUTC) {
  return useUTC ? import_dayjs.default.utc(text, format, true) : (0, import_dayjs.default)(text, format, true);
}

// src/core/elapsed.ts
var MS_PER_DAY = 864e5;
var ELAPSED_INNER = "(?:\\d{2,}:)?\\d{2}:\\d{2}";
function pad2(value) {
  return value < 10 ? "0" + String(value) : String(value);
}
function zeroElapsed(style) {
  return style === "auto" ? "00:00" : "00:00:00";
}
function formatElapsed(ms, style) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return zeroElapsed(style);
  }
  const span = import_dayjs.default.duration(Math.floor(ms / 1e3) * 1e3);
  const hours = Math.floor(span.asHours());
  const minutes = span.minutes();
  const seconds = span.seconds();
  if (style === "auto" && hours === 0) {
    return pad2(minutes) + ":" + pad2(seconds);
  }
  return pad2(hours) + ":" + pad2(minutes) + ":" + pad2(seconds);
}
function timeOfDayMs(hour, minute, second, ms) {
  return ((hour * 60 + minute) * 60 + second) * 1e3 + ms;
}
function elapsedMsBetween(previous, current, compiled, useUTC) {
  if (!compiled.valid || !compiled.hasTime) {
    return null;
  }
  const before = parseStamp(previous, compiled.format, useUTC);
  const after = parseStamp(current, compiled.format, useUTC);
  if (!before.isValid() || !after.isValid()) {
    return null;
  }
  let delta = compiled.hasDate ? after.valueOf() - before.valueOf() : timeOfDayMs(after.hour(), after.minute(), after.second(), after.millisecond()) - timeOfDayMs(before.hour(), before.minute(), before.second(), before.millisecond());
  if (delta < 0) {
    delta += MS_PER_DAY;
  }
  if (delta < 0 || !Number.isFinite(delta)) {
    return null;
  }
  return delta;
}
function elapsedBetween(previous, current, compiled, useUTC, style) {
  if (previous === null) {
    return zeroElapsed(style);
  }
  const ms = elapsedMsBetween(previous, current, compiled, useUTC);
  return ms === null ? zeroElapsed(style) : formatElapsed(ms, style);
}

// src/core/regex.ts
var SPECIALS = /[.*+?^${}()|[\]\\]/g;
function escapeRegex(text) {
  return text.replace(SPECIALS, "\\$&");
}

// src/core/format.ts
var VALIDATION_INSTANT = Date.UTC(2026, 8, 7, 13, 45, 56, 789);
var TOKENS = [
  ["YYYY", "\\d{4}"],
  ["YY", "\\d{2}"],
  ["MMMM", "[A-Za-z]{3,}"],
  ["MMM", "[A-Za-z]{3}"],
  ["MM", "\\d{2}"],
  ["M", "\\d{1,2}"],
  ["DD", "\\d{2}"],
  ["D", "\\d{1,2}"],
  ["dddd", "[A-Za-z]{3,}"],
  ["ddd", "[A-Za-z]{3}"],
  ["dd", "[A-Za-z]{2}"],
  ["d", "\\d"],
  ["HH", "\\d{2}"],
  ["H", "\\d{1,2}"],
  ["hh", "\\d{2}"],
  ["h", "\\d{1,2}"],
  ["mm", "\\d{2}"],
  ["m", "\\d{1,2}"],
  ["ss", "\\d{2}"],
  ["s", "\\d{1,2}"],
  ["SSS", "\\d{3}"],
  ["SS", "\\d{2}"],
  ["S", "\\d"],
  ["A", "(?:AM|PM)"],
  ["a", "(?:am|pm)"],
  ["ZZ", "[+-]\\d{4}"],
  ["Z", "[+-]\\d{2}:\\d{2}"],
  ["X", "\\d+"],
  ["x", "\\d+"]
];
var DATE_TOKENS = /* @__PURE__ */ new Set(["YYYY", "YY", "MMMM", "MMM", "MM", "M", "DD", "D", "X", "x"]);
var TIME_TOKENS = /* @__PURE__ */ new Set([
  "HH",
  "H",
  "hh",
  "h",
  "mm",
  "m",
  "ss",
  "s",
  "SSS",
  "SS",
  "S",
  "A",
  "a",
  "X",
  "x"
]);
var SCANNER = new RegExp(
  "\\[([^\\]]*)\\]|" + TOKENS.map(([token]) => escapeRegex(token)).join("|"),
  "g"
);
var PATTERN_BY_TOKEN = new Map(TOKENS);
function invalid(format, error) {
  return { format, valid: false, error, source: "(?!)", hasDate: false, hasTime: false };
}
function compileFormat(format, useUTC) {
  if (format.length === 0) {
    return invalid(format, "Format is empty.");
  }
  let source = "";
  let hasDate = false;
  let hasTime = false;
  let cursor = 0;
  let sawToken = false;
  SCANNER.lastIndex = 0;
  for (let match = SCANNER.exec(format); match !== null; match = SCANNER.exec(format)) {
    source += escapeRegex(format.slice(cursor, match.index));
    if (match[1] !== void 0) {
      source += escapeRegex(match[1]);
    } else {
      const token = match[0];
      source += PATTERN_BY_TOKEN.get(token);
      sawToken = true;
      if (DATE_TOKENS.has(token)) hasDate = true;
      if (TIME_TOKENS.has(token)) hasTime = true;
    }
    cursor = match.index + match[0].length;
  }
  const tail = format.slice(cursor);
  source += escapeRegex(tail);
  if (!sawToken) {
    return invalid(format, "Format contains no date or time tokens.");
  }
  if (hasStrayBracket(format)) {
    return invalid(format, "Unbalanced [ ] escape in format.");
  }
  const sample = formatInstant(VALIDATION_INSTANT, format, useUTC);
  const reparsed = parseStamp(sample, format, useUTC);
  if (!reparsed.isValid()) {
    return invalid(format, "Format cannot be parsed back from its own output.");
  }
  if (formatInstant(reparsed.valueOf(), format, useUTC) !== sample) {
    return invalid(format, "Format does not round-trip to the same text.");
  }
  if (!new RegExp("^(?:" + source + ")$").test(sample)) {
    return invalid(format, "Compiled pattern does not match the format's own output.");
  }
  return { format, valid: true, source, hasDate, hasTime };
}
function hasStrayBracket(format) {
  let index = 0;
  while (index < format.length) {
    const char = format[index];
    if (char === "]") return true;
    if (char === "[") {
      const close = format.indexOf("]", index + 1);
      if (close === -1) return true;
      index = close + 1;
      continue;
    }
    index += 1;
  }
  return false;
}

// src/core/grammar.ts
var LIST_MARKER = "(?:[-*+]|\\d+[.)])[ \\t]+(?:\\[[ xX]\\][ \\t]+)?";
function buildGrammar(settings) {
  const compiled = compileFormat(settings.timeFormat, settings.useUTC);
  const line = new RegExp(
    "^([ \\t]*)(" + LIST_MARKER + ")?" + escapeRegex(settings.prefix) + "(" + compiled.source + ")((?:[ \\t]\\(" + ELAPSED_INNER + "\\))?)" + escapeRegex(settings.suffix) + "([\\s\\S]*)$"
  );
  const trigger = settings.trigger.length === 0 ? null : new RegExp(escapeRegex(settings.trigger) + "$");
  return { settings, compiled, line, trigger };
}
function parseStampLine(line, grammar) {
  var _a;
  if (!grammar.compiled.valid) {
    return null;
  }
  const match = grammar.line.exec(line);
  if (match === null) {
    return null;
  }
  const indent = match[1];
  const marker = (_a = match[2]) != null ? _a : "";
  const timestamp = match[3];
  const elapsedRaw = match[4];
  const rest = match[5];
  const slotFrom = indent.length + marker.length + grammar.settings.prefix.length + timestamp.length;
  return {
    indent,
    marker,
    timestamp,
    elapsedRaw,
    elapsed: elapsedRaw === "" ? null : elapsedRaw.slice(2, -1),
    rest,
    slotFrom,
    slotTo: slotFrom + elapsedRaw.length
  };
}
function composeStamp(timestamp, elapsed, settings) {
  const slot = elapsed === null ? "" : " (" + elapsed + ")";
  return settings.prefix + timestamp + slot + settings.suffix;
}
function renderStamp(now, previousTimestamp, grammar) {
  const { settings, compiled } = grammar;
  const timestamp = compiled.valid ? formatInstant(now, settings.timeFormat, settings.useUTC) : settings.timeFormat;
  if (!settings.elapsedEnabled) {
    return composeStamp(timestamp, null, settings);
  }
  const elapsed = compiled.valid ? elapsedBetween(
    previousTimestamp,
    timestamp,
    compiled,
    settings.useUTC,
    settings.elapsedStyle
  ) : zeroElapsed(settings.elapsedStyle);
  return composeStamp(timestamp, elapsed, settings);
}

// src/core/audit.ts
function auditDocument(text, grammar) {
  const empty = {
    replacements: [],
    updated: 0,
    inserted: 0,
    removed: 0,
    unchanged: 0,
    skipped: 0
  };
  if (!grammar.compiled.valid) {
    return empty;
  }
  const { settings, compiled } = grammar;
  const lines = text.split("\n");
  const replacements = [];
  let updated = 0;
  let inserted = 0;
  let removed = 0;
  let unchanged = 0;
  let skipped = 0;
  let lineStart = 0;
  let previousTimestamp = null;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const parsed = parseStampLine(line, grammar);
    if (parsed === null) {
      skipped += 1;
      lineStart += line.length + 1;
      continue;
    }
    const wanted = settings.elapsedEnabled ? " (" + elapsedBetween(
      previousTimestamp,
      parsed.timestamp,
      compiled,
      settings.useUTC,
      settings.elapsedStyle
    ) + ")" : "";
    if (wanted !== parsed.elapsedRaw) {
      replacements.push({
        line: index,
        from: lineStart + parsed.slotFrom,
        to: lineStart + parsed.slotTo,
        text: wanted
      });
      if (wanted === "") removed += 1;
      else if (parsed.elapsedRaw === "") inserted += 1;
      else updated += 1;
    } else {
      unchanged += 1;
    }
    previousTimestamp = parsed.timestamp;
    lineStart += line.length + 1;
  }
  return { replacements, updated, inserted, removed, unchanged, skipped };
}
function applyReplacements(text, replacements) {
  let output = "";
  let cursor = 0;
  for (const replacement of replacements) {
    output += text.slice(cursor, replacement.from) + replacement.text;
    cursor = replacement.to;
  }
  return output + text.slice(cursor);
}
function mapOffset(offset, replacements) {
  let mapped = offset;
  for (const replacement of replacements) {
    if (replacement.to <= offset) {
      mapped += replacement.text.length - (replacement.to - replacement.from);
    } else if (replacement.from < offset) {
      mapped = replacement.from + replacement.text.length;
      break;
    } else {
      break;
    }
  }
  return mapped;
}
function offsetToPosition(text, offset) {
  const clamped = Math.max(0, Math.min(offset, text.length));
  let line = 0;
  let lineStart = 0;
  for (let index = 0; index < clamped; index += 1) {
    if (text.charCodeAt(index) === 10) {
      line += 1;
      lineStart = index + 1;
    }
  }
  return { line, ch: clamped - lineStart };
}

// src/core/settings.ts
var DEFAULT_SETTINGS = {
  timeFormat: "YYYY-MM-DD - HH:mm:ss",
  prefix: "[",
  suffix: "]",
  useUTC: false,
  elapsedEnabled: true,
  elapsedStyle: "hms",
  trigger: "-[t]"
};

// src/core/scan.ts
function findPreviousTimestamp(lines, beforeLine, grammar) {
  for (let index = Math.min(beforeLine, lines.length) - 1; index >= 0; index -= 1) {
    const parsed = parseStampLine(lines[index], grammar);
    if (parsed !== null) {
      return parsed.timestamp;
    }
  }
  return null;
}

// src/core/transaction-filter.ts
var CONTINUATION = /^[ \t]*\r?\n[ \t]*(?:[-*+]|\d+[.)])[ \t]*$/;
function soleChange(tr) {
  let found = null;
  let count = 0;
  tr.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
    count += 1;
    if (count === 1) {
      found = { fromA, toA, inserted: inserted.toString() };
    }
  });
  return count === 1 ? found : null;
}
function createStampFilter(context) {
  return (tr) => {
    var _a, _b;
    if (!tr.docChanged || tr.isUserEvent("undo") || tr.isUserEvent("redo")) {
      return tr;
    }
    const grammar = context.grammar();
    if (!grammar.compiled.valid) {
      return tr;
    }
    const change = soleChange(tr);
    if (change === null) {
      return tr;
    }
    return (_b = (_a = expandTrigger(tr, change, grammar, context.now())) != null ? _a : continueList(tr, change, grammar, context.now())) != null ? _b : tr;
  };
}
function expandTrigger(tr, change, grammar, now) {
  if (change.inserted !== " " || change.toA !== change.fromA || grammar.trigger === null) {
    return null;
  }
  const line = tr.startState.doc.lineAt(change.fromA);
  const before = line.text.slice(0, change.fromA - line.from);
  if (!grammar.trigger.test(before)) {
    return null;
  }
  const triggerStart = change.fromA - grammar.settings.trigger.length;
  const beforeTrigger = before.slice(0, before.length - grammar.settings.trigger.length);
  const marker = /^[ \t]*$/.test(beforeTrigger) ? "- " : "";
  const previous = findPreviousTimestamp(docLines(tr.startState), line.number - 1, grammar);
  const insert = marker + renderStamp(now, previous, grammar) + " ";
  return {
    changes: { from: triggerStart, to: change.fromA, insert },
    selection: { anchor: triggerStart + insert.length },
    scrollIntoView: true
  };
}
function continueList(tr, change, grammar, now) {
  if (!CONTINUATION.test(change.inserted)) {
    return null;
  }
  const line = tr.startState.doc.lineAt(change.fromA);
  const parsed = parseStampLine(line.text, grammar);
  if (parsed === null || parsed.rest.trim() === "") {
    return null;
  }
  const insert = change.inserted.replace(/[ \t]*$/, "") + " " + renderStamp(now, parsed.timestamp, grammar) + " ";
  return {
    changes: { from: change.fromA, to: change.toA, insert },
    selection: { anchor: change.fromA + insert.length },
    scrollIntoView: true
  };
}
function docLines(state) {
  return state.doc.toString().split("\n");
}

// src/settings-tab.ts
var import_obsidian = require("obsidian");
var PREVIEW_GAP_MS = (20 * 60 + 22) * 1e3;
var LogTrackerSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.preview = null;
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Trigger keyword").setDesc("Type this followed by a space to insert a stamped bullet.").addText(
      (text) => text.setValue(this.plugin.settings.trigger).onChange((value) => {
        void this.commit({ trigger: value });
      })
    );
    new import_obsidian.Setting(containerEl).setName("Time format").setDesc("dayjs format tokens, for example YYYY-MM-DD - HH:mm:ss.").addText(
      (text) => text.setValue(this.plugin.settings.timeFormat).onChange((value) => {
        void this.commit({ timeFormat: value });
      })
    );
    new import_obsidian.Setting(containerEl).setName("Prefix").setDesc("Text placed before the timestamp. Kept out of the time format, which reads square brackets as an escape.").addText(
      (text) => text.setValue(this.plugin.settings.prefix).onChange((value) => {
        void this.commit({ prefix: value });
      })
    );
    new import_obsidian.Setting(containerEl).setName("Suffix").setDesc("Text placed after the elapsed tag.").addText(
      (text) => text.setValue(this.plugin.settings.suffix).onChange((value) => {
        void this.commit({ suffix: value });
      })
    );
    new import_obsidian.Setting(containerEl).setName("Use UTC").setDesc("Render and read timestamps in UTC rather than the local time zone.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.useUTC).onChange((value) => {
        void this.commit({ useUTC: value });
      })
    );
    new import_obsidian.Setting(containerEl).setName("Elapsed stamp").setDesc("Append the time since the previous timestamped bullet.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.elapsedEnabled).onChange((value) => {
        void this.commit({ elapsedEnabled: value });
      })
    );
    new import_obsidian.Setting(containerEl).setName("Elapsed style").setDesc("Always show hours, or drop the hours group below one hour.").addDropdown(
      (dropdown) => dropdown.addOption("hms", "HH:MM:SS").addOption("auto", "Auto (MM:SS under an hour)").setValue(this.plugin.settings.elapsedStyle).onChange((value) => {
        void this.commit({ elapsedStyle: value });
      })
    );
    const previewSetting = new import_obsidian.Setting(containerEl).setName("Preview").setDesc("How the next bullet renders right now.");
    this.preview = previewSetting.controlEl.createDiv({ cls: "log-tracker-preview" });
    this.renderPreview();
  }
  hide() {
    this.preview = null;
    this.containerEl.empty();
  }
  async commit(patch) {
    await this.plugin.updateSettings(patch);
    this.renderPreview();
  }
  /**
   * Draw two consecutive bullets: a synthetic earlier entry and the entry the
   * user would get if they typed the trigger now.
   */
  renderPreview() {
    var _a;
    const target = this.preview;
    if (target === null) {
      return;
    }
    target.empty();
    const settings = this.plugin.settings;
    const grammar = buildGrammar(settings);
    if (!grammar.compiled.valid) {
      target.createDiv({
        cls: "log-tracker-preview-error",
        text: `Invalid time format: ${(_a = grammar.compiled.error) != null ? _a : "unusable"}`
      });
      return;
    }
    const now = Date.now();
    const earlier = now - PREVIEW_GAP_MS;
    const earlierStamp = formatInstant(earlier, settings.timeFormat, settings.useUTC);
    target.createDiv({
      text: "- " + renderStamp(earlier, null, grammar) + " earlier entry"
    });
    target.createDiv({
      text: "- " + renderStamp(now, earlierStamp, grammar) + " this entry"
    });
  }
};

// src/main.ts
var LogTrackerPlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
    this.grammar = buildGrammar(DEFAULT_SETTINGS);
  }
  async onload() {
    await this.loadSettings();
    this.registerEditorExtension(
      import_state.EditorState.transactionFilter.of(
        createStampFilter({
          grammar: () => this.grammar,
          now: () => Date.now()
        })
      )
    );
    this.addCommand({
      id: "toggle-elapsed-stamp",
      name: "Toggle elapsed stamp",
      callback: () => {
        void this.toggleElapsed();
      }
    });
    this.addCommand({
      id: "audit-elapsed-stamps",
      name: "Audit elapsed stamps",
      editorCallback: (editor, _view) => {
        this.auditActiveDocument(editor);
      }
    });
    this.addSettingTab(new LogTrackerSettingTab(this.app, this));
  }
  /** Current compiled grammar, rebuilt whenever settings change. */
  getGrammar() {
    return this.grammar;
  }
  async loadSettings() {
    const stored = await this.loadData();
    this.settings = { ...DEFAULT_SETTINGS, ...stored != null ? stored : {} };
    this.grammar = buildGrammar(this.settings);
  }
  async updateSettings(patch) {
    this.settings = { ...this.settings, ...patch };
    this.grammar = buildGrammar(this.settings);
    await this.saveData(this.settings);
  }
  async toggleElapsed() {
    await this.updateSettings({ elapsedEnabled: !this.settings.elapsedEnabled });
    new import_obsidian2.Notice(
      this.settings.elapsedEnabled ? "Log Tracker: elapsed stamp on" : "Log Tracker: elapsed stamp off"
    );
  }
  /**
   * Recompute every elapsed tag in the active document and write the whole
   * correction as one transaction: a single `changes` array, one undo step,
   * and the caret carried to where it lands in the corrected text.
   */
  auditActiveDocument(editor) {
    var _a;
    if (!this.grammar.compiled.valid) {
      new import_obsidian2.Notice(`Log Tracker: time format is invalid (${(_a = this.grammar.compiled.error) != null ? _a : ""})`);
      return;
    }
    const text = editor.getValue();
    const result = auditDocument(text, this.grammar);
    if (result.replacements.length === 0) {
      new import_obsidian2.Notice(`Log Tracker: ${result.unchanged} stamp(s) already correct, nothing to change`);
      return;
    }
    const selection = editor.listSelections()[0];
    const anchor = selection === void 0 ? 0 : editor.posToOffset(selection.anchor);
    const head = selection === void 0 ? 0 : editor.posToOffset(selection.head);
    const audited = applyReplacements(text, result.replacements);
    const from = offsetToPosition(audited, mapOffset(anchor, result.replacements));
    const to = offsetToPosition(audited, mapOffset(head, result.replacements));
    editor.transaction({
      changes: result.replacements.map((replacement) => ({
        from: editor.offsetToPos(replacement.from),
        to: editor.offsetToPos(replacement.to),
        text: replacement.text
      })),
      selection: { from, to }
    });
    new import_obsidian2.Notice(
      `Log Tracker: ${result.updated} corrected, ${result.inserted} added, ${result.removed} removed, ${result.unchanged} unchanged`
    );
  }
};
