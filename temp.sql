SELECT C.CITY_NAME, C.STATE_NAME, C.COUNTRY_NAME
FROM CITIES C, HOMETOWN_CITIES H
WHERE C.CITY_ID = H.HOMETOWN_CITY_ID AND H.USER_ID =