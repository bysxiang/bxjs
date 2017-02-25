"use strict";

var Ybs = {
    Ui: {
        
    }
};

Ybs.Ui.MultiSelectQuantity = (function ()
{
	var select = function (config)
	{
		this.element = config.element;
		this.leftUl = buildLeftUl();
		this.leftDiv = buildLeftDiv(this.leftUl);
		
		this.rightUl = buildRightUl();
		this.rightDiv = buildRightDiv(this.rightUl);
		
		this.leftBtn = buildLeftBtn();
		this.rightBtn = buildRightBtn();
		this.middleDiv = buildMiddleDiv(this.leftBtn, this.rightBtn);
		
		this.wrapperDiv = buildWrapperDiv(this.leftDiv, this.middleDiv, this.rightDiv);
		this.element.parentNode.appendChild(this.wrapperDiv);
		
		this.timeOut = 0;
		this.loading = false;
		this.charLength = config.charLength || 3;
		this.delay = config.delay || 500;
		
		this.ajaxConfig = config.ajax;
		// selectedItems 是一个对象数组，它包括 text, value, quantity
		this.selectedItems = config.selectedItems || [];

		if (this.selectedItems.length > 0)
		{
			fillSelecteds(this.rightUl, this.selectedItems);
		}
		
		doEvents(this);
		
		this.version = "0.1.0";
	};

	select.prototype.selectedValues = function () 
	{
		var values = [];
		for (var i = 0; i < this.rightUl.children.length; i++)
		{
			var li = this.rightUl.children[i];
			var item = {
				value: li.dataset.liValue,
				text: li.dataset.liText,
				quantity: parseInt(li.dataset.liQuantity)
			};
			
			values.push(item);
		}

		return values;
	};
	
	function doEvents(that)
	{
		that.leftUl.addEventListener('click', function (event) {
			if (event.currentTarget != event.target)
			{
				if (event.target.dataset.liValue != 0)
				{
					var text = event.target.dataset.liText;
					var value = event.target.dataset.liValue;
					
					appendItemAndQuantity(that.rightUl, value, text, 1);
					event.target.remove();
					that.selectedItems.push({ value: event.target.dataset.liValue, 
						text: event.target.dataset.liText, quantity: 1 });
				}
			}
		}, false);
		
		that.rightUl.addEventListener('click', function (event) {
			if (event.currentTarget != event.target && event.target.tagName != "INPUT")
			{
				var li = event.target.parentNode;
				if (li.dataset.liValue != 0)
				{
					var text = li.dataset.liText;
					var value = li.dataset.liValue;
					
					appendItem(that.leftUl, value, text);
					li.remove();
					removeByValue(that.selectedItems, li.dataset.liValue);
				}
			}
		}, false);
		
		that.element.addEventListener('keyup', function (event) {
			var val = event.currentTarget.value;
			
			console.log("顶部val:" + val);
			if (val.length >= that.charLength && that.loading == false)
			{
				window.clearTimeout(that.timeOut);
				that.timeOut = window.setTimeout(function () {
					var xhr = new XMLHttpRequest();
					xhr.onreadystatechange = function ()
					{
						if (xhr.readyState == 4)
						{
							if (xhr.status == 200)
							{
								var result = that.ajaxConfig.results(JSON.parse(xhr.responseText));
								while (that.leftUl.hasChildNodes())
								{
									that.leftUl.removeChild(that.leftUl.firstChild);
								}
								
								for (var i = 0; i < result.length; i++)
								{
									if (existItem(that.rightUl, result[i].text) == false)
									{
										appendItem(that.leftUl, result[i].value, result[i].text);
									}
								}
							}
							else
							{
								if (that.ajaxConfig.error && typeof that.ajaxConfig.erorr == "function")
								{
									that.ajaxConfig.error(xhr);
								}
							}
							
							that.loading = false;
						}
					}; // onready .. end
					
					var url = that.ajaxConfig.url;
					if (that.ajaxConfig.data)
					{
						console.log("val:" + val);
						console.log("that.element.val : " + that.element.value);
						var data  = (that.ajaxConfig.data && typeof that.ajaxConfig.data == "function") ?
							that.ajaxConfig.data(val) : [];
						
						for (var p in data) 
						{
							url = addURLParam(url, p, data[p]);
						}
					}
					
					xhr.open('get', url, true);
					xhr.send(null);
					that.loading = true;
					prependItem(that.leftUl, 0, '加载中');
					
				}, that.delay);
			}
			else if (that.loading == false)
			{
				window.clearTimeout(that.timeOut);
			}
		}, false);
		
		// 删除所有项
		that.leftBtn.addEventListener('click', function (event){
			if (that.loading == false)
			{
				while (that.rightUl.hasChildNodes())
				{
					var currentLi = that.rightUl.firstChild;
					
					appendItem(that.leftUl, currentLi.dataset.liValue, currentLi.dataset.liText);
					currentLi.remove();
				}
				that.selectedItems = [];
			}
		}, false);
		
		that.rightBtn.addEventListener('click', function (event) {
			if (that.loading == false)
			{
				while (that.leftUl.hasChildNodes())
				{
					var currentLi = that.leftUl.firstChild;
					
					var text = currentLi.dataset.liText;
					var value = currentLi.dataset.liValue;
					
					appendItemAndQuantity(that.rightUl, value, text, 1);
					currentLi.remove();
					
					that.selectedItems.push({ value: value, 
						text: text,
						quantity: 1
					});
				}
			}
		}, false);
	}
	
	function buildLeftUl()
	{
		var ul = document.createElement("ul");
		
		return ul;
	}
	
	function buildLeftDiv(leftUl)
	{
		var div = document.createElement("div");
		div.className = "multi-left-div";
		div.appendChild(leftUl);
		
		return div;
	}
	
	function buildLeftBtn()
	{
		var inputBtn = document.createElement("input");
		inputBtn.type = "button";
		inputBtn.value = "<<";
		inputBtn.style.cssText = "display:block; margin: 25px auto;";
		
		return inputBtn;
	}
	
	function buildRightBtn()
	{
		var inputBtn = document.createElement("input");
		inputBtn.type = "button";
		inputBtn.value = ">>";
		inputBtn.style.cssText = "display:block; margin: 25px auto;";
		
		return inputBtn;
	}
	
	
	function buildMiddleDiv(leftBtn, rightBtn)
	{
		var div = document.createElement("div");
		div.className = "multi-middle-div";
		div.appendChild(leftBtn);
		div.appendChild(rightBtn);
		
		return div;
	}
	
	function buildRightUl()
	{
		var ul = document.createElement("ul");
		
		return ul;
	}
	
	function buildRightDiv(rightUl)
	{
		var div = document.createElement("div");
		div.className = "multi-right-div";
		div.appendChild(rightUl);
		
		return div;
	}
	
	function buildWrapperDiv(leftDiv, middleDiv, rightDiv)
	{
		var div = document.createElement("div");
		div.className = "multi-wrapper-div";
		
		div.appendChild(leftDiv);
		div.appendChild(middleDiv);
		div.appendChild(rightDiv);
		
		return div;
	}
	
	function appendItem(ul, value, text)
	{
		var li = document.createElement("li");
		li.innerHTML = text;
		
		li.dataset.liValue = value;
		li.dataset.liText = text;
		
		ul.appendChild(li);
	}
	
	function appendItemAndQuantity(ul, value, text, quantity)
	{
		var li = document.createElement("li");
		li.dataset.liValue = value;
		li.dataset.liText = text;
		li.dataset.liQuantity = quantity;
		
		var span = document.createElement("span");
		span.innerHTML = text;
		
		var input = document.createElement("input");
		input.type = "number";
		input.min = 1;
		input.max = 20;
		input.value = quantity;
		input.addEventListener('change', changedQuantityEvent, false);
	
		li.appendChild(span);
		li.appendChild(input);
		
		ul.appendChild(li);
	}
	
	function prependItem(ul, value, text)
	{
		var li = document.createElement("li");
		li.innerHTML = text;
		li.dataset.liValue = value;
		li.dataset.liText = text;
		
		ul.insertBefore(li, ul.firstChild);
	}
	
	function existItem(ul, text)
	{
		var exist = false;
		for (var i = 0; i < ul.children.length; i++)
		{
			if (ul.children[i].innerHTML == text)
			{
				exist = true;
			}
		}
		
		return exist;
	}
	
	function changedQuantityEvent(event)
	{
		event.currentTarget.parentNode.dataset.liQuantity = event.currentTarget.value;
	}
	
	//对url添加查询字符串
    function addURLParam(url, name, value)
    {
        url += (url.indexOf("?") == -1 ? "?" : "&");
        url += encodeURIComponent(name) + "=" + encodeURIComponent(value);

        return url;
    }
    
    function fillSelecteds(ul, data)
    {
    	while (ul.hasChildNodes())
    	{
    		ul.removeChild(ul.firstChild);
    	}
    	
    	for (var i = 0; i < data.length; i++)
    	{
    		appendItemAndQuantity(ul, data[i].value, data[i].text, data[i].quantity);
    	}
    }

    function removeByValue(arr, value)
    {
    	for (var i = 0; i < arr.length; i++)
    	{
    		if (arr[i].value == value)
    		{
    			arr.splice(i, 1);
    		}
    	}
    }
	
	return select;
})();
