var FNV = require('fnv').FNV

var Blomma = function (size, rounds) {
  var indicies = function (value) {
    var hash = new FNV()
    var idx = []

    for (var i = 0 ; i < rounds ; i++) {
      hash.update(value)
      idx.push(parseInt(hash.digest('hex'), 16) % (size * 8))
      value = '\0'
    }
    return idx
  }

  var Filter = function (data) {
    this.buffer = new Buffer(size)
    this.buffer.fill(0)
  }

  Filter.prototype = {
    add: function (value) {
      var idx = indicies(value)
      for (var i = 0 ; i < rounds ; i++) {
        var bit = idx[i]
        this.buffer[bit >> 3] |= (1 << (bit % 8))
      }
    },
    has: function (value) {
      var idx = indicies(value)
      for (var i = 0 ; i < rounds ; i++) {
        var bit = idx[i]
        if (!(this.buffer[bit >> 3] & (1 << (bit % 8)))) {
          return false
        }
      }
      return true
    },
    contains: function (subset) {
      for (var i = 0 ; i < size ; i++) {
        if ((this.buffer[i] & subset.buffer[i]) !== subset.buffer[i]) {
          return false
        }
      }
      return true
    }
  }

  return {
    empty: function () {
      return new Filter(size)
    },
    merge: function (a, b) {
      var filter = new Filter()
      for (var i = 0 ; i < size ; i++) {
        filter.buffer[i] = a.buffer[i] | b.buffer[i]
      }
      return filter
    },
    clone: function (toclone) {
      var filter = new Filter()
      for (var i = 0 ; i < size ; i++) {
        filter.buffer[i] = toclone.buffer[i]
      }
      return filter
    }
  }
}

module.exports = Blomma
