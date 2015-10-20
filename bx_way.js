"use strict";

var BxWay = (function ()
{
	var bxWay = function (preFix)
	{	
		bind();
		fill();
	};

	//对绑定的元素的绑定onkeyup事件
	function bind()
	{
		var nodeList = document.querySelectorAll("[bx-data]");
		for (var i = 0; i < nodeList.length; i++)
		{
			var item = nodeList[i];

			//绑定keyup事件
			var oldKeyupEvent = this.onkeyup;
			item.onkeyup = function (event)
			{
				if (typeof (oldKeyupEvent)  == "function")
				{
					oldKeyupEvent(event);
				}
				var val = this.value;
				eval(this.getAttribute("bx-data") + "=" + " '" + val + "'");
				fill(this.getAttribute("bx-data"));
			};

			//绑定change事件
			var oldChange = this.onchange;
			item.onchange = function (event)
			{
				if (typeof(oldChange) == "function")
				{
					oldChange(event);
				}
				var val = this.value;
				eval(this.getAttribute("bx-data") + "=" + " '" + val + "'");
				fill(this.getAttribute("bx-data"));
			};

			item.onchange = update_val;
		}
	}

	function update_val(event)
	{
		
	}

	//重新填充绑定的值，
	//objStr即元素绑定的绑定的变量字符串
	function fill(objStr)
	{
		if (objStr)
		{
			var nodeList = document.querySelectorAll("[bx-data='" + objStr + "']");
		}
		else
		{
			var nodeList = document.querySelectorAll("[bx-data]");
		}
		
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