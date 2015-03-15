JSafo.plugins.DataGrid = function(table)
{
	if(JSafo.pluginFormat(table, "TABLE", "1.0.0.0") && table.tHead.rows && table.tBodies[0])
	{
		var rows	= table.tBodies[0].rows;
		var col		= 0;
		var reverse = false;
		var rowSel	= null;
		
		function setThArrow(th)
		{
			th.className = th.className == "up"? "down" : "up";
		}
		
		function fillRows(data)
		{
			JSafo.foreach(rows, function(tr, i)
			{
				JSafo.foreach(tr.cells, function(td)
				{
					if(data[i])
					{
						if(td.headers) {td.innerHTML = data[i][td.headers];}
					}
					else {td.innerHTML = "&nbsp;";}
				});
			});
		}
		
		function setRowColor(row, i, sel)
		{
			row.className = sel? "active" : i % 2 == 0? "clean" : "dark";
		}
		
		function orderRows(th)
		{
			var key		= "";
			var keys	= new Array();
			var content = new Object();
			var sumKeys = 0;
			
			JSafo.foreach(rows, function(row, i)
			{
				if(row.textContent.replace(/\W/g,""))
				{
					key = row.cells[col].textContent + i;
					keys.push(key);
					content[key] = row.innerHTML;
					sumKeys += key;
				}
			});
			
			sumKeys > 0? keys.sort(function(a,b){return a-b;}) : keys.sort();
			
			if(th.className == "down") {keys.reverse();}
			
			JSafo.foreach(keys, function(key, i)
			{
				rows[i].innerHTML = content[key];
			});
		}
		
		function parseObj(tr)
		{
			var data = new Object();
			
			JSafo.foreach(tr.cells, function(td, i)
			{
				data[td.headers] = td.textContent;
			});
			
			return data;
		}
		
		JSafo.foreach(table.tHead.getElementsByTagName("TH"), function(th, i)
		{
			if(th.scope && th.scope == "col")
			{
				th.style.cursor = "pointer";
				th.onclick = function()
				{
					col = i;
					setThArrow(th);
					orderRows(th);
				};
			}
		});
		
		table.selectRow = function(index)
		{
			if(rows[index] && rows[index].textContent.replace(/[\s|\t]/g, ""))
			{
				if(rowSel != null) {setRowColor(rows[rowSel], rowSel, false);}
				setRowColor(rows[index], index, index != rowSel);
				rowSel = index != rowSel? index : null;
			}
			else if(index == rowSel) {rowSel = null;}
		};
		
		table.getSelRow = function() {return rowSel == null? null : parseObj(rows[rowSel]);};
		
		table.orderBy = function(index) {setThArrow(index);};
		
		table.dataProvider = function(data)
		{
			fillRows(data);
		};
		
		JSafo.foreach(rows, function(row, i)
		{
			setRowColor(row, i);
			row.onclick = function() {table.selectRow(i);};
		});
	}
};