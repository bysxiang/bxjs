var Ybs = {
	Store: 
	{
		freight: 10,
	},
	Util: 
	{
		getExtension: function (number) //返回小数位数
		{
			if (!isNaN(parseFloat( number )))
			{
				var str = number.toString();
				var dotIndex = str.indexOf(".");
				
				var num = 0;
				if (dotIndex != -1)
				{
					var sub = str.substring(dotIndex + 1, str.length);
					if (sub == "")
					{
						num = 0;
					}
					else
					{
						num = sub.length;
					}
				}

				return num;
			}
			else
			{
				throw new TypeError("number不是有效数字");
			}
		},
		parseFloat: function (value) { //转换为小数
			var val = NaN;
			var str = value.toString();

			if (Ybs.Util.startWith(str, "."))
			{
				str = "0" + str;
			}

			if (Ybs.Util.endWith(str, "."))
			{
				str = str.substring(0, str.length - 1);
			}

			if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(str))
			{
				val = Number(str);
			}

			return val;
		},
		startWith: function (sourceStr, value) { // 判断开始字符
			if (typeof sourceStr == "string" && typeof value == "string")
			{
				return sourceStr.substr(0, value.length) == value;
			}
			else
			{
				throw new TypeError("两个参数必须为字符串");
			}
		},
		endWith: function (sourceStr, value) { // 判断结尾字符
			if (typeof sourceStr == "string" && typeof value == "string")
			{
				return sourceStr.substr(-value.length, value.length) == value;
			}
			else
			{
				throw new TypeError("两个参数必须为字符串");
			}
		},
		appendFocus: function (ele, value) { //设置值，并获得焦点
			ele.value = value;
			ele.focus();
			var len = ele.value.length;

			if (document.selection) 
			{
				var sel = ele.createTextRange();
				sel.moveStart('character', len);
				sel.collapse();
				sel.select();
			} 
			else if (typeof ele.selectionStart == 'number' && typeof ele.selectionEnd == 'number') 
			{
				ele.selectionStart = ele.selectionEnd = len;
			}
		}


	}
};

// 获得一个原型对象
Ybs.Util.object = function (o) {
	function F() {};
	F.prototype = o;

	return new F();
};

// 对子类寄生组合式继承一个基类
Ybs.Util.inheritPrototype = function (subType, superType) {
	var prototype = Ybs.Util.object(superType.prototype);
	prototype.constructor = subType;
	subType.prototype = prototype;

	return subType;
};

// 库存不足-异常, 继承自Error
Ybs.Store.QuantityLow = function (message) {
	this.name = "QuantityLow";
	this.message = message;
};
// 寄生组合式继承Error类
Ybs.Util.inheritPrototype(Ybs.Store.QuantityLow, Error);

// 权利金不足
Ybs.Store.CoinLow = function (message) {
	this.name = "CoinLow";
	this.message = message;
};
// 寄生组合式继承Error类
Ybs.Util.inheritPrototype(Ybs.Store.CoinLow, Error);

//余额或现金不足
Ybs.Store.PayError = function (message) {
	this.name = "PayError";
	this.message = message;
};
// 寄生组合式继承Error类
Ybs.Util.inheritPrototype(Ybs.Store.PayError, Error);

// 超过商品限额
Ybs.Store.CardLimitExceed = function (message) {
	this.name = "CardLimitExceed";
	this.message = message;
};
// 寄生组合式继承Error类
Ybs.Util.inheritPrototype(Ybs.Store.CardLimitExceed, Error);

// 产品类
Ybs.Store.Product = function (id, name, spec, price, powerPrice, storeQuantity, wareQuantity, cardLimit) {
	this.id = id; 
	this.name = name;
	this.spec = spec;
	this.price = price;
	this.powerPrice = powerPrice;
	this.storeQuantity = storeQuantity;
	this.wareQuantity = wareQuantity;
	if ( typeof cardLimit != 'number' || cardLimit < 0 )
	{
		this.cardLimit = 0;
	}
	else
	{
		this.cardLimit = cardLimit;
	}
};

Ybs.Store.Product.prototype.getStoreQuantity = function () {
	return this.storeQuantity;
};

Ybs.Store.Product.prototype.getWareQuantity = function () {
	return this.wareQuantity;
};

Ybs.Store.Product.prototype.getCoin = function () {
	return parseFloat ((this.price - this.powerPrice).toFixed(2));
};

//拼购商品类，它继承自Product类
Ybs.Store.ProductExtra = function (productId, productName, productSpec, productPrice, productPowerPrice, 
	storeQuantity, wareQuantity, cardLimit, grouponPrice, grouponStoreQuantity, grouponWareQuantity) {
	// 借用构造方式继承父类属性
	Ybs.Store.Product.call(this, productId, productName, productSpec, productPrice, productPowerPrice, 
		storeQuantity, wareQuantity, cardLimit);
	this.grouponPrice = grouponPrice;
	this.grouponStoreQuantity = grouponStoreQuantity;
	this.grouponWareQuantity = grouponWareQuantity;
}

// 寄生组合式继承Product类
Ybs.Util.inheritPrototype(Ybs.Store.ProductExtra, Ybs.Store.Product);
Ybs.Store.ProductExtra.prototype.getStoreQuantity = function () {
	return this.grouponStoreQuantity;
};

Ybs.Store.ProductExtra.prototype.getWareQuantity = function () {
	return this.grouponWareQuantity;
};

Ybs.Store.ProductExtra.prototype.getCoin = function () {
	return parseFloat ((this.price - this.grouponPrice).toFixed(2));
};

// Item类构造函数，它接受一个Product对象或是它的子类
Ybs.Store.Item = function (product, quantity) {
	this.product = product;
	if (product.cardLimit > 0 && product.cardLimit < quantity)
	{
		throw new Ybs.Store.CardLimitExceed("超过商品限额");
	}
	this.quantity = quantity;
};

// 获取抵扣权利金额度
Ybs.Store.Item.prototype.sumCoin = function () {
	var	coin = this.product.getCoin() * this.quantity; 

	return parseFloat( coin.toFixed(2) );
};

Ybs.Store.Item.prototype.sumPrice = function () {
	var sum = this.product.price * this.quantity;

	return parseFloat( sum.toFixed(2) );
};

// Order类构造函数
Ybs.Store.Order = function (orderKind, isDelivery, deliveryAddress) {
	this.items = [];
	this.orderKind = orderKind;
	this.isDelivery = isDelivery;
	this.deliveryAddress = deliveryAddress || "";
	//this.useBalance = useBalance;
	//this.useCoin;

	var _freight = 0;
	Object.defineProperty(this, "freight", {
		get: function () {
			return _freight;
		}
	});

	if (isDelivery)
	{
		_freight = Ybs.Store.freight;
	}
	else
	{
		_freight = 0;
	}
};

// 获取订单中指定产品的数量
Ybs.Store.Order.prototype.productLength = function (product) {
	if (product instanceof Ybs.Store.Product == false)
	{
		throw new TypeError("不是Product或ProductExtra类型");
	}

	var num = 0;
	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i].product.id == product.id)
		{
			num += this.items[i].quantity;
		}
	}

	return num;
};

Ybs.Store.Order.prototype.add = function (item) {

	if (this.orderKind == 0 || this.orderKind == 3)
	{
		if (item.product.getWareQuantity() < (item.quantity + this.productLength(item.product)) )
		{
			throw new Ybs.Store.QuantityLow("库存不足");
		}
	}
	else if (this.orderKind == 1 || this.orderKind == 4)
	{
		if (item.product.getStoreQuantity() < (item.quantity + this.productLength(item.product)) )
		{
			throw new Ybs.Store.QuantityLow("库存不足");
		}
	}

	if (item.product.cardLimit != 0 && ( item.quantity + this.productLength(item.product) ) > item.product.cardLimit)
	{
		throw new Ybs.Store.CardLimitExceed("超过限额");
	}

	var found = false;
	for (var i = 0; i < this.items.length; i++)
	{
		if (this.items[i].product.id == item.product.id)
		{
			found = true;
			if (item.product.cardLimit != 0 && (this.items[i].quantity + item.quantity > item.product.cardLimit) )
			{
				throw new Ybs.Store.CardLimitExceed("超过商品限额");
			}
			else
			{
				this.items[i].quantity += item.quantity;
			}
		}
	}
	if (!found)
	{
		this.items.push(item);
	}
};

// 更新指定产品数量
Ybs.Store.Order.prototype.updateQuantity = function (product, quantity)
{
	if (this.orderKind == 0 || this.orderKind == 3)
	{
		if (product.getWareQuantity() < quantity )
		{
			throw new Ybs.Store.QuantityLow("库存不足");
		}
	}
	else if (this.orderKind == 1 || this.orderKind == 4)
	{
		if (product.getStoreQuantity() < quantity)
		{
			throw new Ybs.Store.QuantityLow("库存不足");
		}
	}

	if (product.cardLimit != 0 && quantity > product.cardLimit)
	{
		throw new Ybs.Store.CardLimitExceed("超过限额");
	}

	for (var i = 0; i < this.items.length; i++)
	{
		if (this.items[i].product.id == product.id)
		{
			this.items[i].quantity = quantity;
		}
	}
};

Ybs.Store.Order.prototype.delete = function (productId) {
	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i].product.id == productId) {
			this.items.splice(i, 1);
		}
	}
};

Ybs.Store.Order.prototype.deleteByIndex = function (index) {
	this.items.splice(index, 1);
};

Ybs.Store.Order.prototype.empty = function () {
	this.items = [];
};

Ybs.Store.Order.prototype.itemsLength = function () {
	return this.items.length;
};

// 当前订单可抵扣权利金值
Ybs.Store.Order.prototype.sumCoin = function (useCoin) {
	var sum = 0;
	for (var i = 0; i < this.items.length; i++) {
		if (useCoin) {
			sum += this.items[i].sumCoin();
		}
	}

	return parseFloat( sum.toFixed(2) );
};

// 当前订单总价
Ybs.Store.Order.prototype.sumPrice = function () {
	var sum = 0;
	for (var i = 0; i < this.items.length; i++) {
		sum += this.items[i].sumPrice();
	}

	return parseFloat( sum.toFixed(2) );
};

// 将items项转换为{ id => quantity }格式
Ybs.Store.Order.prototype.toItems = function () {
	var data = {};
	for (var i = 0; i < this.items.length; i++)
	{
		data[this.items[i].product.id] = this.items[i].quantity;
	}

	return data;
};

// 检查产品数量是否正常
// return { result: true, msg: '' };
Ybs.Store.Order.prototype.checkOrder = function () {
	var r = { result: true, msg: '' };

	if (this.items.length == 0)
	{
		r.result = false;
		r.msg = '订单不能为空';
	}
	else
	{
		for (var i = 0; i < this.itemsLength(); i++)
		{
			if (this.items[i].quantity <= 0)
			{
				r.result = false;
				r.msg = '产品数量不能为空';
			}
		}
	}

	return r;
};

// 是否必须使用权利金
// 权利金抵扣值大于售价，必须使用权利金
Ybs.Store.Order.prototype.mustUseCoin = function ()
{
	for (var i = 0; i < this.items.length; i++)
	{
		var coin = this.items[i].product.getCoin();
		if (coin >= this.items[i].product.price)
		{
			return true;
		}
	}

	return false;
};

// 是否包含拼团商品
Ybs.Store.Order.prototype.continerProductExra = function ()
{	
	var r = false;
	for (var i = 0; i < this.items.length; i++)
	{
		if (this.items[i].product instanceof Ybs.Store.ProductExtra)
		{
			r = true;
			break;
		}
	}

	return r;
};

// 获取订单中的product_ids
Ybs.Store.Order.prototype.product_ids = function ()
{
	var ids = [];
	for (var i = 0; i < this.items.length; i++)
	{
		if (ids.indexOf(this.items[i].product.id) == -1)
		{
			ids.push(this.items[i].product.id);
		}
	}

	return ids;
};

Ybs.Store.Consumer = function (id, realName, mobile, balance, coin, depotName, depotId, delivery,
 readyCount, building, unit, room, outAddress, vouchers) {
	this.id = id;
	this.realName = realName;
	this.mobile = mobile;
	this.depotName = depotName;
	this.depotId = depotId;
	this.delivery = delivery;
	this.readyCount = readyCount;
	this.building = building;
	this.unit = unit;
	this.room = room;
	this.outAddress = outAddress;

	if (vouchers)
	{
		this.vouchers = vouchers;
	}
	else
	{
		this.vouchers = [];
	}

	var _balance = 0;
	Object.defineProperty(this, "balance", {
		enumerable: true,
		get: function () {
			return _balance;
		},
		set: function (val) {
			if ( typeof val != 'number' || val < 0 )
			{
				throw new TypeError("余额值不能小于0");
			}
			else
			{
				_balance = val;
			}
		}
	});
	this.balance = balance;

	var _coin = 0;
	Object.defineProperty(this, "coin", {
		enumerable: true,
		get: function () {
			return _coin;
		},
		set: function (val) {
			if ( typeof val != 'number' || val < 0 )
			{
				throw new TypeError("权利金不能小于0");
			}
			else
			{
				_coin = val;
			}
		}
	});
	this.coin = coin;

}; // Ybs.Store.Consumer 构造函数结束

// 用户是否可以使用权利金抵扣指定订单
/*
	params order Ybs.Store.Order对象
	params isDelivery 是否配送
*/
Ybs.Store.Consumer.prototype.canCoin = function (order) {

	return this.coin >= (order.sumCoin(true) + order.freight);
};

// 用户可抵扣此订单的代金券列表
/*
	params order Ybs.Store.Order对象
	return Ybs.Store.Voucher 对象数组
*/
Ybs.Store.Consumer.prototype.voucher_pay_list = function(order)
{	
	var vouchers = {};
	for (var i = 0; i < this.vouchers.length; i++)
	{
		if (this.vouchers[i].isPay(order))
		{
			vouchers.push(this.vouchers[i]);
		}
	}

	return vouchers;
};

// 根据id查找Voucher对象
/*
	params voucherId voucherId
	return Ybs.Store.Voucher对象
*/
Ybs.Store.Consumer.prototype.find_voucher = function (voucherId)
{
	var voucher = null;
	for (var i = 0; i < this.vouchers.length; i++)
	{
		if (this.vouchers[i].voucherId == voucherId)
		{
			voucher = this.vouchers[i];
			break;
		}
	}

	return voucher;
};

Ybs.Store.Consumer.prototype.needCoin = function (order, useCoin)
{
	var sumPrice = order.sumPrice();
	var sumCoin = order.sumCoin(useCoin);

	var need = 0;
	if (useCoin)
	{
		if (this.coin >= sumCoin + order.freight)
		{
			need = sumCoin + order.freight;
		}
		else
		{
			throw new Ybs.Store.CoinLow("权利金不足");
		}		
	}

	return need;
};

// 计算余额支付多少钱
// order Order对象
// useCoin 是否使用权利金
// voucherId 代金券类型id
// return 返回需要的金额
// Exception 如果使用权利金，权利金不足，将抛出CoinLow异常
Ybs.Store.Consumer.prototype.balancePay = function (order, useCoin, voucherId) {
	var sumPrice = order.sumPrice();
	var sumCoin = order.sumCoin(useCoin);

	var sum = sumPrice;
	sum -= this.needCoin(order, useCoin);

	if (sum > 0)
	{
		sum -= this.needVoucher(order, useCoin, voucherId);
	}

	var need = 0;
	if (sum > 0)
	{
		need = this.balance > sum ? sum : this.balance;
	}

	return parseFloat( need.toFixed(2) );
};

// 计算需要支付多少钱
// order Order对象
// useBalance 是否使用余额
// useCoin 是否使用权利金
// voucherId 代金券类型id
// return 返回需要的金额
// Exception 如果使用权利金，权利金不足，将抛出CoinLow异常
Ybs.Store.Consumer.prototype.needPay = function (order, cash, useBalance, useCoin, voucherId) {
	var sumPrice = order.sumPrice();
	var sumCoin = order.sumCoin(useCoin);

	var sum = sumPrice;
	sum -= this.needCoin(order, useCoin);

	if (sum > 0)
	{
		sum -= this.needVoucher(order, useCoin, voucherId);
	}
	
	var leftCash = parseFloat( (cash - sum).toFixed(2) );
	if (leftCash < 0)
	{
		sum -= (this.balance > Math.abs(leftCash) ? Math.abs(leftCash) : this.balance);
	} 

	return parseFloat( sum.toFixed(2) ); 
};

// 计算需要支付多少余额
// order Order对象
// cash 现金
// useBalance 是否使用余额
// useCoin 是否使用权利金
// voucherId 代金券类型id
// return 返回需要的金额
// Exception 如果使用权利金，权利金不足，将抛出CoinLow异常
Ybs.Store.Consumer.prototype.needBalance = function (order, cash, useBalance, useCoin, voucherId) {
	var sumPrice = order.sumPrice();
	var sumCoin = order.sumCoin(useCoin);

	var sum = sumPrice;
	sum -= this.needCoin(order, useCoin);

	if (sum > 0)
	{
		sum -= this.needVoucher(order, useCoin, voucherId);
	}

	var need = 0;
	var leftCash = parseFloat( (cash - sum).toFixed(2) );
	if (leftCash < 0)
	{
		need = this.balance > Math.abs(leftCash) ? Math.abs(leftCash) : this.balance;
	}

	return need;
};

// 计算需要抵扣的代金券值
/*
	params order Ybs.Store.Order对象
	params useCoin boolean 
	params voucherId int 
	return 需要抵扣代金券的值
*/
Ybs.Store.Consumer.prototype.needVoucher = function (order, useCoin, voucherId)
{
	var sumPrice = order.sumPrice();
	var sumCoin = order.sumCoin(useCoin);

	var sum = sumPrice;
	sum -= this.needCoin(order, useCoin);

	var need = 0;
	if (voucherId > 0)
	{
		var voucher = this.find_voucher(voucherId);
		if (voucher.balance >= sum)
		{
			need = sum;
		}
		else
		{
			need = voucher.balance;
		}
	}

	return parseFloat(need.toFixed(2));
};

// 订单需要支付总额
Ybs.Store.Consumer.prototype.orderMoney = function (order, useCoin) {
	var sumPrice = order.sumPrice();
	var sumCoin = order.sumCoin(useCoin);

	var sum = sumPrice;
	sum -= this.needCoin(order, useCoin);

	return parseFloat(sum.toFixed(2));
};

// 现金支付订单,返回找零
// params order 订单
// params cash number 实收现金
// params useBalance boolean 是否使用余额
// params useCoin boolean 是否使用权利金
// voucherId 代金券类型id
// Exception 如果权利金不足，将会抛出Ybs.Store.CoinLow异常
Ybs.Store.Consumer.prototype.cashPay = function (order, cash, useBalance, useCoin, voucherId) {
	var need = this.needPay(order, useBalance, useCoin, voucherId);
	var left = parseFloat( (cash - need).toFixed(2) );
	
	return left;
};

// 序列化为json字符串
Ybs.Store.Consumer.prototype.toJson = function ()
{
	return JSON.stringify(this);
};

