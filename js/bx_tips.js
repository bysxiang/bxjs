"use strict";

function BxTips(config)
{
	var element = config.element;
	var time = config.time == undefined ? 2 : config.time ;
	var origin = config.origin || "right";
	var content = config.content;
	var borderWidth = 0.25;

	var fontSize = 20 * document.documentElement.clientWidth / 320;
	
	if (element)
	{
		//宿主元素的坐标、宽和高
		var targetLeft = element.offsetLeft / fontSize;
		var targetTop = element.offsetTop / fontSize;
		var targetWidth = element.offsetWidth / fontSize;
		var targetHeight = element.offsetHeight / fontSize;
		var targetParent = element.parentNode;

		var wrapDiv = document.createElement("div");
		var wrapCssText = "max-width: 80%; position: absolute; background-color: #ff3300; color: white;" + 
		"padding: " + (targetHeight / 8) + "rem; border-radius: 3px; font-size: 0.7rem;";
		wrapDiv.style.cssText = wrapCssText;

		var contentSpan = document.createElement("span");
		contentSpan.innerHTML = content;

		wrapDiv.appendChild(contentSpan);
		targetParent.appendChild(wrapDiv);

		var wrapDivWidth = wrapDiv.offsetWidth / fontSize;
		var wrapDivHeight = wrapDiv.offsetHeight / fontSize;

		//switch代码根据方向不同，确定borderDiv的left, top, borderColor的值
		switch (origin)
		{
			case "left":
				var leftVal = wrapDivWidth;
				var topVal = targetHeight / 3;
				var borderColor = "transparent transparent transparent #ff3300";
				break;
			case "right": 
				var leftVal = -borderWidth * 2 + targetHeight / 8;
				var topVal = targetHeight / 3;
				var borderColor = "transparent #ff3300 #ff3300 transparent";
				break;
			case "top":
				var leftVal = wrapDivWidth  / 2;
				var topVal = wrapDivHeight;
				var borderColor = "#ff3300 transparent transparent transparent";
				break;
			case "bottom":
				var leftVal = wrapDivWidth / 2;
				var topVal = -borderWidth * 2;
				var borderColor = "transparent transparent #ff3300 transparent";
				break;
			default: 
				break;	
		}
		
		var borderDiv = document.createElement("div");
		var borderCssDiv = "width: 0; height: 0; border-width:" + borderWidth + "rem;" +
		 " border-style: solid; " + 
		" position: absolute; " +
		" border-color: " + borderColor + ";" + 
		"left: " + leftVal + "rem; top: " + topVal + "rem;";
		borderDiv.style.cssText = borderCssDiv;
		wrapDiv.appendChild(borderDiv);

		//根据不同方向，设置wrapDiv的left, top值
		switch (origin)
		{
			case "left":
				var wrapDivLeft = targetLeft - wrapDivWidth - borderWidth;
				var wrapDivTop = targetTop;
				break;
			case "right": 
				var wrapDivLeft = targetLeft + targetWidth + borderWidth;
				var wrapDivTop = targetTop;
				break;
			case "top":
				var wrapDivLeft = targetLeft +  (targetWidth - wrapDivWidth) / 2;
				var wrapDivTop = targetTop - wrapDivHeight - borderWidth;
				break;
			case "bottom":
				var wrapDivLeft = targetLeft +  (targetWidth - wrapDivWidth) / 2;
				var wrapDivTop = targetTop + targetHeight + borderWidth;
				break;
			default: 
				break;	
		}
		wrapDiv.style.left = wrapDivLeft + "rem";
		wrapDiv.style.top = wrapDivTop + "rem";

		if (time != 0)
		{
			window.setTimeout(function (){
			 	targetParent.removeChild(wrapDiv);
			}, time * 1000);
		}
	}
	else
	{
		throw new Error("宿主元素不存在");
	}
}

