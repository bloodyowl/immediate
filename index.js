;(function(root, name, output){
  if(typeof define == "function" && define.amd) return define([], output)
  if(typeof module == "object" && module.exports) module.exports = output()
  else root[name] = output()
})(this, "immediate", function(){
  
  var immediate = {}
    , postMessageQueue = []
    , root = this
    , nativeSlice = [].slice
    , messageName = "immediate" + (Math.random() * (1<<30) | 0)
    , id = -1
  
  if(typeof root.setImmediate == "function" && typeof root.clearImmediate == "function") {
    immediate.call = function(fn){
      if(typeof fn != "function") {
        throw new TypeError("Expected a function")
      }
      // IE10 is pretty stupid
      return root.setImmediate.apply(root, arguments)
    }
  
    immediate.cancel = function(){
      // have to use a proxy, as IE10 only allows `clearImmediate`'s
      // `thisValue` to be `window`
      root.clearImmediate.apply(root, arguments)
    }
  
    return immediate
  }
  
  if (root.addEventListener && root.postMessage && !root.importScripts) {
    immediate.call = function(fn){
      if(typeof fn != "function") {
        throw new TypeError("Expected a function")
      }
      id = postMessageQueue.push({
        fn : fn,
        args : nativeSlice.call(arguments, 1),
        // `id` emulates the `clearImmediate` behaviour
        id : ++id
      })
      root.postMessage(messageName, "*")
      return id
    }
  
    immediate.cancel = function(id){
      var l = postMessageQueue.length
      if(!l) return
      while(--l) {
        if(postMessageQueue[l].id === id) {
          postMessageQueue.splice(l, 1)
        }
      }
    }
  
    root.addEventListener("message", function(evt){
      var source = evt.source, item
      if (source != root || source != null && evt.data != messageName) {
        return
      }
      evt.stopPropagation()
      item = postMessageQueue.shift()
      if(!item) return
      item.fn.apply(null, item.args)
    }, false)
  
    return immediate
  }
  
  immediate.call = function(fn){
    var args
    if(typeof fn != "function") {
      throw new TypeError("Expected a function")
    }
    args = nativeSlice.call(arguments, 1)
    return setTimeout(function(){
      fn.apply(null, args)
    }, 0)
  }
  
  immediate.cancel = function(id){
    clearTimeout(id)
  }
  
  return immediate

})