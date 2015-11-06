"use strict";

var BxSelect = (function()
{
	var bxSelect = function (config)
	{
		this.element = config.element;
		this.time = config.time || 1000;
		this.zIndex = config.zIndex || 50;
		this.data = config.data || [];
		this.ajax = config.ajax;

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

		document.body.appendChild(this.divWrapper);

		var targetLeft = this.inputTxt.offsetLeft;
		var targetTop = this.inputTxt.offsetTop;
		var targetWidth = this.inputTxt.offsetWidth;
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
		if (!this.ajax)
		{
			this.fillData(this.data);
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
		});

		that.element.addEventListener("keyup", function (event)
		{

		});
		
		//处理列表项选择事件
		that.ul.addEventListener("click", function (event)
		{
			if (event.target !== event.currentTarget)
			{
				that.element.value = event.target.innerHTML;
				that.element.setAttribute("data-bx-value", event.target.getAttribute("data-bx-value"));
				if (that.success && typeof(that.success == "function")
				{
					that.success({text: event.target.innerHTML, value: event.target.getAttribute("data-bx-value")});
				}
			}
			that.divWrapper.style.display = "none";
		});

		//处理关闭列表事件
		that.inputX.addEventListener("click", function (event)
		{
			that.divWrapper.style.display = "none";
		});

		that.inputTxt.addEventListener("change", function (event)
		{
			//指定time事件后向ajax请求数据
			if (that.ajax && typeof(that.ajax) == "object" && event.target.value)
			{
				var xhr = new XMLHttpRequest();
				//处理ajax返回的数据
				xhr.onreadystatechange = function ()
				{
					if (xhr.readyState == 4)
					{
						if (xhr.status == 200)
						{
							if (that.ajax.dataType == "json")
							{
								var data = that.ajax.success(xhr.responseText);
								that.fillData(data);
							}
						}
						else
						{
							that.ajax.error(xhr.responseText);
						}
					}
				};

				//处理data
				var data = (that.ajax.data && typeof( that.ajax.data) == "function") ? 
					that.ajax.data(event.target.value) : null;
				var type = that.ajax.type || "get";
				var url = that.ajax.url;
				if (data)
				{
					for (var p in data)
					{
						url = addURLParam(url, p, data[p]);
					}
				}
				
				xhr.open(type, url, true);
				xhr.send(null);
			}
					
		});
	};

	function addURLParam(url, name, value)
	{
		url += (url.indexOf("?") == -1 ? "?" : "&");
		url += encodeURIComponent(name) + "=" + encodeURIComponent(value);

		return url;
	}

	bxSelect.prototype.fillData = function (data)
	{
		this.data = data;
		while (this.ul.hasChildNodes())
		{
			this.ul.removeChild(this.ul.firstChild);
		}

		for (var i = 0; i < this.data.length; i++)
		{
			var li = document.createElement("li");

			li.setAttribute("data-bx-value", this.data[i].value);
			li.innerHTML = this.data[i].text;

			this.ul.appendChild(li);
		}
		this.listDiv.style.display = "";
	};

	return bxSelect;
})();
