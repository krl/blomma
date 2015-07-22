# blomma

Bloom filters in javascript yet again.

I wanted something that used buffers directly, and that also supports merging and subset tests.

## usage

```js
var bloom = require('blomma')(32, 3)

var filter = bloom.empty()

filter.add('hello')

filter.has('hello') // => true
filter.has('goodbye') // => false
```

## api

### bloom

The top level object methods:

#### empty()

Returns a new empty filter

#### merge (filter a, filter b)

Returns a filter that is a and b merged together with OR

### filter

#### add (string/buffer value)

Adds the value to the bloom filter

#### has (string/buffer value)

Returns false if not in the set, true if it might be

#### contains (filter subset)

Returns true if `subset` is a subset of the filter, i.e, contains everything that subset contains (and possibly more)

# License

MIT