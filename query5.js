// find the oldest friend for each user who has a friend. 
// For simplicity, use only year of birth to determine age, if there is a tie, use the one with smallest user_id
// return a javascript object : key is the user_id and the value is the oldest_friend id
// You may find query 2 and query 3 helpful. You can create selections if you want. Do not modify users collection.
//
//You should return something like this:(order does not matter)
//{user1:userx1, user2:userx2, user3:userx3,...}

function oldest_friend(dbname) {
  db = db.getSiblingDB(dbname);
  var results = {};

  let userBirth = db.users.find({}, { user_id: 1, YOB: 1, _id: 0 });
  let userDict = {};
  let oldest = [];
  let dumbVal = 999999;

  for (let i = 0; i < userBirth.length(); ++i) {
    let user_id = userBirth[i]["user_id"];
    let user_year = userBirth[i]["YOB"];
    // arr: [YOB, user_id]
    oldest[user_id] = [dumbVal, dumbVal];
    userDict[user_id] = user_year;
  }

  function replaceOldest(d) {
    if ((userDict[d.friends] == oldest[d.user_id][0]
      && d.friends < oldest[d.user_id][1])
      || userDict[d.friends] < oldest[d.user_id][0]) {
      oldest[d.user_id][1] = d.friends; // friend ID
      oldest[d.user_id][0] = userDict[d.friends]; // YOB
    }
  }


  db.users.aggregate([{ $project: { _id: 0, user_id: 1, friends: 1 } }, { $unwind: "$friends" }, { $out: "high_id" }]);


  db.high_id.find().forEach(
    (d) => {
      replaceOldest(d);
    }
  );

  db.high_id.find().forEach(
    (user_instance) => {
      db.low_id.insertOne({ user_id: user_instance.friends, friends: user_instance.user_id });
    }
  );

  db.low_id.find().forEach(
    (d) => {
      replaceOldest(d);
    }
  );

  for (let i = 0; i < oldest.length; i++) {
    results[i] = oldest[i][1];
    if (results[i] === dumbVal) {
      delete results[i];
    }
  }

  return results
}
