"use strict";

"version: 0.0.1";

var BxTagClound = (function ()
{
	var bxTagClound = function (config)
	{
		this.labelArray = [];
		this.containerDiv = buildContainerDiv(config.containerDiv);

		var labelArray = config.labelArray || [];
		initLabels(this, labelArray);

		this.tagClickEvent = config.tagClickEvent;
	};

	function initLabels(outerObj, labelArray)
	{
		for (var i = 0; i < labelArray.length; i++)
		{
			addTag(outerObj, labelArray[i]);
		}
	}

	function buildContainerDiv(containerDiv)
	{
		containerDiv.className = "bx_tag_clound_wrapper";

		return containerDiv;
	}

	function addTag(outerObj, labelName)
	{
		var span = document.createElement("span");
		span.innerHTML = labelName;

		span.addEventListener("click", function (event)
		{
			if (outerObj.tagClickEvent && typeof outerObj.tagClickEvent == "function")
			{
				var tagName = event.currentTarget.innerHTML;
				var e = { type: 'tagClickEvent', tagName: tagName };
				outerObj.tagClickEvent(e);
			}
		}, false);

		outerObj.labelArray.push(labelName);
		outerObj.containerDiv.appendChild(span);
	}

	return bxTagClound;
})();