JSafo.plugins.Banner = function(div)
{
	if(JSafo.pluginFormat(div, "DIV", "1.0.0.0"))
	{
		var i = 0;
		var images = div.getElementsByTagName("img");
		var currImg = images[0];
		var prevImg;
		var time;
		
		div.defaultTime = 2000;
		div.timeLetter = div.defaultTime / 10;
		
		function calcTime()
		{
			return currImg.alt? currImg.alt.length * div.timeLetter : div.defaultTime;
		}
		
		function showImg()
		{
			prevImg.style.display = "none";
			currImg.style.display = "block";
		}
		
		function setImg()
		{
			if(i == images.length)
			{
				i = 0;
			}
			
			prevImg = currImg;
			currImg = images[i];
			showImg();
			i++;
			div.fadeIn();
			setTimeout(setImg, calcTime());
		}

		setImg();
	}
};