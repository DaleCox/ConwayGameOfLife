var brushArray = new Array();

//just use index fo the  array for the select value


function populateBrushControl(){
	initializeBrushArray();
	
	var selectList = document.getElementById("brushList");
	for(var i=0; i< brushArray.length;i++){
		var option = document.createElement("option");
		option.text = brushArray[i].Text;
		selectList.add(option);
	}
	selectList.selectedIndex="0";
}

function updateBrushImage(){
	var selectedBrush = document.getElementById("brushList").selectedIndex;
	var selectedBrushImg = document.getElementById("selectedBrushImage");
	var newImageString = 'img/';
	newImageString +=selectedBrush+1;
	newImageString +='.png';
	selectedBrushImg.src = newImageString;
}

function initializeBrushArray(){
	var singleCellBrush = new Object();
	singleCellBrush.Text = 'Single Cell';
	singleCellBrush.Matrix = new Array(1);
	singleCellBrush.Matrix[0]=[1];

	brushArray.push(singleCellBrush);

	var blockBrush = new Object();
	blockBrush.Text = 'Block';
	blockBrush.Matrix = new Array(2);
	blockBrush.Matrix[0]=[1,1];
	blockBrush.Matrix[1]=[1,1];

	brushArray.push(blockBrush);

	var beehiveHBrush = new Object();
	beehiveHBrush.Text = 'Beehive - H';
	beehiveHBrush.Matrix = new Array(4);//x
	beehiveHBrush.Matrix[0]=[0,1,0];
	beehiveHBrush.Matrix[1]=[1,0,1];
	beehiveHBrush.Matrix[2]=[1,0,1];
	beehiveHBrush.Matrix[3]=[0,1,0];

	brushArray.push(beehiveHBrush);
	
	var beehiveVBrush = new Object();
	beehiveVBrush.Text = 'Beehive - V';
	beehiveVBrush.Matrix = new Array(3);//x
	beehiveVBrush.Matrix[0]=[0,1,1,0];
	beehiveVBrush.Matrix[1]=[1,0,0,1];
	beehiveVBrush.Matrix[2]=[0,1,1,0];

	brushArray.push(beehiveVBrush);
	
	var pondBrush = new Object();
	pondBrush.Text = 'Pond';
	pondBrush.Matrix = new Array(4);//x
	pondBrush.Matrix[0]=[0,1,1,0];
	pondBrush.Matrix[1]=[1,0,0,1];
	pondBrush.Matrix[2]=[1,0,0,1];
	pondBrush.Matrix[3]=[0,1,1,0];

	brushArray.push(pondBrush);
}

/*


			  <option value="Beehive">Beehive</option>
			  <option value="Loaf">Loaf</option>
			  <option value="Boat">Boat</option>

*/