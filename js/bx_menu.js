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
		this.zIndex = isNaN(config.zIndex) ? 60 : config.zIndex;

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
		this.element.onclick = function (event)
		{
			var ul = that.menu;
			var ulParent = ul.parentNode;

			var tempDiv = document.createElement("div");
			tempDiv.id = that.shadeDivId;
			
			var cssText = "width: " + document.documentElement.scrollWidth + "px; height: "
				+ document.documentElement.scrollHeight + "px;" + "z-index:" + that.zIndex + ";";
			cssText += "background-color: black; opacity: 0.1; position: fixed; top: 0; left: 0;";
			
			tempDiv.style.cssText = cssText;
			
			tempDiv.onclick = function (event)
			{
				that.menu.style.display = "none";
				ulParent.removeChild(this);//从dom中移除当前节点
				event.stopPropagation();
			};

			ul.onclick = function (event)
			{
				ul.style.display = "none";
				tempDiv.click();
				event.stopPropagation(); //阻止Ul的事件冒泡
			};

			ulParent.appendChild(tempDiv);
			that.menu.style.display = "";
			event.stopPropagation();
		};
	};

	return obj;
})();