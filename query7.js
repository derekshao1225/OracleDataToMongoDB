// query 7: Find the number of users born in each month using MapReduce

var num_month_mapper = function () {
  emit(this.MOB, { "user_cnt": 1 });
}

var num_month_reducer = function (key, values) {
  let user_cnt = 0;
  let user_dict = {};
  for (let i = 0; i < values.length; ++i) {
    user_cnt += values[i]["user_cnt"];
  }
  user_dict = { "user_cnt": user_cnt };
  return user_dict;
}

var num_month_finalizer = function (key, reduceVal) {
  // We've implemented a simple forwarding finalize function. This implementation 
  // is naive: it just forwards the reduceVal to the output collection.
  // Feel free to change it if needed. 
  var ret = reduceVal["user_cnt"];
  return ret;
}
