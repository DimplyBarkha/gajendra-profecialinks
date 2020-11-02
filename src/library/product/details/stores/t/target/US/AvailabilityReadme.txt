
1. Products Without variants

> Note : We found all tag in whole html page source.

Step 1 : available_to_promise_network
-> "availability":"

Step 2 : from above availability tag if we found below status

If Availability = "AVAILABLE" Or Availability = "IN_STOCK" Then
-> Availability = "In Stock"
Else Availability is blank.

Step 3 : If Availability = "" Then Check below 2 tags :

-> Availability = "In Store Only" if following tag appears:  "is_out_of_stock_in_all_store_locations":false,"is_out_of_stock_in_all_online_locations":true
-> Availability = "Out of stock" if following tag appears: "is_out_of_stock_in_all_store_locations":true,"is_out_of_stock_in_all_online_locations":true

2. Products that have varians

> Note : We found all tag in Variation Bunch (not search tag from whole page).

Variation Bunch tag : "product_id":"

Step 1 : available_to_promise_network
-> "availability_status":"

Step 2 : from above availability tag if we found below status

If Availability = "AVAILABLE" Or Availability = "IN_STOCK" Or Availability = "LIMITED_STOCK" Then
-> Availability = "In Stock"
           Else Availability is blank.  

Step 3 : If Availability = "" Then Check below 2 tags :

-> Availability = "In Store Only" if following tag appears "is_out_of_stock_in_all_store_locations":false,"is_out_of_stock_in_all_online_locations":true
-> Availability = "Out of stock" if following tag appears "is_out_of_stock_in_all_store_locations":true,"is_out_of_stock_in_all_online_locations":true

We then added the following condition but I am not sure where this fits into the above flow. Have asked for confirmation.

-> Availability = "In Store Only" if following tag appears "is_out_of_stock_in_all_store_locations":false,"is_out_of_stock_in_all_online_locations":false

===============================  ===============================  ===============================  =============================== 