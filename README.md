# epsg-server

epsg-finder is a Geomage-2003 LTD website that lets its users the option to automatically take a picture of the location of their choosing and see multiple locations with a changing EPSG code.

How to use the Lat/Lng form:
► How to use it:
    1) Open the form.
    2) Enter the Latitude and Longtitude, and submit the form.
    3) Submit the form.

► What to expect:
    1) On the map you will see a marker positioned according to the coordinates you entered.


How to find EPSG code with XY and location:
► Properties:
    1) x: X coordinate you have.
    2) y: Y coordinate you have.
    3) location: click the locaion you know.

► How to use it:
    1) In the EPSG form in the website choose the Manual option.
    2) Enter the X and Y coordinates, and submit the form.
    3) Once you did that the gray button that said "Please fill EPSG form" will become blue.
    4) Click this button and after that choose your location on the map. 

► What to expect:
    1) Under the form you will see a table with Possible EPSG and Distance headers.
    2) On the map you will see markers positioned according to the epsg codes in the table and the X Y you entered.


The /generate function:
► Properties:
    1) epsg: epsg code of the coordinates incoming.
    2) x1: X coordinate of the first coordinate.
    3) y1: Y coordinate of the first coordinate.
    4) x2: X coordinate of the second coordinate.
    5) y2: Y coordinate of the second coordinate.
    6) format: format of the map you want to see, you can use: standart(default), topography and satellite.
    7) name: name of the image created, using this name you will get the image URL (default: generate-image).

► How to use it:
    1) You make a request: /generate?epsg=<EPSG code>&x1=<X1>&y1=<Y1>&x2=<X2>&y2=<Y2>&format=standart&name=<name of your coosing>.
       This request creates a object with the name you chose.
    2) You make a request: /find/<name of your coosing>.
       This request gives you the URL of the image you created.

► What to expect:
    You should expect an JSON object with the url, name and _id properties in it, it'll look like this:
    {
        "_id": "6458e4361b8a7e87899510cc",
        "url": "blob:http://89.169.96.143:4000/bfbd5fa9-cf19-44cf-a149-d12e7776d5f3",
        "name": "minka1902"
    }


The /coordinates function:
► Properties:
    1) list: in this list you enter all the coordinates you want X coordinate and then Y coordinate.

► How to use it:
    1) You make a request: /coordinates?list=<X1>,<Y1>,<X2>,<Y2>,<X3>,<Y3>,<X4>,<Y4>.
       This request creates as much markers as you entered, according to the coordinates.
    2) In the EPSG form in the website choose the Manual option.
    3) Fill ONLY the EPSG input and submit the form.
    4) You can repeat with different EPSG codes.

► What to expect:
    You will see Markers on the map according to the coordinates and EPSG code you entered.
