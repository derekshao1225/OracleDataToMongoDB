// query1 : find users whose hometown citys the specified city. 

function find_user(city, dbname){
    db = db.getSiblingDB(dbname);
    var results = [];
    // TODO: return a Javascript array of user_ids. 
    // db.users.find(...);
    db.users.find({"hometown.city" : city}).forEach(
        (user) => {
            results.push(user.user_id);
        }
    )
    return results;
}
