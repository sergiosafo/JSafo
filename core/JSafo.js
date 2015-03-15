var JSafo = new function()
{
	var tags = document.getElementsByTagName("*");
	
	var threads		= new Array();
	var included	= new Array();
	var instanced	= new Array();
	var inLoad		= 0;
	var head, inProcess;
	
	this.version	= "1.0.0.0";
	this.plugins	= new Object();
	this.clock		= 30;
	
	function addToLoader(obj)
	{
		inLoad++;
		var onload = obj.getAttribute("onload");
		
		obj.onload = function()
		{
			eval(onload);
			inLoad--;
		};
	}
	
	for(var i in tags)
	{
		switch(tags[i].tagName)
		{
			case "HEAD":
				head = tags[i];
				break;
				
			case "BODY":
			case "IFRAME":
			case "VIDEO":
			case "LINK":
			case "SCRIPT":
				addToLoader(tags[i]);
				break;
				
			case "IMG":
				addToLoader(tags[i]);
				var img = new Image(); 
				img.src = tags[i].src;
				break;
				
			default:
				
		}
	}
	
	function checkThreads()
	{
		if(threads.length > 0)
		{
			inProcess = new Array();
			
			JSafo.foreach(threads, function(thread, i)
			{
				if(!thread(inProcess.length))
				{
					inProcess.push(thread);
				}
			});
			
			threads = inProcess;
		}
		
		setTimeout(checkThreads, this.clock);
	}
	
	function fade(obj, step)
	{
		var alpha	= step < 0? 100:0;
		var limit	= step < 0? 0:100;
		
		JSafo.addThread(function()
		{
			alpha += step;
			obj.style.opacity = alpha/100;
			
			return alpha == limit;
		});
	};
	
	function include(path)
	{
		if(included.indexOf(path) == -1)
		{
			included.push(path);
			return true;
		}
		else
		{
			return false;
		}
	}
	
	function mapChilds(obj)
	{
		obj.childs = new Array();
		
		JSafo.foreach(obj.childNodes, function(child, i)
		{
			if(child.tagName)
			{
				obj.childs.push(child);
				
				if(obj[child.tagName] && obj[child.tagName].indexOf(child) < 0)
				{
					obj[child.tagName].push(child);
				}
				else {obj[child.tagName] = new Array(child);}
				if(child.childNodes.length) {mapChilds(child);}
			}
		});
	}
	
	function Modal()
	{
		var area = document.createElement("div");
			area.className = "jsafo-modal jsafo-fullscreen jsafo-bg-alpha";
			document.body.appendChild(area);
			
		return area;
	}
	
	this.Alert = function(title, message, options, funct)
	{
		var area = new Modal();
		
		var box = document.createElement("div");
			box.className = "Alert";
			
		var t = document.createElement("span");
			t.className = "title";
			t.innerHTML = title;
			
		var p = document.createElement("p");
			p.className = "message";
			p.innerHTML = message;
			
		var buttons = document.createElement("form");
			buttons.className = "buttons";
		
		if(!options) {options = "Ok";}
			
		JSafo.foreach(options.split("|"), function(value)
		{
			var btn = document.createElement("input");
				btn.type = "button";
				btn.value = value;
				btn.onclick = function()
				{
					if(funct) {funct(this.value);}
					document.body.removeChild(area);
				};
			
			buttons.appendChild(btn);
		});

		area.appendChild(box);
		box.appendChild(t);
		box.appendChild(p);
		box.appendChild(buttons);
	};
	
	this.Ajax = function(url, params, funct)
	{
		var xmlHttp = window.ActiveXObject?
				new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
				
		xmlHttp.onreadystatechange = function()
		{
			if(xmlHttp.readyState == 4)
			{
				if(xmlHttp.status == 200 && funct)
				{
					funct(xmlHttp.responseText);
					JSafo.instancePlugins();
				}
				else
				{
					alert("JSafo Ajax Error "+xmlHttp.status, xmlHttp.responseText);
				}
			}
		};
		
		xmlHttp.open("POST", url, true);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlHttp.send('cache='+Math.random() + (params? "&" + params : ""));
		
		return xmlHttp;
	};
	
	this.Loader = function()
	{
		var area = new Modal();
			area.innerHTML = "Carregando...";
			
		return area;
	};
	
	this.Table = function(table)
	{
		table.setRows = function(funct)
		{
			JSafo.foreach(table.rows, funct);
		};
		
		table.setRowCells = function(tr, funct)
		{
			JSafo.foreach(tr.cells, funct);
		};
		
		table.setCells = function(funct)
		{
			JSafo.foreach(table.getElementsByTagName("TD"), funct);
		};
	};
	
	this.$ = function(id)
	{
		return document.getElementById(id);
	};
	
	this.addCSS = function(href)
	{
		if(include(href))
		{
			var link = document.createElement("link");
				link.rel = "stylesheet";
				link.href = href;
			
			head.appendChild(link);
		}
	}
	
	this.addJS = function(src)
	{
		if(include(src))
		{
			var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = src;
				
			head.appendChild(script);
		}
	};
	
	this.addThread = function(funct)
	{
		threads.push(funct);
	};
	
	this.allowDrop = function(event)
	{
		event.preventDefault();
	};
	
	this.clearBody = function() {document.body.innerHTML = "";};
	
	this.drag = function(event)
	{
		event.dataTransfer.setData("Transfer",event.target.id);
	};
	
	this.drop = function(event)
	{
		event.preventDefault();
		var obj = event.dataTransfer.getData("Transfer");
		event.target.appendChild(JSafo.$(obj));
	};
	
	this.fadeIn = function(obj, time)
	{
		fade(obj, time, 1);
	};
	
	this.fadeOut = function(obj, time)
	{
		fade(obj, time, -1);
	};
	
	this.foreach = function(vetor, funct)
	{
		if(vetor)
		{
			for(var i=0; i < vetor.length; i++)
			{
				funct(vetor[i],i);
			}
		}
	};
	
	this.getByClass = function(className)
	{
		if(document.getElementsByClassName)
		{
			return document.getElementsByClassName(className);
		}
		else
		{
			var group = new Array();
			
			JSafo.foreach(document.body.getElementsByTagName("*"), function(obj)
			{
				if(obj.className.indexOf(className) >= 0)
				{
					group.push(obj);
				}
			});
			
			return group;
		}
	};
	
	this.getCSS = function(obj, property)
	{
		var style = document.defaultView.getComputedStyle(obj,"");
		return property? style.getPropertyValue(property) : style;
	};
	
	this.getLang = function()
	{
		tags = document.getElementsByTagName("HTML");
		
		if(tags[0] && tags[0].lang)
		{
			return tags[0].lang;
		}
		else
		{
			return "";
		}
	};
	
	this.instancePlugins = function()
	{
		JSafo.foreach(JSafo.getByClass("JSafo"), function(obj)
		{
			var classes = obj.className.split(" ");
			var name = classes[1];
			
			JSafo.addCSS("JSafo/plugins/"+name+"/"+name+".css");
			JSafo.addJS("JSafo/plugins/"+name+"/"+name+".js");
			
			if(instanced.indexOf(obj) == -1)
			{
				JSafo.addThread(function()
				{
					if(JSafo.plugins[name])
					{
						JSafo.plugins[name](obj);
						
						if(obj.id)
						{
							window["$"+obj.id] = obj;
						}
						
						return true;
					}
					else
					{
						return false;
					}
				});
			}
		});
	};
	
	this.pluginFormat = function(obj, tagName, version)
	{
		if(obj.tagName == tagName && version >= JSafo.version)
		{
			obj.fadeIn 	= function()
			{
				JSafo.fadeIn(this);
			};
			obj.fadeOut	= function()
			{
				JSafo.fadeOut(this);
			};
			obj.choice	= function(group, groupAction, selIndex, selAction)
			{
				JSafo.foreach(group, function(child, i)
				{
					if(i == selIndex) {selAction(child);}
					else {groupAction(child);}
				});
			};
			
			obj.setChilds = function(tagName, funct)
			{
				JSafo.foreach(obj.getElementsByTagName(tagName), funct);
			};
			
			mapChilds(obj);
			
			return true;
		}
		else
		{
			alert(obj.className+" incompatible version!");
			return false;
		}
	};
	
	this.renderDraggable = function(obj)
	{
		obj.setAttribute("draggable","true");
		obj.setAttribute("ondragstart","JSafo.drag(event)");
	};
	
	this.renderDroppable = function(obj)
	{
		obj.setAttribute("ondrop","JSafo.drop(event)");
		obj.setAttribute("ondragover","JSafo.allowDrop(event)");
	};
	
	this.selCkb = function(ckb, inputNames)
	{
		var checkboxes = document.getElementsByName(inputNames);
		
		JSafo.foreach(checkboxes, function(checkbox)
		{
			checkbox.checked = ckb.checked;
		});
	};
	
	checkThreads();
};