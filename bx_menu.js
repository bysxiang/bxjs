
"use strict";
//版本0.1
//作者：边缘随想 bysxiang.com

var BxMenu = (function ()
{
	//构造函数
	var obj = function (config)
	{
		this.element = config.element; //原生元素对象
		this.direction = config.direction || 0; //0表示菜单在上方， 1表示在下方
		this.style = config.style;

		this.menuId = ulId();
		this.shadeDivId = ulId("shade_div");
		this.items = new Array();

		this.bind();
	};

	//菜单项对象的构造函数
	obj.BxItem = function (text, url)
	{
		this.text = text;
		this.url = url;
	};

	var ulId = function (preStr)
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

	obj.prototype.addItem = function (item) 
	{
		this.items.push(item);
	};

	obj.prototype.bind = function ()
	{
		var that = this;
		this.element.onclick = function ()
		{
			var ul = document.getElementById(that.menuId);
			if ( !document.getElementById(that.shadeDivId) )
			{
				var tempDiv = document.createElement("div");
				tempDiv.id = ulId("shade_div");
				tempDiv.style.cssText = "width:100%; height:100%; position:absolute; top: 0; left: 0;";
				tempDiv.onclick = function ()
				{
					ul.style.display = "none";
					this.style.display = "none";
				};

				document.body.appendChild(tempDiv);
			}
			else
			{
				document.getElementById(that.shadeDivId).style.display = "inline";
			}

			ul.style.display = "inline";
		};
	};

	obj.prototype.render = function ()
	{
		var parentElement = this.element.parentNode;
		var ul = document.createElement("ul");
		if (this.style && this.style.ul)
		{
			ul.style.cssText = this.style.ul;
		}
		
		ul.id = this.menuId;
		ul.style.listStyle = "none";
		
		parentElement.insertBefore(ul, this.element);
		for (var i = 0; i < this.items.length; i++)
		{
			var li = document.createElement("li");
			if (this.style && this.style.li)
			{
				li.style.cssText = this.style.li;
			}
			
			var a = document.createElement("a");
			if (this.style && this.style.a)
			{
				a.style.cssText = this.style.a;
			}
			
			a.href = this.items[i].url;
			a.innerHTML = this.items[i].text;

			li.appendChild(a);
			ul.appendChild(li);
		}

		ul.style.zIndex = "100";
		ul.style.position = "absolute";
		if (this.direction == 0)
		{
			ul.style.left =  this.element.offsetLeft - (ul.offsetWidth - this.element.offsetWidth);
			ul.style.top = this.element.offsetTop - ul.offsetHeight - 5; 
		}
		else
		{
			ul.style.left =  this.element.offsetLeft - (ul.offsetWidth - this.element.offsetWidth);
			ul.style.top =  this.element.offsetTop + this.element.offsetHeight + 5;
		}

		ul.style.display = "none"; //设置好ul的坐标再定义它的显示或隐藏，否则显示坐标不正确
	};

	return obj;
})();

function aa()
{
	var menu = new BxMenu({element: document.getElementById("btn")} );
	menu.addItem(new BxMenu.BxItem("java", "#"));
	menu.addItem(new BxMenu.BxItem("c#", "http://www.baidu.com"));
	menu.render();

	var menu2 = new BxMenu({element: document.getElementById("btn2"), direction: 1,
		style: { ul: "background-color: #333; border-radius: 0.4rem; overflow: hidden;  position: absolute; right: 0.5rem; top: 2rem; ",
			li: "li { height: 2rem; padding: 0 0.25rem; color:#fff; }",
			a: "color:#888; border: 0; background: 0 0; font-weight: 400; display: -webkit-box; padding: 0.25rem 0.25rem;"
		 }
	});
	menu2.addItem(new BxMenu.BxItem("java2", "#"));
	menu2.addItem(new BxMenu.BxItem("c#2", "http://www.baidu.com"));
	menu2.render();
}