JSafo.plugins.Accordion = function(div)
{
	if(JSafo.pluginFormat(div, "DIV", "1.0.0.0"))
	{
		JSafo.foreach(div.A, function(a, i)
		{
			a.parent = div;
			a.setAttribute('onclick','this.parent.setTab('+i+')');
		});
		
		div.setTab = function(index)
		{
			for(var i=0; i < div.DIV.length; i++)
			{
				div.DIV[i].className = i == index? 'active' : 'hidden';
			}
		};
	}
};