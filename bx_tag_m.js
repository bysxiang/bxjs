"use strict";

"version: 0.0.1";

var BxTagM = (function ()
{
	var bxTagM = function (config)
	{
		this.labelArray = [];
		this.labelMaxLength = config.labelMaxLength || 3;

		this.wrapperDiv = config.containerDiv;
		this.inputDiv = buildInputDiv(this);
		this.clearDiv = buildClearDiv();

		this.wrapperDiv.appendChild(this.inputDiv);
		this.wrapperDiv.appendChild(this.clearDiv);
		document.body.appendChild(this.wrapperDiv);

		initLabels(this, config.labelArray);

		this.addTagEvent = config.addTagHandle;
		this.removeTagEvent = config.removeTagHandle;
	};

	function buildInputDiv(outerObj)
	{
		// 输入div框
		var inputDiv = document.createElement("div");
		var inputDivStyle = "float: left;";
		inputDiv.style.cssText = inputDivStyle;

		var inputTxt = document.createElement("input");
		inputTxt.type = "text";
		var inputTxtStyle = "color: rgb(102, 102, 102); width: 3.4rem; margin: 0px; font-family: helvetica; font-size: 0.65rem; border: 1px solid transparent";
		inputTxtStyle += "padding: 5px; background: transparent; outline: 0px; margin-right: 5px; margin-bottom: 5px;";
		inputTxt.style.cssText = inputTxtStyle;

		inputTxt.addEventListener("keyup", function (event)
		{
			var val = event.currentTarget.value.trim();

			if (event.keyCode == 13)
			{
				if (val != "")
				{
					if (outerObj.labelArray.indexOf(val) == -1 && outerObj.labelArray.length < outerObj.labelMaxLength )
					{
						outerObj.labelArray.push(val);
						addTag(outerObj, val);
						event.currentTarget.value = "";
					}
				}
			}
		}, false);

		inputDiv.appendChild(inputTxt);

		return inputDiv;
	}

	function buildClearDiv()
	{
		var clearDiv = document.createElement("div");
		var clearDivStyle = "clear: both;";
		clearDiv.style.cssText = clearDivStyle;

		return clearDiv;
	}

	function initLabels(outerObj, labelArray)
	{
		for (var i = 0; i < labelArray.length; i++)
		{
			if (outerObj.labelArray.indexOf(labelArray[i]) == -1)
			{
				addTag(outerObj, labelArray[i]);
			}
		}
	}

	function addTag(outerObj, labelName)
	{
		var span = document.createElement("span");
		var spanStyle = "border: 1px solid #a5d24a;-moz-border-radius: 2px;-webkit-border-radius: 2px;display: block;float: left;padding: 5px;text-decoration: none;";
		spanStyle += "background: #cde69c; color: #638421; margin-right: 5px; margin-bottom: 5px; font-family: helvetica;font-size: 0.65rem;" 
		span.style.cssText = spanStyle;

	    var innerSpan = document.createElement("span");
	    innerSpan.innerHTML = labelName;
	    var innerSpanStyle = "color: rgb(99, 132, 33); font-size: 13px; font-family: heivetica;"
	    innerSpan.style.cssText = innerSpanStyle;

	    var innerA = document.createElement("a");
	    var innerAStyle = "font-weight: bold;color: #82ad2b;text-decoration: none; font-size: 0.55rem; padding-left: 0.5em;";
	    innerA.style.cssText = innerAStyle;
	    innerA.href = "#";
	    innerA.innerHTML = "X";
	    innerA.addEventListener("click", function (event)
    	{
    		var val = event.currentTarget.value;
    		var index = outerObj.labelArray.indexOf(val);
    		outerObj.labelArray.splice(index, 1);

			event.currentTarget.parentNode.remove();
			if (outerObj.removeTagEvent && typeof outerObj.removeTagEvent == "function")
			{
				outerObj.removeTagEvent(outerObj);
			};
    	}, false);

	    span.appendChild(innerSpan);
	    span.appendChild(innerA);

	    outerObj.wrapperDiv.insertBefore(span, outerObj.inputDiv);
	    outerObj.labelArray.push(labelName);
	    if (outerObj.addTagEvent && typeof outerObj.addTagEvent == "function")
	    {
	    	outerObj.addTagEvent(outerObj);
	    }
	}

	return bxTagM;
})();