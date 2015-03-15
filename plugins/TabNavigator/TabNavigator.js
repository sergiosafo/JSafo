JSafo.plugins.TabNavigator = function(div)
{
	if(JSafo.pluginFormat(div, "DIV", "1.0.0.0"))
	{
		var tabs, divs;
		var currIndex = 0;
		
		function formatTab(tab)
		{
			var onClick = tab.getAttribute("onclick");
			var i = tabs.length;
			
			if(tab.className == "active")
			{
				currIndex = i;
			}
			
			tab.onclick = function()
			{
				div.setTab(i);
				
				if(onClick)
				{
					eval(onClick);
				}
			};
			
			tabs.push(tab);
		}
		
		function read()
		{
			tabs = new Array();
			divs = new Array();
			
			JSafo.foreach(div.childNodes, function(obj, i)
			{
				switch(obj.tagName)
				{
					case "A": formatTab(obj); break;
					case "DIV": divs.push(obj); break;
				}
			});
		}
		
		div.setTab = function(index)
		{
			if(tabs[currIndex])
			{
				tabs[currIndex].removeAttribute("class");
				divs[currIndex].removeAttribute("class");
			}
			
			if(tabs[index])
			{
				tabs[index].setAttribute("class", "active");
				divs[index].setAttribute("class", "active");
				currIndex = index;
			}
			else if(index != 0)
			{
				this.setTab(0);
			}
		};
		
		div.addTab = function(title, content)
		{
			var index = tabs.length;
			
			var x = document.createElement("a");
				x.innerHTML = "X";
				x.className = "close";
				x.onclick = function()
				{
					this.parentNode.onclick = null;
					div.closeTab(tabs.indexOf(this.parentNode));
				};
			
			var a = document.createElement("a");
				a.innerHTML = title;
				
			var d = document.createElement("div");
				d.innerHTML = content;
				
			formatTab(a);
			a.appendChild(x);
			divs.push(d);
			
			divs.length?
				this.insertBefore(a, divs[0]) : this.appendChild(a);
					
			this.appendChild(d);
			this.setTab(index);
		};
		
		div.getTab = function(index)
		{
			return divs[index]? divs[index] : null;
		};
		
		div.getCurrent = function()
		{
			return this.getTab(currIndex);
		};
		
		div.closeTab = function(index)
		{
			this.removeChild(tabs[index]);
			this.removeChild(divs[index]);
			
			if(index == currIndex)
			{
				this.setTab(--currIndex);
			}
			
			read();
		};
		
		read();
	}
};