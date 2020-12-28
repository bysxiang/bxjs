"use strict";

var Ybs = {
    Ui: {

    }
};

// select构造函数
Ybs.Ui.Select = (function ()
{
    var select = function (config)
    {
        this.element = config.element;
        this.selectedValue = config.selectedValue || '';
        this.selectedText = config.selectedText || '';
        this.charLength = config.charLength || 1;
        //this.placeholder = config.placeholder || '请选择';
        this.selectedEvent = config.selectedEvent;
        
        this.spanName = buildSpanName();
        this.abbr = buildAbbr();
        this.selectDiv = buildSelectDiv(this.spanName, this.abbr);
        this.selectDiv.style.cssText += (" width: " + (this.element.clientWidth - 14) + "px; ") ; 
        this.selectDiv.className = "select-div";

        this.inputTxt = buildInputTxt();
        this.inputDiv = buildInputDiv(this.inputTxt);

        this.ul = buildUl();
        this.ulDiv = buildUlDiv(this.ul);
        this.wrapperDiv = buildWrapperDiv(this.inputDiv, this.ul);
        this.wrapperDiv.style.cssText += (" width: " + (this.element.clientWidth + 4) + "px; ") ; 
        this.wrapperDiv.className = "wrapper-div";

        this.ajaxConfig = config.ajax;
        this.ajaxConfig.status = false;

        this.ajaxConfig.beforeSend = insertTip(this.ul);
        this.ajaxConfig.fillClose = removeTip(this.ul);

        this.element.parentNode.appendChild(this.selectDiv);
        this.element.parentNode.appendChild(this.wrapperDiv);

        this.timeOut = 0;

        doEvents(this);
    }

    function doEvents(that)
    {
        // 选择框 - click 事件
        that.selectDiv.addEventListener('click', function (event) {
            if (that.wrapperDiv.style.display == "none")
            {
                that.wrapperDiv.style.display = "";
            }
            else
            {
                that.wrapperDiv.style.display = "none";
            }
        }, false);

        // 远程搜索
        that.inputTxt.addEventListener('keyup', function (event) 
        {
            var ajaxConfig = that.ajaxConfig;
            var val = event.currentTarget.value;
            if (val.length >= that.charLength && !that.ajaxConfig.status)
            {
                window.clearTimeout(that.timeOut);
                window.setTimeout(function ()
                {
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () 
                    {
                        if (xhr.readyState == 4)
                        {
                            if (xhr.status == 200)
                            {
                                var result = ajaxConfig.results(parseContent(xhr, ajaxConfig.dataType));

                                if (ajaxConfig.fillClose && typeof ajaxConfig.fillClose == "function")
                                {
                                    ajaxConfig.fillClose();
                                }

                                fillList(that, result);
                                ajaxConfig.status = false;
                            }
                            else
                            {
                                if (ajaxConfig.error && typeof ajaxConfig.error == 'function')
                                {
                                    ajaxConfig.error();
                                }
                            }
                        }
                    } // xhr.onreadystatechange .. end

                    var url = ajaxConfig.url;
                    if (ajaxConfig.data)
                    {   
                        var data = (ajaxConfig.data && typeof ajaxConfig.data == "function") ?
                            that.ajaxConfig.data(that.inputTxt.value) : null;

                        for (var p in data)
                        {
                            url = addURLParam(url, p, data[p]);
                        }
                    }

                    xhr.open(ajaxConfig.type, url, true);
                    if (ajaxConfig.beforeSend && typeof ajaxConfig.beforeSend == "function")
                    {
                        ajaxConfig.beforeSend();
                    }
                    xhr.send(null);
                    ajaxConfig.status = true;
                }, 500);
                
            }
        }, false);

        //单击事件
        // 只为ul绑定单击事件，li的单击事件会冒泡到ul上
        that.ul.addEventListener("click", function (event)
        {   
            // 当单击的是li时
            if (event.target !== event.currentTarget)
            {
                that.selectedValue = event.target.dataset.liValue;
                that.selectedText = event.target.dataset.liText;

                that.spanName.innerHTML = that.selectedText;
                that.abbr.style.display = "";

                if (that.selectedEvent && typeof(that.selectedEvent == "function"))
                {
                    that.selectedEvent({ text: that.selectedText, value: that.selectedValue });
                }
            }

            that.wrapperDiv.style.display = "none";
        }, false);

        //清除选项事件
        that.abbr.addEventListener("click", function (event)
        {
            that.selectedText = "";
            that.selectedValue = -1;
            that.spanName.innerHTML = "选择";

            event.stopPropagation();
        }, false);
    };

    function buildSpanName()
    {
        var spanName = document.createElement("span");
        spanName.innerHTML = "请输入";
        var spanNameCss = "margin-right: 26px; display: block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;";
        spanName.style.cssText = spanNameCss;

        return spanName;
    }

    function buildAbbr()
    {
        var abbr = document.createElement("abbr");
        abbr.innerHTML = "x";
        var abbrCloseCss = "position: absolute; right: 26px; top: 8px; width: 12px; height: 12px; font-size: 17px;";
        abbrCloseCss += "line-height: 16px; color: #595959; font-weight: 700; cursor: pointer; text-decoration: none;";
        abbrCloseCss += "border: 0; outline: 0;";
        abbr.style.cssText = abbrCloseCss;
        abbr.style.display = "none";

        return abbr;
    }

    function buildSelectDiv(spanName, abbr)
    {
        //构造选择的select
        var selectDiv = document.createElement("div");
        var selectDivCss = "border: 1px solid #dcdcdc; border-radius: 2px; padding: 4px 8px;";
        selectDivCss += "display: block; position: relative;";
        selectDivCss += "font-size: 13px; line-height: 20px; margin: 5px 0;";
        selectDiv.style.cssText = selectDivCss;
        selectDiv.className = "wrapper_css";

        selectDiv.appendChild(spanName);
        selectDiv.appendChild(abbr);
        
        return selectDiv;
    }

    function buildInputTxt()
    {
        var inputSearch = document.createElement("input");
        inputSearch.type = "text";

        return inputSearch;
    }

    function buildInputDiv(inputTxt)
    {
        var inputDiv = document.createElement("div");
        inputDiv.appendChild(inputTxt);

        return inputDiv;
    }

    function buildUl()
    {
        var ul = document.createElement("ul");
        var ulCss = "list-style: none; margin: 0px; padding: 0px;";
        ul.style.cssText = ulCss;

        return ul;
    }
    
    function buildUlDiv(ul)
    {
        var ulDiv = document.createElement("div");
        var ulDivCss = "overflow: auto; border: 0px solid #ccc; position: relative; min-height: 200px;";
        ulDiv.style.cssText = ulDivCss;

        ulDiv.appendChild(ul);

        return ulDiv;
    }

    function buildWrapperDiv(inputDiv, ulDiv)
    {
        var wrapperDiv = document.createElement("div");
        wrapperDiv.style.display = "none";

        wrapperDiv.appendChild(inputDiv);
        wrapperDiv.appendChild(ulDiv);

        return wrapperDiv;
    }

    function setInputEvent(select)
    {
        var inputTxt = select.inputTxt;
        var charLength = select.charLength;

        inputTxt.addEventListener('keyup', function (event) {
            var val = event.currentTarget.value;

            if (val.length >= charLength && !select.ajaxConfig.status)
            {
                ajax(select.ajaxConfig);
            }
        }, false);
    }

    // 解析不同的内容类型
    // 只解析html, XML, json
    // 默认为html
    function parseContent(xhr, type)
    {
        var result = null;

        switch (type)
        {
            case "json":
                result = JSON.parse(xhr.responseText);
                break;
            case "xml":
                result = xhr.responseXML;
                break;
            default:
                result = xhr.responseText;
                break;
        }

        return result;
    }

    //对url添加查询字符串
    function addURLParam(url, name, value)
    {
        url += (url.indexOf("?") == -1 ? "?" : "&");
        url += encodeURIComponent(name) + "=" + encodeURIComponent(value);

        return url;
    }

    function fillList(thatObj, data)
    {
        while (thatObj.ul.hasChildNodes())
        {
            thatObj.ul.removeChild(thatObj.ul.firstChild);
        }

        for (var i = 0; i < data.length; i++)
        {
            var li = document.createElement('li');
            li.innerHTML = data[i].text;
            li.dataset.liValue = data[i].value;
            li.dataset.liText = data[i].text;

            thatObj.ul.appendChild(li);
        }
    }

    function insertTip(ul)
    {
        var tipLi = document.createElement("li");
        tipLi.innerHTML = "搜索中...";

        if (ul.firstChild)
        {
            ul.insertBefore(tipLi, ul.firstChild);
        }
        else
        {
            ul.appendChild(tipLi);
        }
    }

    function removeTip(ul)
    {
        ul.removeChild(ul.firstChild);
    }

    return select;
})();



