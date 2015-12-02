## Bx_Select.js 0.0.1版

bx_select.js是一个适用于移动端的可搜索的select实现。它可以通过ajax搜索，本地列表的简单搜索。

bx_select实现为一个简单的BxSelect对象，现在没有对外公开的方法。

创建一个BxSelect对象，你需要有一个text类型文本框作为宿主元素。

例如： 

    <input type="text" id="inputx" />
	//在js中你可以这样使用
	
	var bxSelect = new BxSelect({
		element: document.getElementById("inputx"),
		data: [
			 { text: "java", value: "1" },
			 { text: "c#", value: "2" },
			 { text: "ruby", value: "3" }
			] 
	});

向上面的代码，它会创建一个简单bx_select控件，可以本地搜索。data为数组，每个项是一个普通的对象，{text: ..., value: ...}。

你还可以设置zIndex属性，用于设置bx_select控件的z-index属性，它的默认值为50.

	var bxSelect = new BxSelect({
			element: document.getElementById("inputx"),
			data: [
				 { text: "java", value: "1" },
				 { text: "c#", value: "2" },
				 { text: "ruby", value: "3" }
				]，
			zIndex: 20 
		});

bx_select对外公开selectedIndex事件与selectedChanged事件。

例如：

var bxSelect = new BxSelect({
		element: document.getElementById("inputx"),
		data: [
			 { text: "java", value: "1" },
			 { text: "c#", value: "2" },
			 { text: "ruby", value: "3" }
			]，
		selectedIndex: function (item)
		{
			
		},
		selectedChanged: function (item)
		{
			
		} 
	});

这两个事件会传递选中的项的item对象给处理函数，你可以在处理函数中设置自己的逻辑，当选中一个项，默认会给宿主对象设置data-bx-value为选中的对象的value值。

默认的搜索是从本地集合中进行搜索，你还可以从ajax来检索。

	var bxSelect = new BxSelect({
						element: document.getElementById("inputx"),
						ajax: {
							url: "http://m.weather.com.cn/atad/101190101.html",
							type: "get",
							dataType: "json",
							beforeSend: function ()
							{
								alert("开始了");
							},
							results: function (json)
							{
								return [
									 { text: "java", value: "1" },
									 { text: "c#", value: "2" },
									 { text: "ruby", value: "3" }
									]; 
							},
							error: function ()
							{
								alert("请求失败");
							},
							fillClose: function ()
							{
								alert("结束了");
							}
						}
						
					});

其中results函数返回要填充的对象数组，beforeSend执行检索前的代码，例如，你可以设置一个loading动画，fillClose函数设置填充完毕执行的代码，例如你可以关闭loading动画，error函数处理检索失败时的处理代码。