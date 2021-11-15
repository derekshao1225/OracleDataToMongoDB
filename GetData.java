import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.TreeSet;
import java.util.Vector;
import java.util.concurrent.locks.ReentrantLock;


//json.simple 1.1
// import org.json.simple.JSONObject;
// import org.json.simple.JSONArray;

// Alternate implementation of JSON modules.
import org.json.JSONObject;
import org.json.JSONArray;

public class GetData{
	
    static String prefix = "project3.";
	
    // You must use the following variable as the JDBC connection
    Connection oracleConnection = null;
	
    // You must refer to the following variables for the corresponding 
    // tables in your database

    String cityTableName = null;
    String userTableName = null;
    String friendsTableName = null;
    String currentCityTableName = null;
    String hometownCityTableName = null;
    String programTableName = null;
    String educationTableName = null;
    String eventTableName = null;
    String participantTableName = null;
    String albumTableName = null;
    String photoTableName = null;
    String coverPhotoTableName = null;
    String tagTableName = null;

    // This is the data structure to store all users' information
    // DO NOT change the name
    JSONArray users_info = new JSONArray();		// declare a new JSONArray

	
    // DO NOT modify this constructor
    public GetData(String u, Connection c) {
	super();
	String dataType = u;
	oracleConnection = c;
	// You will use the following tables in your Java code
	cityTableName = prefix+dataType+"_CITIES";
	userTableName = prefix+dataType+"_USERS";
	friendsTableName = prefix+dataType+"_FRIENDS";
	currentCityTableName = prefix+dataType+"_USER_CURRENT_CITIES";
	hometownCityTableName = prefix+dataType+"_USER_HOMETOWN_CITIES";
	programTableName = prefix+dataType+"_PROGRAMS";
	educationTableName = prefix+dataType+"_EDUCATION";
	eventTableName = prefix+dataType+"_USER_EVENTS";
	albumTableName = prefix+dataType+"_ALBUMS";
	photoTableName = prefix+dataType+"_PHOTOS";
	tagTableName = prefix+dataType+"_TAGS";
    }
	
	
	
	
    //implement this function

    @SuppressWarnings("unchecked")
    public JSONArray toJSON() throws SQLException{
    	JSONArray users_info = new JSONArray();
    	// used for nested queries
        Statement stmt1 = oracleConnection.createStatement();
        Statement stmt2 = oracleConnection.createStatement();
        Statement stmt3 = oracleConnection.createStatement();
        Statement stmt4 = oracleConnection.createStatement();
		ResultSet users = stmt1.executeQuery(
                "SELECT USER_ID, FIRST_NAME, LAST_NAME, GENDER, YEAR_OF_BIRTH, MONTH_OF_BIRTH, DAY_OF_BIRTH\n" +
                        "FROM "+ userTableName
        );
    	while(users.next()) {
            JSONObject mainJSON = new JSONObject();
    	    int uid = users.getInt(1);
    	    int yob = users.getInt(5);
    	    int mob = users.getInt(6);
    	    int dob = users.getInt(7);
    	    String fname = users.getString(2);
    	    String lname = users.getString(3);
    	    String gender = users.getString(4);
    	    // fill user basic info
    	    mainJSON.put("user_id", uid);
    	    mainJSON.put("YOB", yob);
            mainJSON.put("MOB", mob);
            mainJSON.put("DOB", dob);
            mainJSON.put("first_name", fname);
            mainJSON.put("last_name", lname);
            mainJSON.put("gender", gender);
            // fill user home town city info
    	    ResultSet hometownInfo = stmt2.executeQuery(
    	            "SELECT C.CITY_NAME, C.STATE_NAME, C.COUNTRY_NAME\n" +
                            "FROM " + cityTableName + " C, "+ hometownCityTableName + " H\n" +
                            "WHERE C.CITY_ID = H.HOMETOWN_CITY_ID AND H.USER_ID = " + uid
            );
            JSONObject hometownJSON = new JSONObject();
            while(hometownInfo.next()) {
                hometownJSON.put("city", hometownInfo.getString(1));
                hometownJSON.put("state", hometownInfo.getString(2));
                hometownJSON.put("country", hometownInfo.getString(3));
            }
            mainJSON.put("hometown", hometownJSON);
            // fill user current city info
            ResultSet currentInfo = stmt3.executeQuery(
                    "SELECT C.CITY_NAME, C.STATE_NAME, C.COUNTRY_NAME\n" +
                            "FROM " + cityTableName + " C, "+ currentCityTableName + " H\n" +
                            "WHERE C.CITY_ID = H.CURRENT_CITY_ID AND H.USER_ID = " + uid
            );
            JSONObject currentJSON = new JSONObject();
            while(currentInfo.next()) {
                currentJSON.put("city", currentInfo.getString(1));
                currentJSON.put("state", currentInfo.getString(2));
                currentJSON.put("country", currentInfo.getString(3));
            }
            mainJSON.put("current", currentJSON);
            // fill user friends info
            ResultSet friends = stmt4.executeQuery(
                    "SELECT USER2_ID FROM " + friendsTableName + " WHERE USER1_ID = " + uid
            );
            JSONArray friendsJSON = new JSONArray();
            while(friends.next()) {
                friendsJSON.put(friends.getInt(1));
            }
            mainJSON.put("friends", friendsJSON);
            users_info.put(mainJSON);
        }
		stmt1.close();
    	stmt2.close();
    	stmt3.close();
    	stmt4.close();
		return users_info;
    }

    // This outputs to a file "output.json"
    public void writeJSON(JSONArray users_info) {
	// DO NOT MODIFY this function
	try {
	    FileWriter file = new FileWriter(System.getProperty("user.dir")+"/output.json");
	    file.write(users_info.toString());
	    file.flush();
	    file.close();

	} catch (IOException e) {
	    e.printStackTrace();
	}
		
    }
}
