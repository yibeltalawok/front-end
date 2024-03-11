Title: - Single Order Status View!

To access got to, SideBar>Order Tracking> Attachment column>Order Status
Like I mentioned in the title, this feature is used to view the specific customer with only one order detailed description/status. This happens based on divide single order to Cloth color (e.g. White, Black, Blue-black...) and Label (e.g. L, M, XL...) permutations, after combination seems like (e.g. White-L, White-M, ... Black-XL, Black-M... Blue-black-M....), also each combination have’s status values in Cut In, Cut Out, Sew In, Sew Out, Finishing In, Finishing Out, Pack In, and Pack Out.

Frontend.
1) In 'Order tracking' sidebar
	* Inside attachment column click 'Order Status' (Used to initiate ‘SingleOrderStatus function' inside ../modules/orders/list/OrderList.vue)
	* From OrderList.vue because of this code '...mapActions("order", ["loadSingleOrderStatus"])' start execute.
	* Like I mentioned above line, API link executed/called from it, this call obtains 'OrderId' of selected order from the frontend.
	* The above have ScanOrderStatus.js path, So the required data will be executed and packed inside that file of Backend.


Backend.
2) Based on the received OrderId from the frontend/end-user, data fetched from scannOrderStaus model and/or singleOrderStausData endpoint.
	* From return data select distinct color types.
	* From distinct colors types fetch distinct label/size.
	* Based on the distinct Color and Label Combinations.
	* Inside endpoint 'getSingleOrderSpecification function' call, execute and return status/total value in each combination.
For instance, return data (Like as we all programmers know API return json data).
Var singleOrderStaus = [  
       [ "White", [ "S", 1250, 100, 0, 0, 0, 0, 0, 0, 0], [ "XXL", 417, 100, 0, 0, 0, 0, 0, 0, 0 ] ],
       [ "BlueLight", [ "S", 2500, 200, 0, 0, 0, 0, 0, 0, 0], [ "XXL", 834, 100, 0, 0, 0, 0, 0, 0, 0] ] 
]
To make and/or above json file algorithm start from fetch colors and labels  from the scanOrderStatus model of singleOrderStausData endpoint using selected OrderId, let me call it  result.
Var colorTypes = [];
Var label = [];
for(var i in result){
	//Fetch and assign to the array (colorTypes and label) only colors and labels from the result without duplication (distinct property).
}
  
Above forloop gives data like this.
Let colorTypes = [‘White’, ‘BlueLight’, ‘Red’];
Let label = [‘S’,’M’,’XL’];
With new nested forloop (Outer colorTypes as k, inner labels as g) required data (ci, co, si, so, fi, fo, pi, and po) fetch  from ScanOrderStauts using OrderId, colorTypes[k], and label [g].  
Also order size in color and label combination fetch from Order model (input in register new order, See below image).

3) Frontend.
1) Returned data is drawn dynamically in table form using the jQuery library inside OrderList.vue, because we don't know how much the selected order has a color and label/size combination.   
The reason behind why i use jQuery is,  because it helps draw dynamic tables in time of developer / return data number of rows unknown and only column width known.  E.g from the above return data we have two rows: column index starts from 0 to 10 , but each row has  one additional row (NB: this one is dynamic if selected order is other) column index starts from 1 to 10. 
	for(var i=0; i< singleOrderStaus.length; i++){
		Draw  0 to 10 column
		for(var j=2; j<singleOrderStaus[i].length; j++){
			// The reason why j start from 2 is, because first two array value used first for loop 
			Draw 1 to 10 Column
       }
       }
	
2) If return data is null, it means specific customer order does not start in the garment. So it will display “Selected order not start in garment!” instead of the table.
 
NB: In time of drawing table non cut colors not drawn and/or fetched from the backend.
            

