## 如何使用

Pc和移动网页使用同一个bx_tag.js

css:

pc端引入bx_tag.css, 移动端引入bx_tag_m.css

### 初始化BxTag对象

var tag = new BxTag(config); //这样初始化一个BxTag对象

config是一个普通的JavaScript对象，参数：

labelArray: 一个字符串数组，用于初始化显示标签，默认为空数组。

containerDiv: 一个DOM容器对象，例如document.getElementById("containerDiv");

labelMaxLength: 标签最大数量，超过最大数量，将不可输入

addTagEvent: 添加标签后回调函数，它形如：

// tagEvent是一个普通的JavaScript对象，它有两个属性，type，addTagName
function (tagEvent)
{
	
}

removeTagEvent: 移除标签后的回调函数，它形如：

// tagEvent是一个普通的JavaScript对象，它有两个属性，type，removeTagName
function (tagEvent)
{
	
}
