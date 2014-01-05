# immediate

[![browser support](https://ci.testling.com/bloodyowl/immediate.png)](https://ci.testling.com/bloodyowl/immediate)

## Install

```
$ npm install bloody-immediate
```

## Require

```javascript
var immediate = require("bloody-immediate")
// or 
define(["immediate"], function(immediate){  })
// or 
window.immediate
```

## API

### `immediate.call(fn[, args …]) -> id`

Calls `fn` asynchronously with `args…` as arguments.
`fn` must be a function, no string is accepted.  

### `immediate.cancel(id)`

Cancels the given immediate call. 
