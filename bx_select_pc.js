"use strict";

"version: 0.0.1";
var BxSelect = (function()
{
	var bxSelect = function (config)
	{
		this.element = config.element;
		this.data = config.data;
		this.ajax = config.ajax;
		//bxValue-控件的值, bxText-控件的文本显示值
		this.bxValue = [];
		this.bxText = [];
		
		this.selectedChanged = config.selectedChanged;
		//对宿主元素设置默认的bx-data-value为空字符串
		this.element.setAttribute("bx-data-value", "");
		

		// 宿主元素的坐标和尺寸
		var targetLeft = this.element.offsetLeft;
		var targetTop = this.element.offsetTop;
		var targetWidth = this.element.clientWidth;
		var targetHeight = this.element.offsetHeight;

		this.element.style.display = "none";

		//设置divWrapper为绝对定位
		this.divWrapper = document.createElement("div");
		this.divWrapper.className = "bx-select-wrapper";
		var wrapperCss = "background-color: white; width:" + targetWidth + "px; position: relative;";
		this.divWrapper.style.cssText = wrapperCss; 

		//this.element.parentNode.appendChild(this.divWrapper);

		insertAfter(this.divWrapper, this.element);
		//document.body.appendChild(this.divWrapper);

		this.buttonDiv = document.createElement("div"); //放置多选选项的容器
		this.buttonUl = document.createElement("ul");
		this.buttonUl.className = "bx-button-ul";
		var buttonUlCss = "padding: 0 5px 0 0; position: relative; border: 1px solid #aaa; cursor: text; min-height: 26px;margin: 0; overflow: hidden; "
		this.buttonUl.style.cssText = buttonUlCss;

		this.inputLi = document.createElement("li");
		//var inputLiCss = "padding: 3px 5px 3px 18px; margin: 3px 0 3px 5px; position: relative; line-height: 13px; color: #333; border: 1px solid #aaaaaa; border-radius: 3px;";
		var inputLiCss = "margin: 0; padding: 0; white-space: nowrap;";
		this.inputLi.style.cssText = inputLiCss;
		this.lastInput = document.createElement("input"); //输入框
		this.lastInput.type = "text";
		var lastInputCss = "padding: 5px; margin: 1px 0; outline: 0; border: 0; background: transparent !important;";
		this.lastInput.style.cssText = lastInputCss;

		this.buttonDiv.appendChild(this.buttonUl);
		this.inputLi.appendChild(this.lastInput);
		this.buttonUl.appendChild(this.inputLi);
		this.divWrapper.appendChild(this.buttonDiv);

		this.listDiv = document.createElement("div");
		this.listDiv.className = "bx-select-list";
		var listDivCss = 
			"width:" + targetWidth + "px; position: absolute; top: " + this.buttonDiv.clientHeight + "px; min-height: 150px;";
		this.listDiv.style.cssText = listDivCss;
		this.divWrapper.appendChild(this.listDiv);

		//this.divWrapper.style.display = "none";
		this.listDiv.style.display = "none";

		this.listUl = document.createElement("ul");
		this.listUl.className = "bx-select-ul";
		this.listDiv.appendChild(this.listUl);

		this.doingEvents();

		renderSelect(this, this.data);
		
		//初始化selectedData，默认选中的项
		if (config.selectedData && config.selectedData.length > 0)
		{
			for (var i = 0; i < config.selectedData.length; i++)
			{
				appendItem(this, config.selectedData[i]);
			}
		}
	}

	//处理事件
	bxSelect.prototype.doingEvents = function ()
	{	
		var that = this;

		that.buttonDiv.addEventListener("click", function (event)
		{
			renderSelect(that, that.data);
			that.listDiv.style.cssText += "top: " + that.buttonDiv.clientHeight;
			that.listDiv.style.display = "";
			that.lastInput.focus();
			event.stopPropagation();
		});

		//window单击，关闭列表显示
		window.addEventListener("click", function (event)
		{
			that.listDiv.style.display = "none";
		});
		
		//处理列表项选择事件
		that.listUl.addEventListener("click", function (event)
		{
			if (event.target !== event.currentTarget)
			{
				var oldText = that.element.value;
				var oldValue = that.element.getAttribute("data-bx-value");

				var value = event.target.getAttribute("data-bx-value");
				var text = event.target.innerHTML;

				//如果当前单击的项没有被选择，则添加。
				if (that.bxValue.indexOf(value) == -1)
				{
					that.element.setAttribute("data-bx-value", that.bxValue.join(","));// 对宿主元素进行赋值

					appendItem(that, { text: text, value: value });
					if (that.selectedChanged)
					{
						//触发selectedChanged事件
						that.selectedChanged({
							type: "add",
							changedItem: { text: text, value: value }
						});
					}
				}
			}
			that.listDiv.style.display = "none";
		});

		that.lastInput.addEventListener("keyup", function (event)
		{
			if (event.keyCode == 13) //回车键
			{
				if (that.ajax && typeof(that.ajax) == "object")
				{
					//处理data
					var data = (that.ajax.data && typeof( that.ajax.data) == "function") ? 
						that.ajax.data(that.lastInput.value) : null;
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
									that.ajax.fillClose(that);
								}
							}
							else
							{
								// 执行填充完数据的回调
								if (that.ajax.fillClose && typeof(that.ajax.fillClose) == "function")
								{
									that.ajax.fillClose(that);
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
				} // if (that.ajax && typeof(that.ajax) == "object") ..end
				else
				{
					var data = [];
					for (var i = 0; i < that.data.length; i++)
					{
						if (that.data[i].text && that.data[i].text.indexOf(that.lastInput.value) != -1)
						{
							data.push(that.data[i]);
						}
					}
					renderSelect(that, data);
				} // if (that.ajax && typeof(that.ajax) == "object") .. end
			} // if (event.keyCode == 13) .. end
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

	function deleteItem(event)
	{
		var value = event.currentTarget.getAttribute("data-bx-x");
		var index = bxSelect.bxValue.indexOf(value);
		if (index != -1)
		{
			bxSelect.splice(index, 1);
			bxSelect.splice(index, 1);
			event.currentTarget.parentNode.remove();
		}
	}

	//渲染数据
	function renderSelect(thatObj, data)
	{
		while (thatObj.listUl.hasChildNodes())
		{
			thatObj.listUl.removeChild(thatObj.listUl.firstChild);
		}

		if (data.length > 0)
		{
			for (var i = 0; i < data.length; i++)
			{
				var li = document.createElement("li");

				li.setAttribute("data-bx-value", data[i].value);
				li.innerHTML = data[i].text;

				thatObj.listUl.appendChild(li);
			}
			thatObj.listDiv.style.display = "";
		}
		
	}

	// 追加一个选项
	// param thatObj bxSelect对象
	// obj 添加的项元素{ text: .., value: .. }
	function appendItem (thatObj, obj)
	{
		thatObj.bxValue.push(obj.value);
		thatObj.bxText.push(obj.text);
		thatObj.element.setAttribute("data-bx-value", thatObj.bxValue.join(","));// 对宿主元素进行赋值
		
		
		var li = document.createElement("li");
		var liCss = "padding: 3px 5px 3px 5px; margin: 3px 0 3px 5px; position: relative; line-height: 13px; color: #333; cursor: default; border: 1px solid #aaaaaa;"
			+ "border-radius: 3px; background-color: #e4e4e4; max-width: 100px;";
		li.style.cssText = liCss;

		var span = document.createElement("span");
		span.innerHTML = obj.text;
		var spanCss = "word-break: break-all; max-width: 80px; line-height: 20px; display: block; ";
		span.style.cssText = spanCss;

		var a = document.createElement("a");
		a.innerHTML = "x";
		var aCss = "display: block; width: 12px; height: 13px; position: absolute; right: 3px; top: 4px; font-size: 12px; outline: none;";
		a.style.cssText = aCss;
		a.setAttribute("data-bx-x", obj.value);
		// 删除已选项事件,移除bxValue, bxText中对应值,移除a所在li
		a.addEventListener('click', function (event)
		{
			var value = event.currentTarget.getAttribute("data-bx-x");
			var index = thatObj.bxValue.indexOf(obj.value);
			if (index != -1)
			{
				var text = thatObj.bxText[index];
				var value = thatObj.bxValue[index];
				
				thatObj.bxValue.splice(index, 1);
				thatObj.bxText.splice(index, 1);

				thatObj.element.setAttribute("data-bx-value", thatObj.bxValue.join(","));
				event.currentTarget.parentNode.remove();
				// 触发selectedChanged事件
				if (thatObj.selectedChanged)
				{
					thatObj.selectedChanged({
						type: "delete",
						changedItem: { text: text, value: value }			
					});
				}
			}		
		});	

		li.appendChild(span);
		li.appendChild(a);
		thatObj.buttonUl.insertBefore(li, thatObj.inputLi);
	}

	//接受一个[ {text: .., value}, .. ]形式的数组，用于初始化选中的值
	function initSelected (thatObj, data)
	{
		for (var i = 0; i < data.length; i++)
		{
			thatObj.bxValue.push(data[i].value);
			thatObj.bxText.push(data[i].text);

			appendItem(thatObj, { text: data[i].text, value: data[i].value });
		}
	};

	//在一个元素之后追加内容
	function insertAfter(newElement, targetElement)
	{
		var parentNode = targetElement.parentNode;
		var nodes = parentNode.childNodes;

		for (var i = 0; i < nodes.length; i++)
		{
			if (nodes[i] == targetElement)
				break;
		}

		//如果当前元素后面还有元素，在新插入的元素前插入一个空格字符元素
		if (nodes[i + 1])
		{
			parentNode.insertBefore(newElement, nodes[i + 1]);

			var textNode = document.createTextNode(" ");
			parentNode.insertBefore(textNode, newElement);
		}
		else
		{
			parentNode.appendChild(newElement);
		}
	}

	return bxSelect;
})();
