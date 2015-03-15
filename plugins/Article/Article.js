JSafo.plugins.Article = function(div)
{
	if(JSafo.pluginFormat(div, "DIV", "1.0.0.0"))
	{
		var head	= div.DIV[0];
		var content = div.DIV[1];
		var buttons = new Array("Yes", "No");
		var aSizes  = new Array("small", "inherit", "large");
		
		var lastLabel = null;
		
		function addLink()
		{
	        //Get the selected text and append the extra info
	        var selection = window.getSelection();
	            pagelink = '<br /><br /> Read more at: ' + document.location.href;
	            copytext = selection + pagelink;
	            newdiv = document.createElement('div');

	        //hide the newly created container
	        newdiv.style.position = 'absolute';
	        newdiv.style.left = '-99999px';

	        //insert the container, fill it with the extended text, and define the new selection
	        document.body.appendChild(newdiv);
	        newdiv.innerHTML = copytext;
	        selection.selectAllChildren(newdiv);

	        window.setTimeout(function ()
	        {
	            document.body.removeChild(newdiv);
	        }, 100);
	    }

	    document.addEventListener('copy', addLink);
		
		function printContent(answer)
		{
			if(answer == buttons[0])
			{
				win = open("", "", "location=no,menubar=no,status=no,toolbar=no, width=400, heigth=500");
				win.document.write("<html>");
				win.document.write("<head>");
				win.document.write("<title>"+content.title+"</title>");
				win.document.write("</head>");
				win.document.write("<body>");
				win.document.write(content.outerHTML);
				win.document.write("</body>");
				win.document.write(location);
				win.document.write("</html>");
				win.print();
			}
		}
		
		JSafo.foreach(head.A, function(a)
		{
			if(a.innerHTML == "A")
			{
				a.onclick = function()
				{
					this.className += " active";
					content.style.fontSize = JSafo.getCSS(this, 'font-size');
					
					if(lastLabel)
					{
						lastLabel.className = lastLabel.className.replace(" active", "");
					}
					
					lastLabel = this;
				};
			}
			else if(a.className == "print")
			{
				a.onclick = function()
				{
					if(!this.title) {this.title = "Print";}
					JSafo.Alert(this.title, this.title + ' "' + content.title + '"?', buttons.join("|"), printContent);
				};
			}
		});
	}
};