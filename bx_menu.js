"use strict";
//版本0.2
//作者：边缘随想 bysxiang.com
var BxMenu = (function () 
{
	//构造函数
	var obj = function (config)
	{
		this.element = config.element; //原生元素对象
		this.style = config.style;
		this.shadeDivId = randomId("shade_div");
		this.menu = config.menu;

		this.bind();
	};

	var randomId = function (preStr)
	{
		if (!preStr)
		{
			preStr = "menu_";
		}
		
		var num = Math.floor(Math.random() * 10 + 1);
		while (document.getElementById(preStr + num))
		{
			num = Math.floor(Math.random() * 10 + 1);
		}
		
		return preStr + num;
	};

	obj.prototype.bind = function ()
	{
		var that = this;
		this.element.onclick = function ()
		{
			var ul = that.menu;
			if ( !document.getElementById(that.shadeDivId) )
			{
				var tempDiv = document.createElement("div");
				tempDiv.id = randomId("shade_div");
				tempDiv.style.cssText = "width:100%; height:100%; position:absolute; top: 0; left: 0;";
				tempDiv.onclick = function ()
				{
					
					that.menu.style.display = "none";
					//this.style.display = "none";
					document.body.removeChild(this); //从dom中移除当前节点
				};

				document.body.appendChild(tempDiv);
			}
			else
			{
				document.getElementById(that.shadeDivId).style.display = "block";
			}

			that.menu.style.display = "";
		};
	};

	return obj;
})();