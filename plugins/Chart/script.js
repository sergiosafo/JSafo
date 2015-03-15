JSafo.plugins.Chart = function(canvas)
{
	if(canvas.tagName == 'CANVAS')
	{
		var ctx = canvas.getContext("2d");
		var lineHeight = 20;
		var lineColours = new Array('#009','#C77','#030','#09C','#999');
		
		function createGrid(rowIndex)
		{
			ctx.beginPath();
			ctx.moveTo(0, rowIndex * lineHeight);
			ctx.lineTo(300, rowIndex * lineHeight);
			ctx.lineWidth = "0.5";
			ctx.strokeStyle = '#999';
			ctx.shadowBlur=0;
			ctx.stroke();
			ctx.closePath();
		}
		
		function createLine(tds, rowIndex)
		{
			var x = 10;
			
			ctx.beginPath();
			ctx.lineWidth = "4";
			ctx.strokeStyle = lineColours[rowIndex];
			ctx.shadowBlur = 20;
			ctx.shadowColor = "black";
			
			for(var i=1; i < tds.length; i++)
			{
				ctx.lineTo(x, (500 - tds[i]) / 2);
				x += 60;
			}
			
			ctx.stroke();
			ctx.closePath();
		}
		
		function addLabel(label, rowIndex)
		{
			ctx.font = "12px Verdana";
			ctx.fillStyle = lineColours[rowIndex];
			ctx.fillText(label, 0, (rowIndex + 1) * lineHeight);
			ctx.shadowBlur=0;
		}
			
		canvas.dataProvider = function(table)
		{
			JSafo.foreach(table.getColumn(0), function(label, rowIndex)
			{
				addLabel(label, rowIndex);
				createLine(table.getRow(rowIndex), rowIndex);
			});
		};
	}
	
	return canvas;
};