// query 8: Find the city average friend count per user using MapReduce
// Using the same terminology in query 6, we are asking you to write the mapper,
// reducer and finalizer to find the average friend count for each city.


var city_average_friendcount_mapper = function () {
    emit(this.hometown.city, { "user_cnt": 1, "friends_arr": this.friends });
};

var city_average_friendcount_reducer = function (key, values) {
    let user_cnt = 0;
    let friends_arr = 0;
    for (let i = 0; i < values.length; ++i) {
        user_cnt += values[i]["user_cnt"];
        friends_arr = friends_arr.concat(values[i]["friends_arr"]);
    }
    return { "user_cnt": user_cnt, "friends_arr": friends_arr };
};

var city_average_friendcount_finalizer = function (key, reduceVal) {
    // We've implemented a simple forwarding finalize function. This implementation
    // is naive: it just forwards the reduceVal to the output collection.
    // Feel free to change it if needed.
    var ret = reduceVal.friends_arr.length / reduceVal.user_cnt;
    return ret;
}
