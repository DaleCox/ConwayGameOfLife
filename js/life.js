var canvasID = 'lifeCanvas';
//var lifeMatrix = new Array(bw);
var lifeMatrix; // = JSON.parse(emptyMatrix);
//grid width and height
var bw = 50;
var bh = 50;

var trackerArray = new Array();
var simInterval;
var itteration = 1;//0 is inital
var maxIteration;

function initalizeDataMatrix(){
    for(var i=0; i< bw;i++)
    {
        lifeMatrix[i] = Array.apply(null, new Array(bh)).map(Number.prototype.valueOf,0);
    }   
}

function createCanvas(){
    //initalizeDataMatrix();
    lifeMatrix = JSON.parse(emptyMatrix);
    
    var cw = (bw*10) + 2;
    var ch = (bh*10) + 2;

    var canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    canvas.id = canvasID;
    canvas.addEventListener('click', canvasClick);

    drawMatrix(canvas);
    document.body.appendChild(canvas);
}

function drawMatrix(canvas){
    //var canvas = document.getElementById(canvasID);
    var context = canvas.getContext("2d");
    for(var i=0; i< bh;i++)
    {
        for(var j=0; j< bw;j++){
            var positionheight = (i*10) +1;
             var positionWidth = (j*10) +1;
            context.lineWidth = "1";
            context.rect(positionWidth,positionheight,10,10);
        }
    }
     context.stroke();//must be after all contexts are updated. 
}

function drawBoard(){
    var canvas = document.getElementById(canvasID);
    var context = canvas.getContext("2d");

    for (var x = 0; x <= bw; x += 40) {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bh + p);
    }


    for (var x = 0; x <= bh; x += 40) {
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(bw + p, 0.5 + x + p);
    }

    context.strokeStyle = "black";
    context.stroke();
}

function canvasClick(evt) {
    var x = Math.floor(evt.offsetX/10);
    var y = Math.floor(evt.offsetY/10);
    //console.log(x+','+y);
	
    var selectedBrush = document.getElementById("brushList").selectedIndex;
	if(selectedBrush == 0){
		var currentCellValue = lifeMatrix[x][y];
		if(currentCellValue == 0){
			lifeMatrix[x][y] = 1;
		} else{
			lifeMatrix[x][y] = 0;
		}
		
		adjustCell(x, y, lifeMatrix[x][y]);
	}else{
		var brush = brushArray[selectedBrush];
		for(var brushX=0; brushX< brush.Matrix.length;brushX++)
		{
			for(var brushY=0; brushY< brush.Matrix[brushX].length;brushY++)
			{
				var newX = x+brushX;
				var newY = y+brushY
				lifeMatrix[newX][newY] = brush.Matrix[brushX][brushY];//TODO ensure array bounds and clip brush accordingly
				
				adjustCell(newX, newY, lifeMatrix[newX][newY]);
			}
		}
	}
}

function adjustCell(x, y, cellValue){
    var canvas = document.getElementById(canvasID);
    var context = canvas.getContext("2d");
    context.beginPath();

    if(cellValue == 1){
        context.fillStyle = document.getElementById("lifeColor").value;//"blue";
    } else{
        context.fillStyle = "white";
    }

    context.lineWidth = "1";
    context.strokeStyle = "black";
    var positionheight = (y*10) +1;
    var positionWidth = (x*10) +1;
    context.rect(positionWidth,positionheight,10,10);
    context.fill();
    context.stroke();
}

function runTime(){
    document.getElementById("startButton").disabled = true;
    var maxIterationEle = document.getElementById("maxIteration");
        maxIterationEle.disabled = true;
        maxIteration = maxIterationEle.value;
    var itterationSpeedEle = document.getElementById("iterationSpeed");
        itterationSpeedEle.disabled = true;
    
    simInterval = window.setInterval(function(){updateTheMatrix()}, itterationSpeedEle.value);
}

function updateTheMatrix(){ 
    var itterationChangeCount = 0;
    var nextItterationMatrix = new Array(bw);
    for(var x=0; x< bw;x++)
    {
        nextItterationMatrix[x] = new Array(bh);//init dead
        for(var y=0; y< bh;y++)
        {   
            var neighborCount = getLiveNeighborCount(x, y);
            //simulate cell
            if(lifeMatrix[x][y] == 0 && neighborCount == 3)
                nextItterationMatrix[x][y] = 1;            
            else if(lifeMatrix[x][y] == 1 && neighborCount < 2 )//1.    Any live cell with fewer than two live neighbors dies, as if caused by under-population
                nextItterationMatrix[x][y] = 0;
            else if(lifeMatrix[x][y] == 1 && neighborCount > 1 && neighborCount < 4)//2.    Any live cell with two or three live neighbours lives on to the next generation.
                nextItterationMatrix[x][y] = 1;
            else if(lifeMatrix[x][y] == 1 && neighborCount > 3 )//3.    Any live cell with more than three live neighbours dies, as if by overcrowding..
                nextItterationMatrix[x][y] = 0; 
            else              
                nextItterationMatrix[x][y] = 0; 

            //update the view
            if(nextItterationMatrix[x][y] != lifeMatrix[x][y]){
                adjustCell(x, y, nextItterationMatrix[x][y]);
                itterationChangeCount++;
            }
        }//end y
    }//end x
    lifeMatrix = nextItterationMatrix;

    var trackerObj = new Object();
    trackerObj.itteration = itteration;
    trackerObj.itterationChangeCount = itterationChangeCount;
    trackerArray.push(trackerObj);

    document.getElementById("iterationVal").value=itteration;
    itteration++;

    
    if(itteration > maxIteration)
        window.clearInterval(simInterval);
}


function stopTheSim(){
    window.clearInterval(simInterval);
	document.getElementById("startButton").disabled = false;
}

function resetTheSim(){
    itteration = 0;
    document.getElementById("iterationVal").value=itteration;
    lifeMatrix = new Array(bw);
    trackerArray = new Array();

    var maxIterationEle = document.getElementById("maxIteration");
        maxIterationEle.disabled = false;
        maxIterationEle.value = 1000;
    var itterationSpeedEle = document.getElementById("iterationSpeed");
        itterationSpeedEle.disabled = false;
        itterationSpeedEle.value = 250;

    var canvas = document.getElementById(canvasID);
    document.body.removeChild(canvas);
    createCanvas();

    document.getElementById("startButton").disabled = false;
}

function getLiveNeighborCount(x, y){
    //probably more effecient algorith here but brute force will work
    var maxWidth = lifeMatrix[0].length - 1;
    var maxHeight = lifeMatrix.length - 1;
    var neighborCount = 0;

    //top
    if(x > 0 && y > 0)
        neighborCount += lifeMatrix[x - 1][y -1];
    if(y > 0)
        neighborCount += lifeMatrix[x][y -1];
    if(y > 0 && x != maxWidth)
        neighborCount += lifeMatrix[x + 1][y -1];
    //sides
     if(x > 0)
        neighborCount += lifeMatrix[x -1][y];
     if(x != maxWidth)
        neighborCount += lifeMatrix[x +1][y];
    //bottom
    if(x > 0 && y != maxHeight)
        neighborCount += lifeMatrix[x -1][y + 1];
    if(y != maxHeight)
        neighborCount += lifeMatrix[x][y + 1];
    if(x != maxWidth && y != maxHeight)
        neighborCount += lifeMatrix[x +1][y + 1];

    return neighborCount;
} 

var emptyMatrix = "[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]";
