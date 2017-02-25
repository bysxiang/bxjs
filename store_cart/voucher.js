Ybs.Store.Voucher = function (voucherId, name, productIds, balance)
{
    this.voucherId = voucherId;
    this.name = name;
    this.productIds = productIds;
    this.balance = balance;
};

Ybs.Store.Voucher.prototype.minusBalance = function (balance)
{
    this.balance -= balance;
};

Ybs.Store.Voucher.prototype.isPay = function (order)
{
    var that = this;
    var r = order.product_ids().every(function (element, index, array) {
        return that.productIds.includes(element);
    });
    
    return r;
};