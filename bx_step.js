"use strict";

var BxStep = (function () {
	//构造函数
	//elementsArr，代表各个层对象，
	var bxStep = function (elementsArr, str)
	{
		this.elements = elementsArr; 
		var _events = { "showIndexChanged": null };
		
		this.getEvents = function ()
		{
			return _events;
		};

		this.addEvent = function (type, callback)
		{
			_events[type] = callback;
		};

		this.removeEvent = function (type)
		{
			_events[type] = null;
		};
	};

	//显示指定的对象层，如果没有找到，会抛出Error异常
	bxStep.prototype.showIndex = function(index)
	{
		//如果index存在，隐藏其他的元素
		if (this.elements[index] && this.getShowIndex() != index)
		{
			this.elements[index].style.display = "";
			for (var i = 0; i < this.elements.length; i++)
			{
				if (i != index && this.elements[i])
				{
					this.elements[i].style.display = "none";
				}
			}
			trigger("showIndexChanged", this.getEvents());
		}
		else if (this.elements[index] && this.getShowIndex() == index)
		{
			return false;
		}
		else
		{
			throw new Error("没有那个元素");
		}
	};

	//隐藏指定层
	bxStep.prototype.hideIndex = function(index)
	{
		if (this.elements[index])
		{
			this.elements[index].style.display = "none";
		}
		else
		{
			throw new Error("没有那个元素");
		}
	};

	//获取当前显示的层对象
	bxStep.prototype.getShowElement = function()
	{
		for (var i = 0; i < this.elements.length; i++)
		{
			if (this.elements[i] && this.elements[i].style.display != "none")
			{
				return this.elements[i];
			}
		}

		return null;
	};

	//获取当前显示层索引
	bxStep.prototype.getShowIndex = function()
	{
		for (var i = 0; i < this.elements.length; i++)
		{
			if (this.elements[i] && this.elements[i].style.display != "none")
			{
				return i;
			}
		}

		return -1;
	};

	//隐藏全部的层
	bxStep.prototype.hideAll = function()
	{
		for (var i = 0; i < this.elements.length; i++)
		{
			if (this.elements[i])
			{
				this.elements[i].style.display = "none";
			}
		}
	};

	//添加一个层对象
	bxStep.prototype.add = function(element, index)
	{
		if (isNaN(index))
		{
			this.elements.push(element);
		}
		else if (index >= 0 && index <= this.elements.length)
		{
			this.elements.splice(index, 0, element);
		}
		else
		{
			throw new Error("index如果提供值，必须大于等于0且不能大于数组长度");
		}
	};

	//删除一个指定索引的层对象
	bxStep.prototype.removeIndex = function(index)
	{
		if (this.elements[index])
		{
			this.elements.splice(index, 1);
		}
		else
		{
			throw new Error("指定索引不存在");
		}
	};

	//删除一个层对象
	//element为null，抛出ReferenceError异常，如果element不存在，抛出Error异常
	bxStep.prototype.removeElement = function(element)
	{
		if (element)
		{
			var isDelete = false;

			for (var i = 0; i < this.elements.length; i++)
			{
				if (this.elements[i] == element)
				{
					isDelete = true;
					this.elements.splice(i, 1);
				}
			}
			if (!isDelete)
			{
				throw new Error("并不存在element对应的层对象");
			}
		}
		else
		{
			throw new ReferenceError("element不能为null");
		}
	};

	//事件相关的部分

	function trigger(type, events)
	{
		if (events[type])
		{
			events[type]();
		}
	}

	//替换对象，放到下一版



	return bxStep;
})();