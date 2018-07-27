/**
 * utils for $$ create by liuchen
 */

// #region 预加载资源
/* 预加载依赖的css样式文件，js脚本文件 */
var locationURL = window.document.location.href;
var base_url = /^.*?ssm-web\//.exec(locationURL)[0];
document.write("<link rel='stylesheet' href='" + base_url + "assets/style/jquery.utils.css' type='text/css'>");
console.log(base_url);
// #endregion
(function (win, $, undefined) {

    win.loadtimes = 0;
    // #region util基础逻辑
    var utils = function () {
        return new utils.core.init();
    };
    utils.core = utils.prototype = {
        constructor: utils,
        init: function () {
        }
    };
    utils.core.init.prototype = utils.core;
    utils.extend = utils.core.extend = function () {
        // copy reference to target object
        var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name = null, src, copy;
        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }
        // Handle case when target is a string or something (possible in deep
        // copy)
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }
        // extend jQuery itself if only one argument is passed
        if (length === i) {
            target = this;
            --i;
        }
        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }
                    // Recurse if we're merging object literal values or arrays
                    if (deep && copy && (jQuery.isPlainObject(copy) || jQuery.isArray(copy))) {
                        var clone = src && (jQuery.isPlainObject(src) || jQuery.isArray(src)) ? src : jQuery.isArray(copy) ? [] : {};
                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);
                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    };
    // #endregion

    // #region util核心方法
    // 常用方法
    utils.extend({
        ajax: function (setting) {
            // / <summary>
            // / ajax访问wcf服务
            // / </summary>
            var opts = utils.extend({}, {
                method: base_url + '/utils/empty',// actionURL
                data: '', // json格式的data
                confirm: '', // 是否弹出confirm提示，空则不提示
                message: '', // 执行成功提示内容，空则不提示
                load: true, // 是否加载等待窗
                type: 'post', // 提交方式post/get
                timeout: 0,
                throwerr: true,
                neterr: false,
                before: function () {
                },
                success: function (html, data) {
                }, // 执行成功回调方法
                error: function (xmlttp, status) {
                }, // 执行失败回调方法
                complete: function (xmlttp, status) {
                }, // 执行完毕回调方法
                defaultUrl: '',// wcf路径，不要修改
                dataType: 'json',
                contentType: 'application/json',
                async: true
            }, setting);

            function f() {
                if (opts.before) {
                    if (opts.before() == false) {
                        return false;
                    }
                }
                if (opts.load) {
                    //jQuery 1.8以后，ajaxSend绑定在document
                    $(document).one('ajaxSend', function () {
                        utils.ui.loader(); // 加载等待窗口
                    }).one('ajaxComplete', function () {
                        utils.ui.removeloader(); // 隐藏等待窗口
                    }).one('ajaxError', function () {
                        utils.ui.removeloader(); // 隐藏等待窗口
                    });
                }
                return $.ajax({
                    url: opts.defaultUrl + encodeURI(opts.method),
                    data: opts.data,
                    type: opts.type,
                    async: opts.async,
                    cache: false,
                    timeout: opts.timeout,
                    contentType: opts.contentType,
                    success: function (result) {
                        if (!$.isPlainObject(result)) {
                            result = {
                                status: false
                            };
                        }
                        if (result && !result.d) {
                            result.d = result; // 兼容wcf返回数据
                        }
                        function callback() {
                            if (typeof result.d.data === 'string') {
                                var html = result.d.data.trim();
                                // 判断返回的data是否为html元素标签，格式限制：<标签>...</标签>
                                // 将html元素封装为jQuery对象，以便兼容ie6和ie7的append方法
                                if (/^<([^>\s]*)[^>]*>[\s\S]*<\/\1>$/.test(html)) {
                                    opts.success($(html), result.d);
                                } else {
                                    opts.success(html, result.d);
                                }
                            } else {
                                opts.success(result.d.data, result.d);
                            }
                            $('div.table-responsive table.tabstyle').each(function () {
                                utils.ui.tabstyle(this);
                            });
                            $('*[title]').tooltip();
                        }
                        if (opts.message !== '' || result.d.message || !result.d.status) {
                            utils.ui.message({
                                type: result.d.status === true ? 'success' : 'error',
                                content: (function () {
                                    if (result.d.status === true) {
                                        return result.d.message ? result.d.message : opts.message;
                                    } else {
                                        return result.d.message ? result.d.message : '数据处理失败！';
                                    }
                                })(),
                                auto: result.d.status
                            });
                        }
                        try { callback(); }
                        catch (err) {
                            if (opts.throwerr) throw err;
                            else console.log(err);
                        }
                    },
                    complete: function (xmlttp, status) {
                        if (status == 'timeout') {
                            utils.ui.message({
                                type: 'warning',
                                content: '网络错误或服务未响应，请重试！',
                                title: '超时',
                                auto: false
                            });
                        }
                    },
                    error: function (xmlttp, status) {
                        opts.error(xmlttp, status);
                        console.log(xmlttp);
                        console.log(status);
                        if (opts.neterr) {
                            utils.ui.message({
                                type: 'warning',
                                content: '网络错误或服务未响应，请重试！',
                                auto: false
                            });
                        }
                        utils.ui.removeloader();
                    }
                });
            }
            if (opts.confirm !== '') {
                utils.ui.confirm(opts.confirm, function (index) {
                    return new f(setting);
                });
            } else {
                return new f(setting);
            }
        },
        getdata: function (method, success) {
            return $$.ajax({
                method: method,
                type: 'get',
                success: success
            });
        },
        getform: function (form) {
            // / <summary>
            // / 获取表单input和select，生成嵌套object对象，等价于（serializeArray）
            // / </summary>
            // / <param name='form' type='$'>
            // / $表单
            // / </param>
            return this.tools.serializeArray(form);
        },
        setform: function (form, o, p) {
            // / <summary>
            // / object对象赋值给表单的input和select
            // / </summary>
            // / <param name='form' type='$'>
            // / $表单
            // / </param>
            // / <param name='o' type='object'>
            // / 嵌套的object对象
            // / </param>
            for (var n in o) {
                if ($.isPlainObject(o[n])) {
                    arguments.callee(form, o[n], (p || '') + (p ? '.' : '') + n);
                } else {
                    var field = p ? p + '.' + n : n;
                    var lower = o[n] ? o[n].toString().toLowerCase() : '';
                    form.find('select[name="' + field + '"]').each(function () {
                        $(this).find('option').each(function () {
                            $(this).val($(this).val().toLowerCase());
                        });
                    });
                    if (typeof o[n] == 'string') {
                        o[n] = o[n].clearJSON();
                    }
                    form.find('input[name="' + field + '"]').val(o[n]).end().find('textarea[name="' + field + '"]').val(o[n]).end().find('select[name="' + field + '"]').val(lower);
                }
            }
        },
        json: function (obj) {
            // / <summary>
            // / 对象系列化为Json字符串
            // / </summary>
            // / <param name='obj' type='object/$()'>
            // / js对象或jQuery对象
            // / </param>
            return this.tools.stringify(obj);
        },
        parse: function (json) {
            // / <summary>
            // / 对应$$.stringify的反序列化方法，调用JSON.parse
            // / </summary>
            // / <param name='json' type='string'>
            // / json字符串
            // / </param>
            return json ? json : JSON.parse(json);
        },
        request: function (paras) {
            // / <summary>
            // / 获取url参数
            // / </summary>
            // / <param name='paras' type='string'>
            // / 参数名称
            // / </param>
            var reg = new RegExp("(^|&)" + paras + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return unescape(r[2]);
            return null;
        },
        requestURI: function (paras) {
            // / <summary>
            // / 获取url参数
            // / </summary>
            // / <param name='paras' type='string'>
            // / 参数名称
            // / </param>
            var reg = new RegExp("(^|&)" + paras + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return decodeURI(r[2]);
            return null;
        },

        simpleExtends: function (sub, base) {
            var f = function () {
            };
            f.prototype = base.prototype;
            sub.prototype = new f();
            sub.prototype.constructor = sub;

            sub.base = base.prototype;
            if (base.prototype.constructor == Object.prototype.constructor)
                base.prototype.constructor = base;
        },
        when: function (whenAction) {
            utils._when = whenAction;
            return utils;
        },
        then: function (thenAction) {
            $(document).one('ajaxStop', function () {
                if ($.isFunction(thenAction)) {
                    thenAction();
                    utils._when = null;
                }
            });
            if ($.isFunction(utils._when)) {
                utils._when();
            }
            utils.ajax();
            return utils;
        },
        asynRun: function (action) {
            $$.ui.loader();
            setTimeout(function () {
                try {
                    if ($.isFunction(action)) {
                        action();
                    }
                } finally {
                    $$.ui.removeloader();
                }
            }, 200);
        },
        formSubmit: function (action, data, settings) {
            var _settings = $.extend({}, {
                jump: true,// 是否通过action跳转到新页面
                blank: false
                // 是否打开新页的方式跳转
            }, settings);
            var jump = _settings.jump;
            var blank = _settings.blank;
            var $form = $('<form style="display:none;" method="post"></form>');
            if (jump) {
                $form.attr('target', blank ? '_blank' : '');
            } else {
                $form.attr('target', 'frame');
                $("body").append('<iframe name="frame" width="0" height="0" scrolling="no"></iframe>');
            }
            $form.attr('action', action);
            $("body").append($form);
            $.each(data, function (k, v) {
                $form.append($("<input type='hidden'/>").attr('name', k).val(v));
            });
            $form.submit(); // 表单提交
        }
    });
    // tools
    utils.extend({
        tools: {
            serializeArray: function (form) {
                // / <summary>
                // jQuery对象序列化为object，支持嵌套对象，如entity.ID或entity.child.ID
                // / </summary>
                // / <param name='form' type='$'>
                // / $表单
                // / </param>
                var els = $(form).find('*[name]');
                var o = {};
                // var ps = els.serialize().replace(/\+/g, '');此方法各种操蛋，暂时弃用
                var split1 = utils.Get.guid();
                var split2 = utils.Get.guid();
                var split3 = utils.Get.guid();
                var ps = encodeURIComponent(this.serializeEx(els, split1, split2));
                ps = decodeURIComponent(ps, true);

                function f(str) {
                    var n = str.split(split1)[0];
                    var v = str.split(split1)[1];
                    if (!v)
                        return;
                    if (n === '__VIEWSTATE')
                        return;

                    var array = n.split(".");
                    for (var i = 1; i < array.length; i++) {
                        var tmpArray = Array();
                        tmpArray.push("o");
                        for (var j = 0; j < i; j++) {
                            tmpArray.push(array[j]);
                        }
                        var evalString = tmpArray.join(".");
                        if (!eval(evalString)) {
                            eval(evalString + "={};");
                        }
                    }
                    ;
                    eval("o." + n + "='" + v.replace(/[\r\n]/g, split3).replace(/'/g, '\"') + "';");
                }
                ;
                var pps = ps.split(split2);
                for (var i = 0; i < pps.length; i++) {
                    f(pps[i]);
                }

                function traversal(obj) {
                    for (var i in obj) {
                        if (typeof (obj[i]) == "object") {
                            traversal(obj[i]);
                        } else {
                            obj[i] = obj[i].replaceAll(split3, '\r\n');
                        }
                    }
                }
                traversal(o);
                return o;
            },
            stringify: function (obj) {
                // / <summary>
                // /
                // 对象列化为json格式，如果是$对象则调用$$.serializeArray序列化，如果是js对象则调用JSON.stringify
                // / </summary>
                // / <param name='obj' type='object/$()'>
                // / js对象或jQuery对象 g
                // / </param>
                if (obj instanceof $)
                    return JSON.stringify(this.serializeArray(obj));
                return JSON.stringify(obj);
            },
            serializeEx: function (els, split1, split2) {
                // / <summary>
                // / els.serialize()增补
                // / </summary>
                // / <param name='els' type='表单元素集合'>
                // / 表单
                // / </param>
                var parts = [], optv;
                els.each(function () {
                    switch (this.type) {
                        case 'select-one':
                        case 'select-multiple':
                            var that = this;
                            $(this).find('option').each(function () {
                                if (this.selected) {
                                    optv = '';
                                    if (this.hasAttribute) {
                                        optv = this.hasAttribute('value') ? this.value : this.text;
                                    } else {
                                        optv = this.attributes['value'].specified ? this.value : this.text;
                                    }
                                    parts.push(that.name + split1 + optv);
                                }
                            });
                            break;
                        case undefined:
                        // case 'hidden':
                        case 'file':
                        case 'submit':
                        case 'reset':
                        case 'button':
                            break;
                        case 'radio':
                        case 'checkbox':
                            if (!this.checked)
                                break;
                        default: // 不包含没有名字的表单字段
                            if (this.name.length) {
                                var val = this.value;
                                var onfocus = $(this).attr('onfocus');
                                if (onfocus && /^wdatepicker/i.test(onfocus) && typeof val === 'string' && val.isDate()) {
                                    val = val.toUTCDate();
                                }
                                parts.push(this.name + split1 + val);
                            }
                    }
                });
                return parts.join(split2);
            }
        }
    });
    // Get
    utils.extend({
        get: {
            guid: function () {
                // / <summary>
                // / 获取guid
                // / </summary>
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
        }
    });
    // UI
    utils.extend({
        ui: {
            message: function (setting) {
                // / <summary>
                // / 消息弹窗
                // / </summary>
                var self = utils.extend({}, {
                    type: '', // warning/error/danger/success/info
                    title: '',
                    content: '',// 消息内容
                    auto: true,// 是否自动消失
                    render: $(document.body)
                }, setting);
                $('#toast-container', $(top.document)).empty();
                var title = self.title;
                if (self.type == 'error') {
                    title = title || '失败';
                } else if (self.type == 'warning') {
                    title = title || '警告';
                } else if (self.type == 'success') {
                    title = title || '成功';
                } else {
                    title = title || '提示';
                }
                if (self.auto) {
                    top.toastr[self.type](self.content, title, {
                        "positionClass": "toast-bottom-right"
                    });
                } else {
                    top.toastr[self.type](self.content, title, {
                        "timeOut": 0,
                        "closeButton": true,
                        "positionClass": "toast-bottom-right"
                    });
                }
            },
            loader: function (setting) {
                // / <summary>
                // / "正在执行，请稍后..."
                // / </summary>
                var myself = utils.extend({}, {
                    render: $(document.body)
                }, setting);
                win.loadtimes++;
                Metronic.blockUI({
                    zIndex: 99999,
                    animate: true,
                    message: '请等待...'
                });
            },
            removeloader: function () {
                win.loadtimes--
                if (win.loadtimes <= 0) {
                    Metronic.unblockUI();
                    win.loadtimes = 0;
                }
            },
            confirm: function (question, callback) {
                var html = '<div class="modal in" id="modal-delete" tabindex="-1" role="dialog" aria-hidden="false" style="display: block;">\
								<div class="modal-backdrop in"></div>\
								<div class="modal-dialog">\
									<div class="modal-content">\
										<div class="modal-header">\
											<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>\
											<h4 class="modal-title">系统消息</h4>\
										</div>\
										<div class="modal-body">' + question + '</div>\
										<div class="modal-footer">\
											<button type="button" class="btn red ok" id="btn-delete" data-dismiss="modal">确定</button>\
											<button type="button" class="btn gray no" data-dismiss="modal">取消</button>\
										</div>\
									</div>\
								</div>\
							</div>';
                var $confirm = $(html);
                $confirm.find('button.close,button.no').click(function () {
                    $confirm.remove();
                });
                $confirm.find('button.ok').click(function () {
                    $confirm.remove();
                    if ($.isFunction(callback)) {
                        callback();
                    }
                });
                $(top.document.body).append($confirm);
            },
            scrollTop: function (el, offeset) {
                utils.asynRun(function () {
                    var pos = (el && el.size() > 0) ? el.offset().top : 0;
                    if (el) {
                        if ($('body').hasClass('page-header-fixed')) {
                            pos = pos - $('.page-header').height();
                        }
                        pos = pos + (offeset ? offeset : -1 * el.height());
                    }
                    $('html,body').animate({
                        scrollTop: pos
                    }, 'slow');
                });

            },
            tabstyle: function (table) {
                $(table).find('tr').click(function () {
                    $(this).addClass('cur-row').siblings().removeClass('cur-row');
                }).filter('.selected').trigger('click');
            },
            checkboxUtils: function ($scope, args) {
                var select_items = args.select_items, all_items = args.all_items, key = args.key, $elem_all = null;
                var _val = function (path) {
                    var r = $scope;
                    var paths = path.split('.');
                    $.each(paths, function () {
                        r = r[this];
                    });
                    return r;
                };
                return {
                    all: function (e, flag) {
                        var that = this;
                        $elem_all = $elem_all || $(e.target);
                        if (!e.target.checked && !flag) {
                            _val(select_items).clear();
                        } else {
                            _val(select_items).clear();
                            $.each(_val(all_items), function () {
                                var val = this[key] || this;
                                if (!that.have(val)) {
                                    _val(select_items).push(val);
                                }
                            });
                        }
                    },
                    one: function (e, id) {
                        if (e.target.checked && !this.have(id)) {
                            _val(select_items).push(id);
                        } else {
                            _val(select_items).remove(id);
                        }
                    },
                    have: function (id) {
                        var flag = false, $target = null;
                        if (id) {
                            $target = $('#' + id);
                            flag = _val(select_items).indexOf(id) >= 0;
                        } else {
                            $target = $elem_all;
                            if (_val(select_items) && _val(all_items)) {
                                flag = _val(select_items).length == _val(all_items).length;
                            }
                        }
                        if (!$target)
                            return flag;
                        if (flag)
                            $target.parent().addClass('checked');
                        else
                            $target.parent().removeClass('checked');
                        return flag;
                    }
                };
            }
        }
    });
    // Validate
    utils.extend({
        validate: {
            message: {
                required: "请输入信息",
                email: "请输入正确格式的电子邮件",
                url: "请输入合法的网址",
                date: "请输入合法的日期",
                number: "请输入合法的数字",
                digits: "只能输入大于0的整数",
                ints: "只能输入整数",
                equalTo: "请再次输入相同的值",
                accept: "请输入拥有合法后缀名的字符串",
                year: "请输入正确的4位数年份",
                maxlength: "请输入一个长度最多是 {0} 的字符串",
                minlength: "请输入一个长度最少是 {0} 的字符串",
                rangelength: "请输入一个长度介于 {0} 和 {1} 之间的字符串",
                range: "请输入一个介于 {0} 和 {1} 之间的值",
                max: "请输入一个最大为 {0} 的值",
                min: "请输入一个最小为 {0} 的值",
                ip: "请输入合法的IP地址",
                cn: "只能输入中文",
                en: "只能输入英文",
                tel: "请输入合法的电话号码",
                mobile: "请输入合法的手机号码",
                idcard: '请输入合法的身份证号码',
                float: "请输入数字或小数点{0}位数"
            },
            checkReset: function (container) {
                container.find('[data-rule]').each(function () {
                    var $el = $(this);
                    if ($el.is(':hidden')) {
                        $el = $el.next(':visible');
                        if ($el.length == 0)
                            $el = $(this);
                    }
                    if ($el.is(':hidden'))
                        return true;
                    var placeholder = $el.attr('placeholder_bak');
                    $el.removeClass('text-danger').attr('placeholder', placeholder).css({
                        'background-color': ''
                    });
                });
            },
            checkInputs: function (container) {
                var self = this;
                if (container.length == 0) {
                    return false;
                }
                var valid = true;
                utils.validate.checkReset(container);
                container.find('[data-rule]').each(function () {
                    var $el = $(this);
                    if ($el.is(':hidden')) {
                        $el = $el.next(':visible');
                        if ($el.length == 0)
                            $el = $(this);
                    }
                    if ($el.is(':hidden'))
                        return true;

                    var rst = self.checkRules($(this));
                    if (rst !== '') {
                        valid = false;
                        var placeholder = $el.attr('placeholder') || '';
                        var title = rst.replace(/^\S*/, '').trim();
                        $el.addClass('text-danger')
                            .attr('title', title)
                            .attr('placeholder_bak', placeholder)
                            .attr('placeholder', (placeholder + ' ' + title).trim()).css({
                                'background-color': '#FFECEC'
                            }).click(function () {
                                $(this).attr('placeholder', placeholder).css({ 'background-color': '' });
                            });
                    }
                });
                if (!valid) {
                    utils.ui.message({
                        type: 'warning',
                        content: '输入的内容不符合要求',
                        title: '请修改后重试!',
                        auto: false
                    });
                }
                return valid;
            },
            checkRules: function (element) {
                var self = this;
                var data_rule = element.attr('data-rule');
                if (data_rule == undefined || data_rule == "") {
                    return "";
                }
                var rules = data_rule.split(',');
                var val = this.elementVal(element);
                var rst = "";
                for (var i = 0; i < rules.length; i++) {
                    var rule;
                    var param = null;
                    if (rules[i].split(':').length > 1) {
                        rule = rules[i].split(':')[0];
                        if (rules[i].indexOf('[') != -1 && rules[i].indexOf(']') != -1) {
                            if (rules[i].indexOf('|') == -1) {
                                throw Error('format:"x:[y|z]"');
                            }
                            param = rules[i].split(':')[1].toString().replace('[', '').replace(']', '').split('|');
                        } else {
                            param = rules[i].split(':')[1];
                        }
                    } else {
                        rule = rules[i];
                    }

                    for (var j in self.methods) {
                        if (rule == j) {
                            if (self.methods[j](val, param, element) === false) {
                                rst = rule + ' ' + String.format(self.message[j], param);
                            }
                            break;
                        }
                    }
                    if (rst !== '')
                        break;
                }
                return rst;
            },
            elementVal: function (element) {
                if (element.is("span") || element.is("label")) {
                    return element.html().trim();
                }
                var type = element.attr("type"), val = element.val();
                if (type === "radio" || type === "checkbox") {
                    var array = new Array();
                    $("input[name='" + element.attr("name") + "']:checked").each(function () {
                        array.push($(this).val());
                    });
                    return array.join(',');
                }

                if (typeof val === "string") {
                    return val.replace(/\r/g, "");
                }

                return val;
            },
            methods: {
                required: function (value) {
                    return $.trim(value).length > 0;
                },
                email: function (value) {
                    if (this.required(value)) {
                        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/i.test(value);
                    } else {
                        return '';
                    }
                },
                mobile: function (value) {
                    if (this.required(value)) {
                        return /^1[3|4|5|8][0-9]\d{4,8}$/.test(value);
                    } else {
                        return '';
                    }
                },
                url: function (value) {
                    if (this.required(value)) {
                        return /^(https?|ftp|file):\/\/[-a-zA-Z0-9+&@#\/%?=~_|$!:,.;]*[a-zA-Z0-9+&@#\/%=~_|$]$/i.test(value);
                    } else {
                        return '';
                    }
                },
                date: function (value) {
                    if (this.required(value)) {
                        return value.isDate();
                    } else {
                        return '';
                    }
                },
                number: function (value) {
                    if (this.required(value)) {
                        return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
                    } else {
                        return '';
                    }
                },
                digits: function (value) {
                    if (this.required(value)) {
                        return /^\d+$/.test(value);
                    } else {
                        return '';
                    }
                },
                ints: function (value) {
                    if (this.required(value)) {
                        return parseInt(value) == value;
                    } else {
                        return '';
                    }
                },
                minlength: function (value, param) {
                    if (this.required(value)) {
                        var length = $.isArray(value) ? value.length : value.toString().trim().length;
                        return length >= param;
                    } else {
                        return '';
                    }
                },
                maxlength: function (value, param) {
                    if (this.required(value)) {
                        var length = $.isArray(value) ? value.length : value.toString().trim().length;
                        return length <= param;
                    } else {
                        return '';
                    }
                },
                rangelength: function (value, param) {
                    if (this.required(value)) {
                        var length = $.isArray(value) ? value.length : value.toString().trim().length;
                        return (length >= param[0] && length <= param[1]);
                    } else {
                        return '';
                    }
                },
                min: function (value, param) {
                    if (this.required(value)) {
                        return value >= param;
                    } else {
                        return '';
                    }
                },
                max: function (value, param) {
                    if (this.required(value)) {
                        return value <= param;
                    } else {
                        return '';
                    }
                },
                range: function (value, param) {
                    if (this.required(value)) {
                        return (value >= parseFloat(param[0]) && value <= parseFloat(param[1]));
                    } else {
                        return '';
                    }
                },
                equalTo: function (value, param) {
                    if (this.required(value)) {
                        var target = $(param);
                        return value === target.val();
                    } else {
                        return '';
                    }
                },
                year: function (value) {
                    if (this.required(value)) {
                        return /^\d{4}$/g.test(value);
                    } else {
                        return '';
                    }
                },
                ip: function (value) {
                    if (this.required(value)) {
                        if ("/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g".test(value)) {
                            if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
                                return true;
                            }
                        }
                        return false;
                    } else {
                        return '';
                    }
                },
                cn: function (value) {
                    if (this.required(value)) {
                        return /^[\u4e00-\u9fa5]*$/.test(value);
                    } else {
                        return '';
                    }
                },
                en: function (value) {
                    if (this.required(value)) {
                        return /^[a-zA-Z]*$/.test(value);
                    } else {
                        return '';
                    }
                },
                tel: function (value) {
                    if (this.required(value)) {
                        return /^(?:\d{11}|(?:\d{3,4}-?)?\d{7,8})$/.test(value);
                    } else {
                        return '';
                    }
                },
                idcard: function (value) {
                    if (this.required(value)) {
                        return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value);
                    } else {
                        return '';
                    }
                },
                float: function (value, param) {
                    if (this.required(value)) {
                        var re = new RegExp("^(?:[1-9]\\d*|0)(?:\.\\d{" + param[0] + "})?$");
                        return re.test(value);
                    } else {
                        return '';
                    }
                }
            }
        }
    });
    // #endregion

    // #region 扩展String方法
    utils.extend(String, {
        format: function () {
            if (arguments.length == 0)
                return '';
            if (arguments.length == 1)
                return arguments[0];
            var reg = /{(\d+)?}/g;
            var args = [];
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] instanceof Array) {
                    for (var j = 0; j < arguments[i].length; j++)
                        args.push(arguments[i][j]);
                } else
                    args.push(arguments[i]);
            }
            var result = arguments[0].replace(reg, function ($0, $1) {
                return args[parseInt($1) + 1];
            });
            return result;
        }
    });
    // #endregion

    // #region 扩展String对象方法
    utils.extend(String.prototype, {
        // 在字符串末尾追加字符串
        append: function (str) {
            // / <summary>
            // / 在字符串末尾追加字符串
            // / </summary>
            // / <param name='str' type='string'>
            // / 追加字的符串
            // / </param>
            return this.concat(str);
        },
        // 删除指定索引位置的字符，索引无效将不删除任何字符
        removeAt: function (index) {
            // / <summary>
            // / 删除指定索引位置的字符，索引无效将不删除任何字符
            // / </summary>
            // / <param name='index' type='int'>
            // / 索引值
            // / </param>
            if (index < 0 || index >= this.length) {
                return this.valueOf();
            } else if (index == 0) {
                return this.substring(1, this.length);
            } else if (index == this.length - 1) {
                return this.substring(0, this.length - 1);
            } else {
                return this.substring(0, index) + this.substring(index + 1);
            }
        },
        // 删除指定索引间的字符串.sIndex和eIndex所在的字符不被删除
        removeAtScope: function (sIndex, eIndex) {
            // / <summary>
            // / 删除指定索引间的字符串.sIndex和eIndex所在的字符不被删除符
            // / </summary>
            // / <param name='sIndex' type='int'>
            // / 起始索引值
            // / </param>
            // / <param name='eIndex' type='int'>
            // / 结束索引值
            // / </param>
            if (sIndex == eIndex) {
                return this.deleteCharAt(sIndex);
            } else {
                if (sIndex > eIndex) {
                    var tIndex = eIndex;
                    eIndex = sIndex;
                    sIndex = tIndex;
                }
                if (sIndex < 0)
                    sIndex = 0;
                if (eIndex > this.length - 1)
                    eIndex = this.length - 1;
                return this.substring(0, sIndex + 1) + this.substring(eIndex, this.length);
            }
        },
        // 比较两个字符串是否相等,其实也可以直接使用==进行比较
        equals: function (str) {
            // / <summary>
            // / 比较两个字符串是否相等,其实也可以直接使用==进行比较
            // / </summary>
            // / <param name='str' type='string'>
            // / 字符串
            // / </param>
            if (this.length != str.length) {
                return false;
            } else {
                for (var i = 0; i < this.length; i++) {
                    if (this.charAt(i) != str.charAt(i)) {
                        return false;
                    }
                }
                return true;
            }
        },
        // 比较两个字符串是否相等，不区分大小写
        equalsIgnoreCase: function (str) {
            // / <summary>
            // / 比较两个字符串是否相等，不区分大小写
            // / </summary>
            // / <param name='str' type='string'>
            // / 字符串
            // / </param>
            if (this.length != str.length) {
                return false;
            } else {
                var tmp1 = this.toLowerCase();
                var tmp2 = str.toLowerCase();
                return tmp1.equals(tmp2);
            }
        },
        // 将指定的字符串插入到指定的位置后面,索引无效将直接追加到字符串的末尾
        insert: function (index, str) {
            // / <summary>
            // / 将指定的字符串插入到指定的位置后面,索引无效将直接追加到字符串的末尾
            // / </summary>
            // / <param name='index' type='int'>
            // / 索引值
            // / </param>
            // / <param name='str' type='string'>
            // / 字符串
            // / </param>
            if (index < 0 || index >= this.length - 1) {
                return this.append(str);
            }
            return this.substring(0, index + 1) + str + this.substring(index + 1);
        },
        // 将指定的位置的字符设置为另外指定的字符或字符串.索引无效将直接返回不做任何处理
        setAt: function (index, str) {
            // / <summary>
            // / 将指定的位置的字符设置为另外指定的字符或字符串.索引无效将直接返回不做任何处理
            // / </summary>
            // / <param name='index' type='int'>
            // / 索引值
            // / </param>
            // / <param name='str' type='string'>
            // / 字符串
            // / </param>
            if (index < 0 || index > this.length - 1) {
                return this.valueOf();
            }
            return this.substring(0, index) + str + this.substring(index + 1);
        },
        // 清除两边的空格
        trim: function () {
            // / <summary>
            // / 清除两边的空格
            // / </summary>
            var char = arguments[0] || '\\s';
            var regex = eval('/(^' + char + '*)|(' + char + '*$)/g');
            return this.replace(regex, '');
        },
        // 除去左边空格
        trimLeft: function () {
            // / <summary>
            // / 除去左边空格
            // / </summary>
            var char = arguments[0] || '\\s';
            var regex = eval('/^' + char + '+/g');
            return this.replace(regex, '');
        },
        // 除去右边空格
        trimRight: function () {
            // / <summary>
            // / 除去右边空格
            // / </summary>
            var char = arguments[0] || '\\s';
            var regex = eval('/' + char + '+$/g');
            return this.replace(regex, '');
        },
        // 逆序
        reverse: function () {
            return this.split('').reverse().join('');
        },
        // 合并多个空白为一个空白
        resetBlank: function () {
            // / <summary>
            // / 合并多个空白为一个空白
            // / </summary>
            var regEx = /\s+/g;
            return this.replace(regEx, ' ');
        },
        // 保留数字
        getNumber: function () {
            // / <summary>
            // / 保留数字
            // / </summary>
            var regEx = /[^\d]/g;
            return this.replace(regEx, '');
        },
        // 保留中文
        getCN: function () {
            // / <summary>
            // / 保留中文
            // / </summary>
            var regEx = /[^\u4e00-\u9fa5\uf900-\ufa2d]/g;
            return this.replace(regEx, '');
        },
        // 保留字母
        getEN: function () {
            // / <summary>
            // / 保留字母
            // / </summary>
            return this.replace(/[^A-Za-z]/g, '');
        },
        // String转化为Int
        toInt: function () {
            // / <summary>
            // / String转化为Int
            // / </summary>
            return isNaN(parseInt(this)) ? this.toString() : parseInt(this);
        },
        // String转化为Float
        toFloat: function () {
            // / <summary>
            // / String转化为Int
            // / </summary>
            return isNaN(parseFloat(this)) ? this.toString() : parseFloat(this);
        },
        // String转化为字符数组
        toCharArray: function () {
            // / <summary>
            // / String转化为字符数组
            // / </summary>
            return this.split('');
        },
        toArray: function (mark) {
            return this.split(mark);
        },
        // String转化为Json对象
        toJson: function () {
            // / <summary>
            // / String转化为Json对象
            // / </summary>
            return JSON.parse(this);
        },
        // 得到字节长度
        getRealLength: function () {
            // / <summary>
            // / 得到字节长度
            // / </summary>
            var regEx = /^[\u4e00-\u9fa5\uf900-\ufa2d]+$/;
            if (regEx.test(this)) {
                return this.length * 2;
            } else {
                var oMatches = this.match(/[\x00-\xff]/g);
                var oLength = this.length * 2 - oMatches.length;
                return oLength;
            }
        },
        // 从左截取指定长度的字串
        left: function (n) {
            // / <summary>
            // / 从左截取指定长度的字串
            // / </summary>
            // / <param name='n' type='number'>
            // / 长度
            // / </param>
            return this.slice(0, n);
        },
        // 从右截取指定长度的字串
        right: function (n) {
            // / <summary>
            // / 从右截取指定长度的字串
            // / </summary>
            // / <param name='n' type='number'>
            // / 长度
            // / </param>
            return this.slice(this.length - n);
        },
        // HTML编码
        htmlEncode: function () {
            // / <summary>
            // / HTML编码
            // / </summary>
            var re = this;
            var q1 = [/x26/g, /x3C/g, /x3E/g, /x20/g];
            var q2 = ['&', '<', '>', ' '];
            for (var i = 0; i < q1.length; i++)
                re = re.replace(q1[i], q2[i]);
            return re;
        },
        // Unicode转化
        ascW: function () {
            // / <summary>
            // / Unicode转化
            // / </summary>
            var strText = '';
            for (var i = 0; i < this.length; i++)
                strText += '&#' + this.charCodeAt(i) + ';';
            return strText;
        },
        // 获取文件全名
        getFileName: function () {
            // / <summary>
            // / 获取文件全名
            // / </summary>
            var regEx = /(^.*)\.[^.]*$/;
            return this.replace(regEx, '$1');
        },
        // 获取文件扩展名
        getExtensionName: function () {
            // / <summary>
            // / 获取文件扩展名
            // / </summary>
            var regEx = /^.*(\.[^.]*$)/g;
            var extension = this.replace(regEx, '$1');
            if (this.equals(extension)) return '';
            return extension;
        },
        // 替换所有
        replaceAll: function (oldstr, newstr) {
            // / <summary>
            // / 替换所有
            // / </summary>
            // / <param name='oldstr' type='string'>
            // / 旧字符
            // / </param>
            // / <param name='newstr' type='string'>
            // / 新字符
            // / </param>
            return this.replace(new RegExp(oldstr, 'gm'), newstr);
        },
        // 是否正整数
        isPositiveInteger: function () {
            // / <summary>
            // / 是否正整数
            // / </summary>
            return (new RegExp(/^[1-9]\d*$/).test(this));
        },
        // 是否整数
        isInteger: function () {
            // / <summary>
            // / 是否整数
            // / </summary>
            return (new RegExp(/^\d+$/).test(this));
        },
        // 是否数字
        isNumber: function (value, element) {
            // / <summary>
            // / 是否数字
            // / </summary>
            return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(this));
        },
        // 是否以某个字符串开始
        startsWith: function (pattern) {
            // / <summary>
            // / 是否以某个字符串开始
            // / </summary>
            return this.indexOf(pattern) === 0;
        },
        // 是否以某个字符串结尾
        endsWith: function (pattern) {
            // / <summary>
            // / 是否以某个字符串结尾
            // / </summary>
            var d = this.length - pattern.length;
            return d >= 0 && this.lastIndexOf(pattern) === d;
        },
        // 是否密码格式
        isValidPwd: function () {
            // / <summary>
            // / 是否密码格式
            // / </summary>
            return (new RegExp(/^([_]|[a-zA-Z0-9]){6,32}$/).test(this));
        },
        // 是否email格式
        isValidMail: function () {
            // / <summary>
            // / 是否email格式
            // / </summary>
            return (new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(this.trim()));
        },
        // 是否手机号码格式
        isPhone: function () {
            // / <summary>
            // / 是否手机号码格式
            // / </summary>
            return (new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/).test(this));
        },
        // 是否是链接
        isUrl: function () {
            // / <summary>
            // / 是否是链接
            // / </summary>
            return (new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(this));
        },
        // 是否是外部链接
        isExternalUrl: function () {
            // / <summary>
            // / 是否是外部链接
            // / </summary>
            return this.isUrl() && this.indexOf('://' + document.domain) == -1;
        },
        // 获取url参数值
        getUrlParm: function (name) {
            // / <summary>
            // / 获取url参数值
            // / </summary>
            name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
            var regexS = '[\\?&]' + name + '=([^&#]*)';
            var regex = new RegExp(regexS);
            var results = regex.exec(this);
            if (results == null)
                return '';
            else
                return results[1];
        },

        contains: function (str) {
            return this.indexOf(str) != -1;
        },
        format: function () {
            array = Array.prototype.slice.call(arguments);
            array.insert(0, this);
            return String.format.apply(null, array);
        },

        clearJSON: function (settings) {
            // / <summary>
            // / 清洗因为JSON转换导致的各种fuck问题
            // / </summary>
            var o = settings || {};
            // 如果当前字符串是utc时间格式，格式化为yyyy-MM-dd
            if (this.isUTCDate()) {
                return this.formatDate(o['date'] || 'yyyy-MM-dd');
            }
            return this;
        },
        toFixed: function (num) {
            if (!num)
                return num;
            var times = Math.pow(10, num);
            var des = this * times + 0.5;
            des = parseInt(des, 10) / times;
            return des + '';
        },
        isDate: function () {
            // / <summary>
            // / 判断是否为Date类型
            // / </summary>
            var date = this.replaceAll("-", "/").replace('+', ' ');
            if (!/^(\d{4})\/([\d]+)\/([\d]+)/.test(date))
                return false;
            var d = new Date(Date.parse(date)).toString();
            return !/Invalid|NaN/.test(d.toString());
        },
        isUTCDate: function () {
            return /^\/Date\([^)]+\)\/$/.test(this);
        },
        toUTCDate: function () {
            if (this.isDate()) {
                var dateStr = this.replaceAll("-", "/").replace('+', ' ');
                return "\/Date(" + new Date(Date.parse(dateStr)).getTime() + "+0800)\/";
            }
            return this;
        },
        toDate: function (format) {
            // / <summary>
            // /
            // 格式化json返回的日期'//Date(NUMBER(+/-)TZD)//'如：'yyyy-MM-dd
            // hh:mm:ss'
            // / </summary>
            if (!this.isUTCDate()) {
                return this;
            }
            var re = /-?\d+/;
            var m = re.exec(this);
            var date = new Date(parseInt(m[0]));

            function myformat(d, f) {
                var o = {
                    'M+': d.getMonth() + 1, // month
                    'd+': d.getDate(), // day
                    'h+': d.getHours(), // hour
                    'm+': d.getMinutes(), // minute
                    's+': d.getSeconds(), // second
                    'q+': Math.floor((d.getMonth() + 3) / 3), // quarter
                    'S': d.getMilliseconds()
                    // millisecond
                };
                if (/(y+)/.test(f)) {
                    f = f.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                for (var k in o)
                    if (new RegExp('(' + k + ')').test(f)) {
                        f = f.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
                    }
                return f;
            }
            format = format || 'yyyy-MM-dd';
            return myformat(date, format);
        }
    });
    // #endregion

    // #region 扩展Number对象方法
    utils.extend(Number.prototype, {
        // 数字补零
        zeroPadding: function (oCount) {
            // / <summary>
            // / 数字补零
            // / </summary>
            // / <param name='oCount' type='int'>
            // / 补零个数
            // / </param>
            var strText = this.toString();
            while (strText.length < oCount) {
                strText = '0' + strText;
            }
            return strText;
        }
    });
    // #endregion

    // #region 扩展Date对象方法
    utils.extend(Date.prototype, {
        // 获取当前时间的中文形式
        getCNDate: function () {
            // / <summary>
            // / 获取当前时间的中文形式
            // / </summary>
            var oDateText = '';
            oDateText += this.getFullYear().LenWithZero(4) + new Number(24180).ChrW();
            oDateText += this.getMonth().LenWithZero(2) + new Number(26376).ChrW();
            oDateText += this.getDate().LenWithZero(2) + new Number(26085).ChrW();
            oDateText += this.getHours().LenWithZero(2) + new Number(26102).ChrW();
            oDateText += this.getMinutes().LenWithZero(2) + new Number(20998).ChrW();
            oDateText += this.getSeconds().LenWithZero(2) + new Number(31186).ChrW();
            oDateText += new Number(32).ChrW() + new Number(32).ChrW() + new Number(26143).ChrW() + new Number(26399).ChrW() + new String('26085199682010819977222352011620845').substr(this.getDay() * 5, 5).ToInt().ChrW();
            return oDateText;
        },
        // 扩展Date格式化
        format: function (format) {
            // / <summary>
            // / 扩展Date格式化
            // / </summary>
            // / <param name='format' type='string'>
            // / format信息
            // / </param>
            format = format || 'yyyy-MM-dd';
            var o = {
                'M+': this.getMonth() + 1, // 月份
                'd+': this.getDate(), // 日
                'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
                'H+': this.getHours(), // 小时
                'm+': this.getMinutes(), // 分
                's+': this.getSeconds(), // 秒
                'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
                'S': this.getMilliseconds()
                // 毫秒
            };
            var week = {
                '0': '\u65e5',
                '1': '\u4e00',
                '2': '\u4e8c',
                '3': '\u4e09',
                '4': '\u56db',
                '5': '\u4e94',
                '6': '\u516d'
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(format)) {
                format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[this.getDay() + '']);
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                }
            }
            return format;
        },
        // 计算时差
        diff: function (objDate, interval) {
            // / <summary>
            // / 计算时差
            // / </summary>
            // / <param name='objDate' type='Date'>
            // / 目标时间
            // / </param>
            // / <param name='interval' type='string'>
            // / 时差类型（s,m,h,day,week,month,year）
            // / </param>
            // 若参数不足或 objDate 不是日期类型則回传 undefined
            if (arguments.length < 2 || objDate.constructor != Date) {
                return undefined;
            }
            switch (interval) {
                // 计算秒差
                case 's':
                    return parseInt((objDate - this) / 1000);
                // 计算分差
                case 'm':
                    return parseInt((objDate - this) / 60000);
                // 计算時差
                case 'h':
                    return parseInt((objDate - this) / 3600000);
                // 计算日差
                case 'day':
                    return parseInt((objDate - this) / 86400000);
                // 计算周差
                case 'week':
                    return parseInt((objDate - this) / (86400000 * 7));
                // 计算月差
                case 'month':
                    return (objDate.getMonth() + 1) + ((objDate.getFullYear() - this.getFullYear()) * 12) - (this.getMonth() + 1);
                // 计算年差
                case 'year':
                    return objDate.getFullYear() - this.getFullYear();
                // 输入有误
                default:
                    return undefined;
            }
        }
    });
    // #endregion

    // #region 扩展Array对象方法
    utils.extend(Array.prototype, {
        // 数字数组由大到小排序
        maxToMin: function () {
            // / <summary>
            // / 数字数组由大到小排序
            // / </summary>
            var oValue;
            for (var i = 0; i < this.length; i++) {
                for (var j = 0; j <= i; j++) {
                    if (this[i] > this[j]) {
                        oValue = this[i];
                        this[i] = this[j];
                        this[j] = oValue;
                    }
                }
            }
            return this;
        },
        // 数字数组由小到大排序
        minToMax: function () {
            // / <summary>
            // / 数字数组由小到大排序
            // / </summary>
            var oValue;
            for (var i = 0; i < this.length; i++) {
                for (var j = 0; j <= i; j++) {
                    if (this[i] < this[j]) {
                        oValue = this[i];
                        this[i] = this[j];
                        this[j] = oValue;
                    }
                }
            }
            return this;
        },
        // 获得数字数组中最大项
        getMax: function () {
            // / <summary>
            // / 获得数字数组中最大项
            // / </summary>
            var oValue = 0;
            for (var i = 0; i < this.length; i++) {
                if (this[i] > oValue) {
                    oValue = this[i];
                }
            }
            return oValue;
        },
        // 获得数字数组中最小项
        getMin: function () {
            // / <summary>
            // / 获得数字数组中最小项
            // / </summary>
            var oValue = 0;
            for (var i = 0; i < this.length; i++) {
                if (this[i] < oValue) {
                    oValue = this[i];
                }
            }
            return oValue;
        },
        // 将数据批量加入到数据
        pushRange: function (items) {
            // / <summary>
            // / 将数据批量加入到数据
            // / </summary>
            // / <param name='items' type='array'>
            // / 数组子项集合
            // / </param>
            var length = items.length;

            if (length != 0) {
                for (var index = 0; index < length; index++) {
                    this.push(items[index]);
                }
            }
            return this;
        },
        // 清空数组
        clear: function () {
            // / <summary>
            // / 清空数组
            // / </summary>
            if (this.length > 0) {
                this.splice(0, this.length);
            }
        },
        // 数组是否为空
        isEmpty: function () {
            // / <summary>
            // / 数组是否为空
            // / </summary>
            if (this.length == 0)
                return true;
            else
                return false;
        },
        // 复制一个同样的数组
        clone: function () {
            // / <summary>
            // / 复制一个同样的数组
            // / </summary>
            var clonedArray = [];
            var length = this.length;

            for (var index = 0; index < length; index++) {
                clonedArray[index] = this[index];
            }
            return clonedArray;
        },
        // 是否包含某一项
        contains: function (item) {
            // / <summary>
            // / 是否包含某一项
            // / </summary>
            // / <param name='item' type='object'>
            // / 数组子项
            // / </param>
            var index = this.indexOf(item);
            return (index >= 0);
        },
        // 找到数组中某一项索引
        indexOf: function (item) {
            // / <summary>
            // / 找到数组中某一项索引
            // / </summary>
            // / <param name='item' type='object'>
            // / 数组子项
            // / </param>
            var length = this.length;

            if (length != 0) {
                for (var index = 0; index < length; index++) {
                    if (this[index] == item) {
                        return index;
                    }
                }
            }
            return -1;
        },
        // 将数据项插入到指定索引
        insert: function (index, item) {
            // / <summary>
            // / 将数据项插入到指定索引
            // / </summary>
            // / <param name='index' type='int'>
            // / 索引值
            // / </param>
            // / <param name='item' type='object'>
            // / 数组子项
            // / </param>
            this.splice(index, 0, item);
        },
        // 获得将数组每一项末尾追加字符的数组
        joinstr: function (str) {
            // / <summary>
            // / 获得将数组每一项末尾追加字符的数组
            // / </summary>
            // / <param name='str' type='string'>
            // / 追加的字符
            // / </param>
            var new_arr = new Array(this.length);
            for (var i = 0; i < this.length; i++) {
                new_arr[i] = this[i] + str;
            }
            return new_arr;
        },
        // 删除指定数据项
        remove: function (item) {
            // / <summary>
            // / 删除指定数据项
            // / </summary>
            // / <param name='item' type='object'>
            // / 数组子项
            // / </param>
            var index = this.indexOf(item);

            if (index >= 0) {
                this.splice(index, 1);
            }
        },
        // 通过索引删除指定数据项
        removeAt: function (index) {
            // / <summary>
            // / 删除指定数据项
            // / </summary>
            // / <param name='index' type='int'>
            // / 索引值
            // / </param>
            this.splice(index, 1);
        },
        // each是一个集合迭代函数，它接受一个函数作为参数和一组可选的参数
        // 这个迭代函数依次将集合的每一个元素和可选参数用函数进行计算，并将计算得的结果集返回
        each: function (fn) {
            // / <summary>
            // / each是一个集合迭代函数，它接受一个函数作为参数和一组可选的参数
            // / 这个迭代函数依次将集合的每一个元素和可选参数用函数进行计算，并将计算得的结果集返回
            // / 例：var a = [1,2,3,4].each(function(x){return x < 0 ? x : null});
            // / </summary>
            // / <param name='fn' type='function'>
            // / 筛选方法
            // / </param>
            // / <param name='param' type='object'>
            // / 零个或多个可选的用户自定义参数
            // / </param>
            fn = fn || Function.K;
            var a = [];
            var args = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < this.length; i++) {
                var res = fn.apply(this, [this[i], i].concat(args));
                if (res != null)
                    a.push(res);
            }
            return a;
        },
        // 得到一个数组不重复的元素集合
        uniquelize: function () {
            // / <summary>
            // / 得到一个数组不重复的元素集合
            // / </summary>
            var ra = new Array();
            for (var i = 0; i < this.length; i++) {
                if (!ra.contains(this[i])) {
                    ra.push(this[i]);
                }
            }
            return ra;
        },
        replaceKV: function (item) {
            $.each(this, function () {
                if (this.Field.equalsIgnoreCase(item.Field))
                    this.Value = item.Value;
            });
            return this;
        }
    });
    utils.extend(Array, {
        // 求两个集合的补集
        complement: function (a, b) {
            // / <summary>
            // / 求两个集合的补集
            // / </summary>
            // / <param name='a' type='array'>
            // / 集合a
            // / </param>
            // / <param name='b' type='array'>
            // / 集合b
            // / </param>
            return Array.minus(Array.union(a, b), Array.intersect(a, b));
        },
        // 求两个集合的交集
        intersect: function (a, b) {
            // / <summary>
            // / 求两个集合的交集
            // / </summary>
            // / <param name='a' type='array'>
            // / 集合a
            // / </param>
            // / <param name='b' type='array'>
            // / 集合b
            // / </param>
            return a.uniquelize().each(function (o) {
                return b.contains(o) ? o : null;
            });
        },
        // 求两个集合的差集
        minus: function (a, b) {
            // / <summary>
            // / 求两个集合的差集
            // / </summary>
            // / <param name='a' type='array'>
            // / 集合a
            // / </param>
            // / <param name='b' type='array'>
            // / 集合b
            // / </param>
            return a.uniquelize().each(function (o) {
                return b.contains(o) ? null : o;
            });
        },
        // 求两个集合的并集
        union: function (a, b) {
            // / <summary>
            // / 求两个集合的并集
            // / </summary>
            // / <param name='a' type='array'>
            // / 集合a
            // / </param>
            // / <param name='b' type='array'>
            // / 集合b
            // / </param>
            return a.concat(b).uniquelize();
        }
    });
    // #endregion

    // #region 扩展jQuery方法

    utils.extend($, {
        isNull: function (obj) {
            return obj == undefined || obj == null;
        },
        isEmpty: function (obj) {
            return $.isNull(obj) || obj == '';
        }
    });

    // #endregion

    win.utils = win.$$ = utils;

})(window, jQuery);