// query6 : Find the Average friend count per user for users
//
// Return a decimal variable as the average user friend count of all users
// in the users document.

function find_average_friendcount(dbname) {
  db = db.getSiblingDB(dbname)
  let friend_cnt = 0;
  let user_cnt = 0;
  db.users.find({}, { user_id: 1, friends: 1, _id: 0 }).forEach(
    (item) => {
      user_cnt += 1;
      friend_cnt += item.friends.length;
    }
  )
  return friend_cnt / user_cnt;
}
