JSafo.plugins.PieChart = function(canvas)
{
	if(canvas.tagName == 'CANVAS')
	{
		var ctx = canvas.getContext("2d");
		var lineHeight = 20;
		var rows = 0;
		
		function init()
		{
			ctx.beginPath();
			ctx.fillStyle="#FF0000";
			ctx.arc(95,50,40,0,2*Math.PI);
			ctx.stroke();
		}
		
		function getRows(table)
		{
			JSafo.foreach(table.rows, function(tr, i)
			{
				if(tr.tagName) {getCells(tr);}
			});
		}
		
		function getCells(tr)
		{
			var tds = tr.getElementsByTagName('td');
			
			if(tds[0]) {addLabel(tds[0]);}
		}
		
		function addLabel(td)
		{
			ctx.font = lineHeight + "px Arial";
			ctx.fillText(td.innerHTML, 10, rows * lineHeight);
		}
			
		canvas.dataProvider = function(table)
		{
			getRows(table);
		};
		
		init();
	}
	
	return canvas;
};