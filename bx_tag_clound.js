"use strict";

"version: 0.0.1";

var BxTagClound = (function ()
{
	var bxTagClound = function (config)
	{
		this.labelArray = config.labelArray || [];
		this.containerDiv = config.containerDiv;
		this.tagClick = config.tagClick;
		this.clearSpan = buildClearSpan();
		this.containerDiv.appendChild(this.clearSpan);

		initLabels(this, this.labelArray);
	};

	function initLabels(outerObj, labelArray)
	{
		for (var i = 0; i < labelArray.length; i++)
		{
			addTag(outerObj, labelArray[i]);
		}
	}

	function buildClearSpan()
	{
		var clearSpan = document.createElement("span");
		var clearSpanStyle = "clear: both;";
		clearSpan.style.cssText = clearSpanStyle;

		return clearSpan;
	}

	function addTag(outerObj, labelName)
	{
		var span = document.createElement("span");
		var spanStyle = "border: 1px solid #a5d24a;-moz-border-radius: 2px;-webkit-border-radius: 2px;display: block;float: left;padding: 5px;text-decoration: none;";
		spanStyle += "background: #cde69c; color: #638421; margin-right: 5px; margin-bottom: 5px; font-family: helvetica;font-size: 13px;";
		spanStyle += "margin: 4px; cursor: pointer; font-size: 13px;"; 
		span.style.cssText = spanStyle;
		span.innerHTML = labelName;

		span.addEventListener("click", function (event)
		{
			if (outerObj.tagClick && typeof outerObj.tagClick == "function")
			{
				var tagName = event.currentTarget.innerHTML;
				outerObj.tagClick({ tagName: tagName });
			}
		}, false);

		outerObj.containerDiv.insertBefore(span, outerObj.clearSpan);
	}

	return bxTagClound;
})();