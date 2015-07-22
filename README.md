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

### bloom

The top level object methods:

#### empty()

Returns a new empty filter

#### clone (filter)

Returns a clone

#### merge (filter1, filter2)

Returns a filter that is a and b merged together with OR

### filter

#### add (string)

Adds the string to the bloom filter

#### has (string)

Returns false if not in the set, true if it might be

#### contains (subset)

Returns true if the filter contains everything that `subset` contains (and possibly more)

# License

MIT