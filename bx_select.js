"use strict";

function BxSelect(config)
{
	var element = config.element;
	var time = config.time || 400;
	var zIndex = config.zIndex || 50;

	//宿主元素坐标，宽高
	var elementLeft = element.offsetLeft;
	var elementTop = element.offsetTop;
	var elementWidth = element.clientWidth;
	var elementHeight = element.offsetHeight;
	var elementParent = element.parentNode;

	var width = document.documentElement.clientWidth;

	var divWrapper = document.createElement("div");
	divWrapper.className = "bx-select-wrapper";
	var divWrapperCss = " position: absolute; left: 0; top: 0; z-index: " + zIndex + 
		"; width: 100%; height: 100%; background-color: white; margin: 0 auto;";
	divWrapper.style.cssText = divWrapperCss;

	var inputDiv = document.createElement("div");
	inputDiv.className = "bx-select-input";
	divWrapper.appendChild(inputDiv);

	var inputX = document.createElement("input");
	var inputXCss = "width: 20px; height: 20px;";
	inputX.style.cssText = inputXCss;
	inputX.type = "button";
	inputX.value = "X";

	inputDiv.appendChild(inputX);

	var inputTxt = document.createElement("input");
	var inputTxtCss = "width: " + (width * 0.7) + "px;";
	inputTxt.style.cssText = inputTxtCss;
	inputTxt.type = "text";
	inputDiv.appendChild(inputTxt);

	document.body.appendChild(divWrapper);

	var targetLeft = inputTxt.offsetLeft;
	var targetTop = inputTxt.offsetTop;
	var targetWidth = inputTxt.offsetWidth;
	var targetHeight = inputTxt.offsetHeight;

	var listDiv = document.createElement("div");
	var listDivCss = "position: absolute; left: " + targetLeft + "; top: " + (targetTop + targetHeight) + 
		"; width: " + targetWidth + "; max-height: 400px;; overflow: auto; border: 1px solid #ccc;";
	listDiv.style.cssText = listDivCss;
	divWrapper.appendChild(listDiv);

	divWrapper.style.display = "none";

	element.addEventListener("focus", function (event)
	{
		divWrapper.style.display = "";
	});

	element.addEventListener("keyup", function (event)
	{

	});

	var ul = document.createElement("ul");
	ul.style.listStyle = "none";
	ul.className = "bx-select-ul";
	for (var i = 0; i < 100; i++)
	{
		var li = document.createElement("li");
		li.innerHTML = "java" + (++i);
		li.style.listStyle = "none";
		li.style.borderBottom = "1px solid #dedede";
		li.style.padding = "5";
		ul.appendChild(li);
	}
	listDiv.appendChild(ul);

	ul.addEventListener("click", function (event)
		{
			if (event.target !== event.currentTarget)
			{
				element.value = event.target.innerHTML;
				
			}
			divWrapper.style.display = "none";
		});
}