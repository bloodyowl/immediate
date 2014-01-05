var tape = require("tape")
  , immediate = require("../")

tape("async", function(test){

  var str = ""
  test.plan(4)

  test.throws(function(){
    immediate.call("window")
  }, "must be a function")

  immediate.call(function(arg){
    test.equal(arg, 1, "executed, and value passed")
  }, 1)

  test.notEqual(typeof immediate.call(function(arg){}, 1), "undefined", "Returns id (number or object)")

  var a = immediate.call(function(){
    test.ok(0, "should be canceled")
  })
  immediate.cancel(a)

  immediate.call(function(){
    str += "2"
  })
  str += "1"

  setTimeout(function(){
    test.equal(str, "12", "is asynchronous")
  }, 100)
})
