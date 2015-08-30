'use strict'

var assert = require('assert')
var bloom = require('../blomma.js')(32, 3)

/*global describe, it*/

describe('bloom', function () {
  var filter = bloom.empty()

  it('should not have anything', function () {
    assert(!filter.has('anything'))
    assert(!filter.has('an empty bloom filter is always right'))
  })

  filter.add('one')
  filter.add('two')
  filter.add('three')

  it('should have one two three', function () {
    assert(filter.has('one'))
    assert(filter.has('two'))
    assert(filter.has('three'))
  })

  it('probably shouldnt have four', function () {
    assert(!filter.has('four'))
  })

  describe('merging', function () {
    var f1 = bloom.empty()
    var f2 = bloom.empty()

    f1.add('one')
    f1.add('two')
    f1.add('three')
    f2.add('four')
    f2.add('five')
    f2.add('six')

    var f3 = bloom.merge(f1, f2)

    it('should have merged two filters', function () {
      assert(f3.has('one'))
      assert(f3.has('two'))
      assert(f3.has('three'))
      assert(f3.has('four'))
      assert(f3.has('five'))
      assert(f3.has('six'))
    })

    it('should probably not have seven', function () {
      assert(!f3.has('seven'))
    })
  })

  describe('contains', function () {
    var set1 = ['a', 'b', 'c', 'd']
    var set2 = ['A', 'B', 'C', 'D']
    var set3 = ['α', 'β', 'γ', 'δ']

    var f1 = bloom.empty()
    var f2 = bloom.empty()
    var f3 = bloom.empty()

    var i
    for (i = 0 ; i < 4 ; i++) f1.add(set1[i])
    for (i = 0 ; i < 4 ; i++) f2.add(set2[i])
    for (i = 0 ; i < 4 ; i++) f3.add(set3[i])

    var f12 = bloom.merge(f1, f2)
    var f13 = bloom.merge(f1, f3)
    var f23 = bloom.merge(f2, f3)

    var f123 = bloom.merge(f12, f3)

    it('f123 should contain all others', function () {
      assert(f123.contains(f1))
      assert(f123.contains(f2))
      assert(f123.contains(f3))
      assert(f123.contains(f12))
      assert(f123.contains(f13))
      assert(f123.contains(f23))
      assert(f123.contains(f123)) // omg
    })

    it('f12 should contain 1 2', function () {
      assert(f12.contains(f1))
      assert(f12.contains(f2))
      assert(!f12.contains(f3))
    })

    it('f13 should contain 1 3', function () {
      assert(f13.contains(f1))
      assert(f13.contains(f3))
      assert(!f13.contains(f2))
    })

    it('f23 should contain 2 3', function () {
      assert(f23.contains(f2))
      assert(f23.contains(f3))
      assert(!f23.contains(f1))
    })

    it('f12 should not contain 3', function () {
      assert(!f12.contains(f3))
    })

    it('f13 should not contain 2', function () {
      assert(!f13.contains(f2))
    })

    it('f23 should not contain 1', function () {
      assert(!f23.contains(f1))
    })
  })

  describe('cloning', function () {
    var f1 = bloom.empty()
    f1.add('oho')
    var f2 = bloom.clone(f1)
    f2.add('aha')

    it('should have cloned the filter', function () {
      assert(f1.has('oho'))
      assert(f2.has('oho'))
      assert(!f1.has('aha'))
      assert(f2.has('aha'))
    })
  })

  describe('fromBuffer', function () {
    it('should have made filter from buffer', function () {
      var f1 = bloom.empty()
      f1.add('oho')
      f1.add('aha')
      var f2 = bloom.fromBuffer(f1.buffer)

      assert(f2.has('oho'))
      assert(f2.has('aha'))
    })
  })
})
