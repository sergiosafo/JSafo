JSafo.plugins.Editor = function(div)
{
	if(JSafo.pluginFormat(div, "DIV", "1.0.0.0"))
	{
		var cursor;
		
		function Cursor()
		{
			var input = document.createElement("textarea");
				input.rows = 1;
				input.className = "cursor";
			
			input.escrever = function()
			{
				div.write(this.value);
				this.value = "";
			};
			
			input.onkeydown = function(event)
			{
				switch(event.keyCode)
				{
					case 9:
						event.preventDefault();
						div.tabular();
						break;
				}
			};
			
			input.onkeyup = function(event)
			{
				switch(event.keyCode)
				{
					case 8:
						div.apagar();
						break;
						
					case 13:
						div.pularLinha();
						break;
						
					default:
						this.escrever();
				}
			};
			
			return input;
		}
		
		cursor = new Cursor();
		
		div.appendChild(cursor);
		div.onclick = function(event)
		{
			if(event.currentTarget == this && event.target != this)
			{
				cursor.posicionar(event.target);
			}
			else
			{
				div.appendChild(cursor);
			}
			
			cursor.focus();
		};
		
		div.write = function(text)
		{
			if(text != "")
			{
				JSafo.foreach(text.split(""), function(char)
				{
					switch(char)
					{
						case "\t":	div.tabular(); break;
						case "\n":	div.pularLinha(); break;
						default:	div.addLetra(char);
					}
				});
			}
		};
		
		div.posicionar = function(letra)
		{
			div.insertBefore(cursor, letra);
			cursor.focus();
		};
		
		div.apagar = function()
		{
			if(cursor.previousSibling)
			{
				cursor.parentNode.removeChild(cursor.previousSibling);
			}
		};
		
		div.addLetra = function(char)
		{
			var letra = document.createElement("char");
				letra.innerHTML = char;
			
			cursor.parentNode.insertBefore(letra, cursor);
		};
		
		div.pularLinha = function()
		{
			var br = document.createElement("br");
			cursor.parentNode.insertBefore(br, cursor);
		};
		
		div.tabular = function()
		{
			var s = document.createElement("span");
				s.style.display = "inline-block";
				s.style.width = "40px";
				s.innerHTML = "&nbsp;";
			
			cursor.parentNode.insertBefore(s, cursor);
		};
		
		cursor.focus();
	}
}