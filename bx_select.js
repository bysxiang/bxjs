"use strict";

var BxSelect = (function()
{
	var bxSelect = function (config)
	{
		this.element = config.element;
		this.zIndex = config.zIndex || 50;
		if (!config.ajax)
		{
			this.data = config.data || [];
		}
		else
		{
			this.data = [];
		}
		this.ajax = config.ajax;
		
		this.selectedIndex = config.selectedIndex;
		this.selectedChanged = config.selectedChanged;

		var width = document.documentElement.clientWidth;

		this.divWrapper = document.createElement("div");
		this.divWrapper.className = "bx-select-wrapper";
		var divWrapperCss = "z-index: " + this.zIndex + "; ";
		this.divWrapper.style.cssText = divWrapperCss;

		var inputDiv = document.createElement("div");
		inputDiv.className = "bx-select-input";
		this.divWrapper.appendChild(inputDiv);

		this.inputX = document.createElement("input");
		this.inputX.type = "button";
		this.inputX.value = "X";

		inputDiv.appendChild(this.inputX);

		this.inputTxt = document.createElement("input");
		this.inputTxt.type = "text";
		inputDiv.appendChild(this.inputTxt);

		this.inputSearch = document.createElement("input");
		this.inputSearch.type = "button";
		this.inputSearch.value = "搜索";
		inputDiv.appendChild(this.inputSearch);

		document.body.appendChild(this.divWrapper);

		var targetLeft = this.inputTxt.offsetLeft;
		var targetTop = this.inputTxt.offsetTop;
		var targetWidth = this.inputTxt.clientWidth;
		var targetHeight = this.inputTxt.offsetHeight;

		this.listDiv = document.createElement("div");
		this.listDiv.className = "bx-select-list";
		var listDivCss = "left: " + targetLeft + "px; top: " + (targetTop + targetHeight) + 
			"px; width: " + targetWidth + "px;";
		this.listDiv.style.cssText = listDivCss;
		this.divWrapper.appendChild(this.listDiv);

		this.divWrapper.style.display = "none";
		this.listDiv.style.display = "none";

		this.ul = document.createElement("ul");
		this.ul.className = "bx-select-ul";
		this.listDiv.appendChild(this.ul);

		this.doingEvents();
		if (!config.ajax)
		{
			renderSelect(this, this.data);
		}
	}

	//处理事件
	bxSelect.prototype.doingEvents = function ()
	{	
		var that = this;
		//宿主元素焦点事件
		that.element.addEventListener("focus", function (event)
		{
			that.divWrapper.style.display = "";
			that.inputTxt.focus();
			renderSelect(that, that.data);
		});
		
		//处理列表项选择事件
		that.ul.addEventListener("click", function (event)
		{
			if (event.target !== event.currentTarget)
			{
				var oldText = that.element.value;
				var oldValue = that.element.getAttribute("data-bx-value");

				that.element.value = event.target.innerHTML;
				that.element.setAttribute("data-bx-value", event.target.getAttribute("data-bx-value"));

				if (that.selectedIndex && typeof(that.selectedIndex == "function"))
				{
					that.selectedIndex({text: event.target.innerHTML, value: event.target.getAttribute("data-bx-value")});
				}

				if ( event.target.getAttribute("data-bx-value") != oldValue 
					&& that.selectedChanged && typeof(that.selectedChanged) == "function" )
				{
					that.selectedChanged({text: event.target.innerHTML, value: event.target.getAttribute("data-bx-value")});
				}
			}
			that.divWrapper.style.display = "none";
		});

		//处理关闭列表事件
		that.inputX.addEventListener("click", function (event)
		{
			that.divWrapper.style.display = "none";
		});

		that.inputSearch.addEventListener("click", function (event)
		{
			if (that.ajax && typeof(that.ajax) == "object")
			{
				//处理data
				var data = (that.ajax.data && typeof( that.ajax.data) == "function") ? 
					that.ajax.data(that.inputTxt.value) : null;
				var type = that.ajax.type || "get";
				var url = that.ajax.url;

				var xhr = new XMLHttpRequest();
				//处理ajax返回的数据
				xhr.onreadystatechange = function ()
				{
					if (xhr.readyState == 4)
					{
						if (xhr.status == 200)
						{
							var data = that.ajax.results(parseContent(xhr, that.ajax.dataType));

							//如果是ajax动态检索，则每次重新复制对象的data
							that.data = data;
							renderSelect(that, data);
							// 执行填充完数据的回调
							if (that.ajax.fillClose && typeof(that.ajax.fillClose) == "function")
							{
								that.ajax.fillClose();
							}
						}
						else
						{
							// 执行填充完数据的回调
							if (that.ajax.fillClose && typeof(that.ajax.fillClose) == "function")
							{
								that.ajax.fillClose();
							}
							that.ajax.error();
						}
					}
				};

				if (data)
				{
					for (var p in data)
					{
						url = addURLParam(url, p, data[p]);
					}
				}
				
				xhr.open(type, url, true);
				if (that.ajax.beforeSend && typeof(that.ajax.beforeSend) == "function")
				{
					that.ajax.beforeSend();
				}

				xhr.send(null);
			}
			else
			{
				var data = [];
				for (var i = 0; i < that.data.length; i++)
				{
					if (that.data[i].text && that.data[i].text.indexOf(that.inputTxt.value) != -1)
					{
						data.push(that.data[i]);
					}
				}
			}
		});
	};

	//对url添加查询字符串
	function addURLParam(url, name, value)
	{
		url += (url.indexOf("?") == -1 ? "?" : "&");
		url += encodeURIComponent(name) + "=" + encodeURIComponent(value);

		return url;
	}

	// 解析不同的内容类型
	// 只解析html, XML, json
	// 默认为html
	function parseContent(xhr, type)
	{
		var result = null;

		switch (type)
		{
			case "json":
				result = JSON.parse(xhr.responseText);
				break;
			case "xml":
				result = xhr.responseXML;
				break;
			default:
				result = xhr.responseText;
				break;
		}

		return result;
	}

	function renderSelect(thatObj, data)
	{
		while (thatObj.ul.hasChildNodes())
		{
			thatObj.ul.removeChild(thatObj.ul.firstChild);
		}

		if (data.length > 0)
		{
			for (var i = 0; i < data.length; i++)
			{
				var li = document.createElement("li");

				li.setAttribute("data-bx-value", data[i].value);
				li.innerHTML = data[i].text;

				thatObj.ul.appendChild(li);
			}
			thatObj.listDiv.style.display = "";
		}
		
	}

	return bxSelect;
})();
