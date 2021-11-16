
// query 4: find user pairs (A,B) that meet the following constraints:
// i) user A is male and user B is female
// ii) their Year_Of_Birth difference is less than year_diff
// iii) user A and B are not friends
// iv) user A and B are from the same hometown city
// The following is the schema for output pairs:
// [
//      [user_id1, user_id2],
//      [user_id1, user_id3],
//      [user_id4, user_id2],
//      ...
//  ]
// user_id is the field from the users collection. Do not use the _id field in users.

function suggest_friends(year_diff, dbname) {
    db = db.getSiblingDB(dbname);
    var pairs = [];
    db.users.find({ "gender": "female" }, { user_id: 1, YOB: 1, hometown: 1, gender: 1, friends: 1, _id: 0 }).forEach(
        (female) => {
            db.users.find({
                "gender": "male",
                "hometown.city": female.hometown.city,
                // male not in friends of female
                "user_id": { $nin: female.friends },
                // between yeardiff
                $and: [{ "YOB": { $lt: female.YOB + year_diff } },
                { "YOB": { $gt: female.YOB - year_diff } }]
            },
                { user_id: 1, YOB: 1, hometown: 1, gender: 1, friends: 1, _id: 0 }).forEach(
                    (male) => {
                        // check in two directions, female not in friends of male
                        if (db.users.find({
                            $and: [{ "user_id": female.user_id },
                            { "user_id": { $in: male.friends } }]
                        },
                            { user_id: 1, friends: 1, _id: 0 }).length() === 0) {
                            pairs.push([female.user_id, male.user_id]);
                        }
                    }
                )
        }
    )
    return pairs;
}
