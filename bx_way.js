"use strict";

var BxWay = (function ()
{
	var bxWay = function (preFix)
	{	
		bind();
		fill();
	};

	function bind()
	{
		var nodeList = document.querySelectorAll("[bx-data]");
		for (var i = 0; i < nodeList.length; i++)
		{
			var item = nodeList[i];
			item.onkeyup = function (event)
			{
				var val = this.value;
				eval(item.getAttribute("bx-data") + "=" + " '" + val + "'");
				fill();
			};
		}

		
	}

	function fill()
	{
		var nodeList = document.querySelectorAll("[bx-data]");
		for (var i = 0; i < nodeList.length; i++)
		{
			var item = nodeList[i];
			var val = eval( item.getAttribute("bx-data") );
			if (val)
			{
				item.value = val;
			}
			else
			{
				item.value = null;
			}
		}
	};

	return bxWay;

})();