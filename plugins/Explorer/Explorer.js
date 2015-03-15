JSafo.plugins.Explorer = function(ul)
{
	if(JSafo.pluginFormat(ul, "UL", "1.0.0.0"))
	{
		function formatFolder(a)
		{
			var li = a.parentNode;
			
			a.onclick = function()
			{
				li.className = (li.className == "open")? "close" : "open";
			};
		}
		
		function formatFile(a)
		{
			a.onclick = function()
			{
				JSafo.Ajax(this.path, null, function(ajaxResponse)
				{
					var onLoad = a.getAttribute("onload");
					
					if(onLoad)
					{
						var funct = eval(onLoad);
							funct(a, ajaxResponse);
					}
					else if(a.target)
					{
						JSafo.$(a.target).innerHTML = ajaxResponse;
					}
				});
			};
		}
		
		function formatItem(a)
		{
			a.innerHTML.indexOf(".") < 0? formatFolder(a) : formatFile(a);
		}
		
		function setChilds(item, fullPath)
		{
			var path = fullPath;
			
			JSafo.foreach(item.childNodes, function(child)
			{
				if(child.tagName == "A")
				{
					path += "/" + child.innerHTML;
					child.path = path;
					formatItem(child);
				}
				else if(child.tagName)
				{
					setChilds(child, path);
				}
			});
		}
		
		ul.addFolder = function(name)
		{
			var li = document.createElement("li");
			
			var a = document.createElement("a");
				a.className = "folder";
				a.innerHTML = name;
				
			li.appendChild(a);
			ul.appendChild(li);
			format(a);
		}
		
		setChilds(ul, "");
	}
}