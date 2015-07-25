var FNV = require('fnv').FNV

var Blomma = function (bytes, rounds) {
  var indicies = function (value) {
    var hash = new FNV()
    var idx = []

    for (var i = 0 ; i < rounds ; i++) {
      hash.update(value)
      idx.push(parseInt(hash.digest('hex'), 16) % (bytes * 8))
      value = '\0'
    }
    return idx
  }

  var extend = function (buffer) {
    buffer.add = function (value) {
      var idx = indicies(value)
      for (var i = 0 ; i < rounds ; i++) {
        var bit = idx[i]
        buffer[bit >> 3] |= (1 << (bit % 8))
      }
    }
    buffer.has = function (value) {
      var idx = indicies(value)
      for (var i = 0 ; i < rounds ; i++) {
        var bit = idx[i]
        if (!(buffer[bit >> 3] & (1 << (bit % 8)))) {
          return false
        }
      }
      return true
    }
    buffer.contains = function (subset) {
      for (var i = 0 ; i < bytes ; i++) {
        if ((this[i] & subset[i]) !== subset[i]) {
          return false
        }
      }
      return true
    }
    return buffer
  }

  return {
    empty: function () {
      var buf = new Buffer(bytes)
      buf.fill(0)
      return extend(buf)
    },
    merge: function (a, b) {
      var buf = new Buffer(bytes)
      for (var i = 0 ; i < bytes ; i++) {
        buf[i] = a[i] | b[i]
      }
      return extend(buf)
    },
    clone: function (filter) {
      return extend(new Buffer(filter))
    }
  }
}

module.exports = Blomma
