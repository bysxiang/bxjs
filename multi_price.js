"use strict";

var Ybs = {
	Ui: {
		
	}
};

Ybs.Ui.MultiPrice = (function ()
{
	var multiPrice = function (config)
	{
		this.container = config.container;
		this.addBtn = createAddBtn();
		
		var addDiv = createAddDiv(this.addBtn);
		this.container.appendChild(addDiv);
		
		this.minCash = config.minCash;
		
		this.selectedItems = config.selectedItems || [];
		if (this.selectedItems.length > 0)
		{
			fillItems(this.selectedItems);
		}
	};
	
	multiPrice.prototype.deleteRow(event) {
		
	};
	
	function doEvents(that)
	{
		that.addBtn.addEventListener('click', function (event) {
			
		}, false);
	}
	
	function createAddDiv(addBtn)
	{
		var div = document.createElement("div");
		div.className = "price-row";
		div.appendChild(addBtn);
		
		return div;
	}
	
	function createAddBtn()
	{
		var inputBtn = document.createElement("input");
		inputBtn.type = "button";
		inputBtn.value = "添加";
		
		return inputBtn;
	}
	
	function addItem(cash, coin, deleteCallback)
	{
		if (cash && cash > 0)
		{
			var cashStr = cash.toString();
		}
		else
		{
			var cashStr = "";
		}
		
		if (coin && coin > 0)
		{
			var coinStr = coin.toString();
		}
		else
		{
			var coinStr = coin.toString();
		}
		
		var div = document.createElement("div");
		div.className = "price-row";
		
		var labelMoney = document.createElement("label");
		labelMoney.innerHTML = "金额: ";
		var inputMoney = document.createElement("input");
		inputMoney.type = "number";
		inputMoney.step = "0.01";
		inputMoney.min = "0.01";
		inputMoney.value = cashStr;
		div.appendChild(labelMoney);
		div.appendChild(inputMoney);
		
		var labelCoin = document.createElement("label");
		labelCoin.innerHTML = "权利金: ";
		var inputCoin = document.createElement("input");
		inputCoin.type = "number";
		inputCoin.step = "0.01";
		inputCoin.min = "0.01";
		inputCoin.value = coinStr;
		div.appendChild(labelCoin);
		div.appendChild(inputCoin);
		
		var inputX = document.createElement("input");
		inputX.type = "button";
		inputX.value = "X";
		
		if (deleteCallback && typeof deleteCallback == "function")
		{
			inputX.addEventListener('click', deleteCallback, false);
		}
	}
	
	function fillItems(items)
	{
		for (var i = 0; i < items.length; i++)
		{
			appendItem(items[i].cash, items[i].coin, multiPrice.deleteRow);
		}
	}
	
	return multiPrice;
})();
