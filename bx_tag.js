"use strict";

"version: 0.0.1";

var BxTag = (function ()
{
	// 构造函数
	var bxTag = function (config)
	{
		this.labelArray = [];
		this.labelMaxLength = config.labelMaxLength || 3;

		this.wrapperDiv = config.containerDiv;
		this.inputDiv = buildInputDiv(this);

		this.wrapperDiv.appendChild(this.inputDiv);
		document.body.appendChild(this.wrapperDiv);

		initLabels(this, config.labelArray);

		this.addTagEvent = config.addTagHandle;
		this.removeTagEvent = config.removeTagHandle;
	};	

	function buildWrapperDiv(wrapperDiv)
	{
		wrapperDiv.className = "bx_tag_wrapper";

		return divWrapper;
	}

	function buildInputDiv(outerObj)
	{
		// 输入div框
		var inputDiv = document.createElement("div");
		inputDiv.className = "bx_tag_input_div";

		var inputTxt = document.createElement("input");
		inputTxt.type = "text";

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
		span.className = "bx_tag_outer_span";

	    var innerSpan = document.createElement("span");
	    innerSpan.innerHTML = labelName;

	    var innerA = document.createElement("a");
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

	return bxTag;

})();