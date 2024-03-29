"use strict";


var
    error_msg = 'something unusual here',
    thumb_size = [100, 200, 200],
createdObjectURL=[],
    canvas_stickers = {
        smiling:
            `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-smile"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`
        ,
        text:
            `<svg width="200" height="200" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layers" xmlns="http://www.w3.org/2000/svg">
<text xml:space="preserve" style="font-size:29.2246px;line-height:1.25;font-family:Roboto;-inkscape-font-specification:Roboto;fill:#000;fill-opacity:1;stroke:none;stroke-width:1.46123" x="-11.021" y="23.108" transform="matrix(.58121 -.83783 .80579 .55899 0 0)">
 <tspan x="-11.021" y="23.108" style="stroke-width:1.46123">n</tspan></text>
</svg>
`
    },
    canvas_low_resolution = 0,
    canvas_display_thumb = 1,
    canvas_defaults = function (r) {
        // r()
        getSticker("smiling", void 0, {
            ImgCssText: '',
            ParentCssText: 'top:100px;'
        }).then(_onload)
        getText.load("Lorem ipsum dolor", {
            ImgCssText: 'text-align:center;',
            ParentCssText: 'top:300px;'
        })
        getText.load("Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam delectus harum dolorum ipsum. Ad, ipsum ex!", {
            ImgCssText: 'font-size:24px;font-weight:600;text-align:center;',
            ParentCssText: 'top:360px;'
        })



        // var img = new Image();
        // img.src = "./image/1.png";
        // img.onload = function () {
        //     imageToCanvas(img, r, void 0, { name: "default" });
        // }
    },
    canvas_types = {
        IMAGEDATA: "imagedata",
        TEXT: "text",
        BLOB: "blob"
    },
    canvas_state = [],
    canvas_reshape = {
        center: function (event, elm) {
            var e = elm.parentElement;
            var PRVX;
            var PRVY;
            canvas_board[canvas_events.mousemove] = function (ev) {
                ev.preventDefault()
                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }

                e.style.top = (e.offsetTop + (ev.movementY * (transform_speed) || 0)) + 'px'
                e.style.left = (e.offsetLeft + (ev.movementX * (transform_speed) || 0)) + 'px'
                // e.scrollIntoViewIfNeeded(true)
            }
        },
        rotate: function (event, elm) {
            var e = elm.parentElement;
            var PRVX;
            var PRVY;
            canvas_board[canvas_events.mousemove] = function (ev) {
                ev.preventDefault()
                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }

                var df = e.style.transform
                df = Number(df.replace(/rotate\(([^\)]*)(deg)?\)/img, '$1').replace(/[a-z]/img, '')) || 0

                // df=df-(ev.movementY*ev.movementX);
                df = (df - ((ev.movementX+ev.movementY)*Math.PI));
// console.log(ev.movementX,ev.movementY,df);
                e.style.transform = e.style.transform.
                    replace(/(rotate\()([^\)]*)(deg)?(\))/img, '$1' + df + "deg" + '$4')
                // console.log(e.style.transform);
            }
        },
        "right_imagedata": function (event, elm) {
            var PRVX;
            var PRVY;
            var p = elm.parentElement

            canvas_board[canvas_events.mousemove] = function (ev) {
                ev.preventDefault()
                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }
                p.style.height = p.offsetHeight + "px"
                p.style.width = (p.offsetWidth + ((ev.movementX * transform_speed || 0))) + "px";
            }
        },
        "bottom_imagedata": function (event, elm) {
            var PRVX;
            var PRVY;
            var p = elm.parentElement

            canvas_board[canvas_events.mousemove] = function (ev) {
                ev.preventDefault()
                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }
                p.style.width = p.offsetWidth + "px";
                p.style.height = (p.offsetHeight + ((ev.movementY * transform_speed || 0))) + "px";
            }
        },
        "bottom-right_imagedata": function (event, elm) {
            var p = elm.parentElement
            var PRVX;
            var PRVY;

            canvas_board[canvas_events.mousemove] = function (ev) {
                ev.preventDefault()
                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }

                p.style.width = (p.offsetWidth + (((ev.movementY+ev.movementX) * transform_speed || 0))) + "px";
                p.style.height = "auto";

            }
        },
        "bottom-right_blob": function (event, elm) {
            var p = elm.parentElement
            var PRVX;
            var PRVY;
            var c = p.querySelector('img')
            if (c) {
                var _c = offscreenCanvas(c.offsetWidth, c.offsetHeight, true)
                _c.getContext('2d').drawImage(c, 0, 0, _c.width, _c.height)
                c.replaceWith(_c)
                _c = void 0
            }
            canvas_board[canvas_events.mousemove] = function (ev) {
                ev.preventDefault()

                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }

                p.style.width = (p.offsetWidth + (((ev.movementY+ev.movementX) * transform_speed || 0))) + "px";
                p.style.height = "auto";

            }
        },
        "bottom-right_text": function (event, elm) {
            var p = elm.parentElement.querySelector('span');

            var PRVX;
            var PRVY;
            canvas_board[canvas_events.mousemove] = function (ev) {
                ev.preventDefault()

                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }
                // font: 900 85px serif;
                p.style.fontSize = (Number(p.style.fontSize.replace(/[a-z]/img, '')) + (((ev.movementY+ev.movementX) * transform_speed || 0))) + "px";
                // p.style.width = (p.offsetWidth + m) + "px";

                // p.parentElement.style.width = p.offsetWidth+"px"//(p.offsetWidth + ((ev.movementX || ev.webkitMovementX || -1))) + "px";
            }
        },
        "right_text": function (event, elm) {
            var PRVX;
            var PRVY;
            var p = elm.parentElement
            canvas_board[canvas_events.mousemove] = function (ev) {
                ev.preventDefault()

                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }
                // p.style.height = p.offsetHeight + "px"
                p.style.width = (p.offsetWidth + ((ev.movementX * transform_speed || 0))) + "px";
            }
        }
    },
    canvas_reshape_active = function (elm, event) {
        var d = elm.getAttribute('d');
        var _d = d + '_' + elm.parentElement.parentElement._type.toLowerCase();
        // console.log(_d);
        (canvas_reshape[_d] || (_d = d, void 0) || canvas_reshape[d])(event, elm.parentElement);
        document.documentElement.setAttribute('interacting', '1')

        elm.ondrag = function () {
            elm.ondrag = canvas_board[canvas_events.mouseleave] = canvas_board[canvas_events.mouseup] = elm[canvas_events.mouseleave] = canvas_board[canvas_events.mousemove] = null
            canvas_board.click()
            update(elm.parentElement.parentElement, _d)
            document.documentElement.removeAttribute('interacting')
        }
        // console.log(canvas_events);
        canvas_board[canvas_events.mouseleave] = canvas_board[canvas_events.mouseup] = function () {
            canvas_board[canvas_events.mouseleave] = canvas_board[canvas_events.mouseup] = elm[canvas_events.mouseleave] = canvas_board[canvas_events.mousemove] = null
            update(elm.parentElement.parentElement, _d)
            document.documentElement.setAttribute('interacting', "0")
        }
    }

let canvas = document.createElement('canvas')
let canvas_div = document.createElement('div')
let canvas_ctrl = document.createElement('div')
canvas_ctrl.setAttribute("controller", "")
canvas_ctrl.innerHTML = `
<div d="center" hidden></div>
<div d="bottom" hidden></div>
<div d="right" hidden></div>
<div d="bottom-right" hidden></div>
<div d="rotate" hidden></div>
`

canvas_ctrl.querySelectorAll('div').forEach(function (e) {
    var d = e.getAttribute('d')
    if (canvas_reshape.hasOwnProperty(d)) {
        e.setAttribute(canvas_events.mousedown, `canvas_reshape_active(this,event);`)
    }
    for (var key in canvas_types) {
        if (canvas_reshape.hasOwnProperty(d + "_" + canvas_types[key])) {
            e.setAttribute(canvas_events.mousedown, `canvas_reshape_active(this,event);`)
        }
    }
})


canvas_wrapper._remove = function () {
    var pa = canvas_wrapper.querySelector('[interacting] div[active]');
    if (pa) {
        pa[canvas_events.mouseup] = pa[canvas_events.mousedown] = null
        pa.removeAttribute('active')
        pa.querySelector('[controller]').remove()
        pa = void 0
        document.documentElement.removeAttribute('interacting')
        document.documentElement.removeAttribute('type')
    }
}

canvas_wrapper._append = function (e) {
    e.onclick = function () {
        if (e.hasAttribute('active')) {
            return
        }
        canvas_wrapper._remove();
        document.documentElement.setAttribute('interacting', "0")
        document.documentElement.setAttribute('type', e._type)

        e.setAttribute("active", "")
        var _canvas_ctrl = canvas_ctrl.cloneNode(true)

        for (var key in canvas_reshape) {
            key = key.split('_')
            if (!key[1] || key[1] == e._type.toLowerCase()) {
                _canvas_ctrl.querySelector('[d="' + key[0] + '"]').removeAttribute("hidden")
            }
        }

        key = void 0

        e.appendChild(_canvas_ctrl)

        e[canvas_events.mouseup] = function () {
            canvas_board[canvas_events.mousemove] = null
        }

        canvas_board.onclick = function (e) {
            if (e.target === this || e.target === canvas_wrapper) {
                canvas_wrapper._remove();
                canvas_board.onclick = null
            }
        }
    }
    var d;
    if (d = this.querySelector('[_id="' + e._id + '"]')) {
        d.replaceWith(e)
        d = d.hasAttribute('active')
    } else {
        this.appendChild(e)
    }

    if (d) {
        e.click()
        d = void 0
    }
}


function insert(data) {
    canvas = canvas.cloneNode();
    canvas.width = data.width
    canvas.height = data.height
    canvas.getContext('2d').putImageData(data, 0, 0)
    canvas_wrapper.appendChild(canvas)
}

function imageToCanvas(img, r, both, info, val, style) {
    /**
     * @TODO @remove @r
     */
    var thumb
    var thumb_1
    var blob

    if (img instanceof Array) {
        blob = img[0]
        img = img[1]
    }
    var cnv;
    var _canvas;

    if (blob && img instanceof HTMLImageElement) {
        _canvas = img
    } else {
        _canvas = canvas.cloneNode();
        _canvas.width = img.width
        _canvas.height = img.height
        void _canvas.getContext('2d').drawImage(img, 0, 0, _canvas.width, _canvas.height)
    }

    var size_1 = canvas_roundup_size(thumb_size[1], _canvas.width, _canvas.height)
    var size;

    if (blob) {
        size = canvas_roundup_size(thumb_size[2], _canvas.width, _canvas.height)
    } else {
        size = canvas_roundup_size(thumb_size[0], _canvas.width, _canvas.height)
    }

    thumb = offscreenCanvas(size.width, size.height, true)
    thumb.getContext('2d').drawImage(_canvas, 0, 0, thumb.width, thumb.height)

    thumb_1 = offscreenCanvas(size_1.width, size_1.height, true)
    thumb_1.getContext('2d').drawImage(_canvas, 0, 0, thumb_1.width, thumb_1.height)
    cnv = _canvas

  if (!(_canvas instanceof HTMLImageElement)) {
    if (canvas_display_thumb === 0) {
        cnv = thumb
    } else if (canvas_display_thumb === 1) {
        cnv = thumb_1
    }
  }

    if (typeof img.close === "function") {
        void img.close()
    }

    img = void 0

    var _canvas_div = canvas_div.cloneNode(true)
    void _canvas_div.appendChild(cnv)
    void _canvas_div.setAttribute('default', canvas_types.IMAGEDATA)


    return _zIdexCore(both || _zIdexCore.both).then(function (id) {
        _canvas_div._id = id[0]
        if (blob) {
            _canvas_div._type = canvas_types.BLOB
        } else {
            _canvas_div._type = canvas_types.IMAGEDATA
        }
        void canvas_wrapper._append(_canvas_div)

        _canvas_div.style.width = `${_canvas_div.offsetWidth}px`
        _canvas_div.style.height = `${_canvas_div.offsetHeight}px`
        _canvas_div.style.left = `${_canvas_div.offsetLeft - (_canvas_div.offsetWidth / 2)}px`
        _canvas_div.style.top = `${_canvas_div.offsetTop - (_canvas_div.offsetHeight / 2)}px`
        if (style && style.ParentCssText) {
            _canvas_div.style.cssText += style.ParentCssText
        }
        void _canvas_div.removeAttribute('default')

        _canvas_div.style.transform = "rotate(0deg)"
        _canvas.style.backgroundColor = "rgba(0,0,0,0)"
        if (style && style.ImgCssText) {
            _canvas.style.cssText += style.ImgCssText
        }
        style = void 0
         new Promise(function () {
            db.log.setItem(_canvas_div._id, val || {
                original_height: _canvas.height,
                original_width: _canvas.width,
                height: _canvas_div.offsetHeight,
                width: _canvas_div.offsetWidth,
                x: _canvas_div.offsetLeft,
                y: _canvas_div.offsetTop,
                transform: _canvas_div.style.transform,
                backgroundColor: _canvas.style.backgroundColor,
                info: info,
                data: id[1],
                type: _canvas_div._type
            }).then(arguments[0])
            void db.style.setItem(id[1], "")

        })
            .then(function () {
                r = void 0;

                if (blob) {
                    void db.object.setItem(id[1], blob)
                } else {
                    void db.object.setItem(id[1], _canvas.getContext('2d').getImageData(0, 0, _canvas.width, _canvas.height))
                    loadImageData.replicate(void 0, cnv, void 0, {
                        width: _canvas_div.offsetWidth,
                        height: _canvas_div.offsetHeight
                    }, 'load', canvas_low_resolution)
                }


                void db.object_thumb.setItem(id[1], thumb.getContext('2d').getImageData(0, 0, thumb.width, thumb.height))
                void db.object_thumb_medium.setItem(id[1], thumb_1.getContext('2d').getImageData(0, 0, thumb_1.width, thumb_1.height))

                cnv = info = size_1 = size = thumb = thumb_1 = _canvas_div = _canvas = id = void 0;
            });

    });
}

function getImage() {
    openFs().then(function (e) {
        var info = { name: e.filename, type: e.type, size: e.size }
        createImageBitmap(e).then(function (e) {
            imageToCanvas(e, void 0, _zIdexCore.both, info)
            info = e = void 0
        });
        e = void 0
    });
}

function getBlob() {
    openFs().then(function (b) {
        createImageBitmap(b).then(function (e) {
            imageToCanvas([b, e], void 0, _zIdexCore.both, { name: b.filename, type: b.type, size: b.size })
            b = e = void 0;
        });
    });
}

function getSticker(name) {
    if (canvas_stickers.hasOwnProperty(name)) {
        return getSticker.load(canvas_stickers[name], name, arguments[1], arguments[2])
    }
}

getSticker.load = function (b, name, r, style) {
    return new Promise(function (r) {
        if (!(b instanceof Blob)) {
            b = new Blob([b], { type: 'image/svg+xml' });
        }
        var img = new Image()
        img.src = URL.createObjectURL(b)

        img.onload = function () {
            URL.revokeObjectURL(img.src)
            imageToCanvas([b, img], r, _zIdexCore.both, { name: name, type: b.type, size: b.size }, void 0, style)
                .then(r)
            style = r = b = void 0;
            // createImageBitmap(img).then(function (e) {
            //         });
        }
    });
}

function _getImage() {
    var img = new Image();
    img.src = "image/1.png"
    img.onload = function () {
        imageToCanvas(img, void 0, _zIdexCore.both)
    }
}

function getText(txt, style) {
    var txt = prompt("Enter Text");
    if ('string' !== typeof txt) {
        return
    }

    txt = txt || "New Text"
    txt = txt.trim()
    return getText.load(txt, style)
}

getText.load = function (txt, style) {
    return new Promise(function (r) {
        if ('string' !== typeof txt || !txt.trim()) {
            r()
            return
        }
        txt = txt

        var span = document.createElement("span")
        span.innerText = txt

        txt = void 0;

        span.style.fontSize = "40px"
        span.style.fontFamily = "sans-serif"
        span.style.fontWeight = "900"
        span.style.color = "rgba(0,0,0,255)"
        span.style.textAlign=''
        span.style.backgroundColor = "rgba(255,255,255,0)";

        if (style && style.ImgCssText) {
            span.style.cssText += style.ImgCssText
        }

        var _canvas_div = canvas_div.cloneNode(true)
        void _canvas_div.setAttribute('default', canvas_types.TEXT)

        _canvas_div.appendChild(span)

        void _zIdexCore(_zIdexCore.both).then(function (id) {
            _canvas_div._id = id[0]
            _canvas_div._type = canvas_types.TEXT
            canvas_wrapper._append(_canvas_div)

            _canvas_div.style.width = `${(span.offsetWidth + 2)}px`
            // _canvas_div.style.width = `auto`
            _canvas_div.style.left = `${(_canvas_div.offsetLeft - (_canvas_div.offsetWidth / 2))}px`
            _canvas_div.style.top = `${(_canvas_div.offsetTop - (_canvas_div.offsetHeight / 2))}px`

            if (style && style.ParentCssText) {
                _canvas_div.style.cssText += style.ParentCssText
            }
            style = void 0
            void _canvas_div.removeAttribute('default')

            _canvas_div.style.transform = 'rotate(0deg)'
            
            void db.style.setItem(id[1], "")
            db.log.setItem(_canvas_div._id, {
                original_style: span.style.cssText,
                fontWeight: span.style.fontWeight,
                fontSize: span.style.fontSize,
                fontFamily: span.style.fontFamily,
                textAlign: span.style.textAlign,
                color: span.style.color,
                // transform: _canvas_div.style.transform,
                backgroundColor: span.style.backgroundColor,
                width: _canvas_div.offsetWidth,
                height: _canvas_div.offsetHeight,
                transform: _canvas_div.style.transform,
                x: _canvas_div.offsetLeft,
                y: _canvas_div.offsetTop,
                data: id[1],
                type: _canvas_div._type
            }).then(function () {
                db.object.setItem(id[1], span.innerText)
                id = void 0;
                r()
            });

        });
    });
}

function loadStyleSheet(elm) {
    void elm.removeAttribute('hidden')
    //
}

function loadImageData(data, id, foo, _canvas_div) {
    var _data;
    if (id instanceof Array) {
        _data = id[1]
        id = id[0]
    }

    var _canvas;


    _canvas_div.style.width = `${data.width}px`
    _canvas_div.style.height = `${data.height}px`
    _canvas_div.style.left = `${data.x}px`
    _canvas_div.style.top = `${data.y}px`
    _canvas_div.style.transform = `${data.transform}`

    _canvas_div._id = id
    _canvas_div._type = data.type
    var _load = function (e) {
        if (e) {
            void loadImageData.replicate(e, _canvas, void 0, data, 'reset')
        }
        void loadImageData.replicate(data.data, _canvas, void 0, data, 'reset', canvas_low_resolution);
        if (canvas_display_thumb === 0 || canvas_display_thumb === 1) {
        }

        if (foo) {
            void foo(_canvas_div)
            foo = void 0
        }
        void loadStyleSheet(_canvas)
        _canvas_div = _canvas = void 0
        _load = id = data = void 0
    }   
    _canvas = canvas.cloneNode()
    _canvas.style.backgroundColor = `${data.backgroundColor}px`
    void _canvas.setAttribute('hidden', "")
    _canvas_div.appendChild(_canvas)

    if (_data) {
        if (!(_data instanceof ImageData) && !(_data instanceof Blob)) {
            if (_data instanceof HTMLCanvasElement) {
                _canvas.replaceWith(_data)
                _canvas = _data
                _canvas.style.backgroundColor = `${data.backgroundColor}px`
            } else {
                // _canvas = canvas.cloneNode()
                _canvas.width = _data.width
                _canvas.height = _data.height
                _canvas.getContext('2d').drawImage(_data, 0, 0, _canvas.width, _canvas.height)
            }
            _data = void 0
        } else {
            //   _canvas = canvas.cloneNode()
        }
        // void _canvas.setAttribute('hidden', "")
        // _canvas_div.appendChild(_canvas)
        _load(_data)
        _data = void 0
    } else {
        // _canvas = canvas.cloneNode()
        // void _canvas.setAttribute('hidden', "")
        // _canvas_div.appendChild(_canvas)
        var _db;
        if (canvas_display_thumb === 0) {
            _db = db.object_thumb
        } else if (canvas_display_thumb === 1) {
            _db = db.object_thumb_medium
        } else {
            _db = db.object
        }
        void _db.getItem(data.data).then(function (e) {
        // console.log(e);
            if (!e) {
                void console.error(error_msg)
                return e = void 0
            }
            _load(e)
            e = void 0
        })
        _db = void 0
    }
}
loadImageData.replicate = function (e, _canvas, cnv, data, type, lowResolution) {
    if (lowResolution) {
        // throw "running on low resolution!"
        return console.log("running on low resolution!")
    }

    if ('number' === typeof e) {
        return new Promise(function (r) {
            void db.object.getItem(e).then(function (e) {
                if (!e) {
                    void console.error(error_msg)
                    return e = void 0
                }
                void loadImageData.replicate(e, _canvas, cnv, data, type)
                r(lowResolution = type = _canvas = data = cnv = e = void 0)
            })
        });
    }

    if (e instanceof Blob) {
        var image
        if (data) {
            image = new Image(data.width, data.height)
        } else {
            image = new Image(_canvas.width, _canvas.height)
        }

        image.src = URL.createObjectURL(e)
        image.style.cssText = _canvas.style.cssText
        image.onload = function () {
            URL.revokeObjectURL(this.src)
            _canvas.replaceWith(this)
            _canvas = void 0
        }
        image = type = data = cnv = e = void 0
        return
    }

    if (!cnv) {
        cnv = offscreenCanvas(_canvas.width, _canvas.height);
    }

    if (e) {
        cnv.width = e.width
        cnv.height = e.height
    } else if (data) {
        cnv.width = data.width
        cnv.height = data.height
    }

    if (e instanceof ImageData) {
        void cnv.getContext('2d').putImageData(e, 0, 0)
    } else {
        if (e) {
            void cnv.getContext('2d').drawImage(e, 0, 0, cnv.width, cnv.height)
        } else {
            void cnv.getContext('2d').drawImage(_canvas, 0, 0, cnv.width, cnv.height)
        }
    }

    if (type === "reset" || type === "update" && data) {
        _canvas.width = data.width
        _canvas.height = data.height
    }
    void _canvas.getContext('2d').drawImage(cnv, 0, 0, _canvas.width, _canvas.height)
    cnv.getContext('2d').clearRect(0, 0, cnv.width, cnv.height)
    type = _canvas = data = cnv = e = void 0
}

function loadText(data, id, foo, _canvas_div) {
    var span = document.createElement("span")
    void span.setAttribute('hidden', "")

    _canvas_div._id = id
    _canvas_div._type = data.type
    _canvas_div.style.left = `${data.x}px`
    _canvas_div.style.top = `${data.y}px`
    _canvas_div.style.width = `${data.width}px`
    _canvas_div.style.transform = `${data.transform}`

    span.style.color = data.color
    span.style.backgroundColor = data.backgroundColor
    span.style.fontSize = data.fontSize
    span.style.fontWeight = data.fontWeight
    span.style.fontFamily = data.fontFamily
    span.style.textAlign = data.textAlign


    void db.object.getItem(data.data).then(function (e) {
        if (typeof e !== "string") {
            console.error('something unusual here')
            return void 0
        }

        span.innerText = e
        e = void 0

        void _canvas_div.appendChild(span)

        if (foo) {
            foo(_canvas_div)
            foo = void 0
        }

        void loadStyleSheet(span)
        data = void 0
    });
}

function updatePixels(e, elm) {
    var c = elm.querySelector('canvas')

    var cnv = canvas.cloneNode();

    cnv.width = e.width
    cnv.height = e.height
    cnv.getContext('2d').drawImage(c, 0, 0, cnv.width, cnv.height)

    c.width = e.width
    c.height = e.height

    c.getContext('2d').drawImage(cnv, 0, 0, c.width, c.height)
    void loadImageData.replicate(e.data, c, cnv, void 0, 'update', canvas_low_resolution)
    cnv = c = void 0
    e = void 0
}

function updateImagePixels(e, elm) {
    console.error(error_msg)
}

function update(elm, type) {
    db.log.getItem(elm._id).then(function (e) {
        if (!e) {
            console.error('something unusual!!!')
            return
        }
        if (type === 'center') {
            e.x = elm.offsetLeft
            e.y = elm.offsetTop
        } else if (type === 'rotate') {
            e.transform = elm.style.transform
        } else if (type.match(/^(bottom_imagedata|right_imagedata|bottom\-right_imagedata)$/)) {
            e.width = elm.offsetWidth;
            e.height = elm.offsetHeight;
            void updatePixels(e, elm)
        } else if (type.match(/^(bottom\-right_blob)$/)) {
            e.width = elm.offsetWidth;
            e.height = elm.offsetHeight;
            if (elm.querySelector('canvas')) {
                void updatePixels(e, elm)
            } else {
                void updateImagePixels(e, elm)
            }
        } else if (type.match(/^(bottom-right_text)$/)) {
            var c = elm.querySelector('span')
            e.fontSize = c.style.fontSize
            e.width = elm.offsetWidth
            e.height = elm.offsetHeight
        } else if (type.match(/^(right_text)$/)) {
            e.width = elm.offsetWidth
            e.height = elm.offsetHeight
        } else {
            console.error('something unusual!!!')
        }
        db.log.setItem(elm._id, e)
        db.detail.setItem('last modified date', Date.now());
    });
}

function generateItem(e) {
    // return {
    //     original_height: _canvas.height,
    //     original_width: _canvas.width,
    //     height: _canvas.offsetHeight || _canvas.height,
    //     width: _canvas.offsetWidth || _canvas.width,
    //     x: _canvas_div.offsetLeft,
    //     y: _canvas_div.offsetTop,
    //     // id: _canvas_div._id,
    //     data: _canvas_div._id,
    //     // value: _canvas_div._id,
    //     // style: _canvas_div._id,
    //     // thumbnail: _canvas_div._id,
    //     type: _canvas_div._type
    // }
}

function Zindex(n) {
    if (n === 1) {
        Zindex.up()
    } else if (n === 2) {
        Zindex._up();
    } else if (n === -1) {
        Zindex.down();
    } else if (n === -2) {
        Zindex._down();
    }
}


Zindex.up = function () {
    var pa = canvas_wrapper.querySelector('div[active]');
    if (pa && pa.nextElementSibling) {
        db.log.getItem(pa._id).then(function (val) {
            _zIdexCore([pa._id, 1]).then(function (e) {
                db.log.setItem(e, val)
                db.log.removeItem(pa._id)
                pa._id = e
                if (pa.nextElementSibling.nextElementSibling) {
                    canvas_wrapper.insertBefore(pa, pa.nextElementSibling.nextElementSibling)
                } else {
                    canvas_wrapper.appendChild(pa)
                }
                val = void 0
            });
        });
    }
}

Zindex.down = function movedown() {
    var pa = canvas_wrapper.querySelector('div[active]');
    if (pa && pa.previousElementSibling) {
        db.log.getItem(pa._id).then(function (val) {
            _zIdexCore([pa._id, -1]).then(function (e) {
                db.log.setItem(e, val)
                db.log.removeItem(pa._id)
                pa._id = e
                canvas_wrapper.insertBefore(pa, pa.previousElementSibling)
                val = void 0
            });
        });
    }
}

Zindex._up = function () {
    var pa = canvas_wrapper.querySelector('div[active]');
    if (pa && pa.nextElementSibling) {
        db.log.getItem(pa._id).then(function (val) {
            _zIdexCore(1).then(function (e) {
                db.log.setItem(e, val)
                db.log.removeItem(pa._id)
                pa._id = e
                canvas_wrapper.appendChild(pa)
                val = void 0
            });
        });
    }
}

Zindex._down = function () {
    var pa = canvas_wrapper.querySelector('div[active]');
    if (pa && pa.previousElementSibling) {
        db.log.getItem(pa._id).then(function (val) {
            _zIdexCore(-1).then(function (e) {
                db.log.setItem(e, val)
                db.log.removeItem(pa._id)
                pa._id = e
                canvas_wrapper.insertBefore(pa, pa.previousElementSibling)
                val = void 0
            });
        });
    }
}


function remove() {
    var pa = canvas_wrapper.querySelector('div[active]');
    // console.log(pa);
    if (pa) {
        canvas_wrapper._remove()
        db.log.getItem(pa._id).then(function (val) {
            db.log.removeItem(pa._id)
            db.object.removeItem(val.data)
            db.object_thumb.removeItem(val.data)
            db.object_thumb_medium.removeItem(val.data)
            pa.remove()
            if (canvas_wrapper.lastElementChild) {
                canvas_wrapper.lastElementChild.click()
            }
        });
    }
}

function clone() {
    var pa = canvas_wrapper.querySelector('div[active]');
    if (pa) {
        db.log.getItem(pa._id).then(function (val) {
            db.object.getItem(val.data).then(function (o) {
                if (!o) {
                    console.error(error_msg);
                    return void 0
                }
                _zIdexCore(_zIdexCore.both).then(function (id) {
                    var _id = val.data
                    val.data = id[1];

                    if (val.type === canvas_types.IMAGEDATA || val.type === canvas_types.BLOB) {
                        val.x+=20
                        val.y+=20
                        // console.log(id);
                        void db.log.setItem(id[0], val)
                        void db.object.getItem(_id).then(function (e) {
                            if (!e) {
                                return console.error(error_msg)
                            }
                            void db.object.setItem(id[1], e).then(function () {
                                if (typeof canvas_display_thumb !== "number") {
                                    incoming([id[0], e], val, function (e) {
                                        e.click()
                                        // e = void 0
                                    })
                                    // e = id = val = o = void 0;
                                }
                            });
                        });
                        void db.object_thumb_medium.getItem(_id).then(function (e) {
                            if (!e) {
                                return console.error(error_msg)
                            }
                            void db.object_thumb_medium.setItem(id[1], e).then(function () {
                                if (canvas_display_thumb === 1) {
                                    incoming([id[0], e], val, function (e) {
                                        setTimeout(function(){e.click()})
                                    })
                                    // e = id = val = o = void 0;
                                }
                            });
                        });
                        void db.object_thumb.getItem(_id).then(function (e) {
                            if (!e) {
                                return console.error(error_msg)
                            }
                            void db.object_thumb.setItem(id[1], e).then(function () {
                                if (canvas_display_thumb === 0) {
                                    incoming([id[0], e], val, function (e) {
                                        e.click()
                                        e = void 0
                                    })
                                    // e = id = val = o = void 0;
                                }
                            });
                        });
                    } else if (val.type === canvas_types.TEXT) {
                        db.log.setItem(id[0], val)
                        db.object.setItem(id[1], o)
                        incoming(id[0], val, function (e) {
                            e.click()
                        })
                        // id = val = o = void 0
                    } else {
                        console.error(error_msg)
                    }

                });
            });
        });
    }
}


function _zIdexCore(_e) {
    return _zIdexCore.pending = new Promise(function (r, j) {
        _zIdexCore.pending.then(function (e) {
            if (_e === -1) {
                db.log.key(0).then(function (e) {
                    r(e - 1)
                });
            } else if (_e instanceof Array) {

                db.log.getKey(_e[0]).then(function (e) {
                    e = e + _e[1]
                    if (0 > e) {
                        j("null value")
                        return
                    }
                    db.log.length().then(function (len) {
                        if (e > len) {
                            j("null value")
                            return
                        }
                        db.log.key(e).then(function (e) {
                            _e[0] = e
                            if (_e[1] === -1) {
                                if (_e[0] >= 0) {
                                    _e[0] -= 0.1
                                } else {
                                    _e[0] += 0.1
                                }
                            } else {
                                if (_e[0] >= 0) {
                                    _e[0] += 0.1
                                } else {
                                    _e[0] -= 0.1
                                }
                            }
                            db.log.has(_e[0]).then(function (e) {
                                if (e) {
                                    _zIdexCore(_e).then(function (e) {
                                        r(e)
                                    });
                                } else {
                                    r(_e[0])
                                }
                            })
                        })
                    });
                });
            } else if (_e === _zIdexCore.both) {
                var a = []
                db.log.length().then(function (e) {
                    if (0 >= e) {
                        return _zIdexCore.default - 1
                    }
                    return db.log.key(e - 1)
                }).then(function (e) {
                    a.push(e + 1)
                    if (!db.object) {
                        a.push(e + 1)
                        r(a)
                        a = void 0
                        throw 'still on hold';
                    }
                    return db.object.length()
                }).then(function (e) {
                    if (0 >= e) {
                        return _zIdexCore.default - 1
                    }
                    return db.object.key(e - 1)
                }).then(function (e) {
                    a.push(e + 1)
                    r(a)
                    a = void 0
                })
            } else {
                db.log.length().then(function (e) {
                    if (0 >= e) {
                        return r(_zIdexCore.default)
                    }
                    db.log.key(e - 1).then(function (e) {
                        r(e + 1)
                    });
                });
            }
        });
    });
}

function canvasSize(w, h) {
    type.number(w,h)
    if (w<5) {
        w = 5
    }
    if (h<5) {
        h = 5
    }

     original_width = w
     original_height = h

     s = canvas_roundup_size(500, original_width, original_height)
     canva.width= (_width = s.width)+'px'
     canva.height= (_height = s.height)+'px'
      scalex = (original_width / _width);
      scaley = (original_height / _height);
      
    window.onresize()
}


_zIdexCore.split = function (e) {
    e = e.split(/([a-z])/img)
    return [Number(e[0]) + 1, e[1]]
}
_zIdexCore.default = 0;
_zIdexCore.both = 'both'
_zIdexCore.overlapAbove = 1
_zIdexCore.overlapBelow = -1
_zIdexCore.pending = new Promise(function (r) {
    r();
});
function round(number, number_max, percentage) {
    if (!number_max) {
/**
 * @FIX_ME
 */
        number_max= number=1
    }
    // percentage = less than percentage (100)    (10,1000,100)
    percentage = percentage || 100;
    return Math.min((number * percentage) / number_max, percentage);
}

function save() {
    void renderAsCanvas('low',function(){
        console.log(arguments[0])
    }).then(function(e){
        if (prv_mode||dev_mode) {
            return void 0;
        }
        e.toBlob(function(e){
            e=URL.createObjectURL(e)
            open(e)
            URL.revokeObjectURL(e)
            e=void 0;
        },'image/webp',1),
        e=void 0;
    })
}

ready.then(function (e) {
    // db.log.getAllItem(incoming)
    db.log.getAllItem(function () {
        console.log("loaded");
        incoming(arguments[0], arguments[1])
    }).then(function (e) {
        _onload()
    });
    // .then(function(e){
    // })
});

function incoming(id, data, foo) {
    // var _canvas_div = canvas_wrapper.querySelector('[_id="'+id+'"]') || canvas_div.cloneNode(true)
    var _canvas_div = canvas_div.cloneNode(true)
    if (!data) {
        console.error('something unusual here')
    } else {
        if (data.type === canvas_types.IMAGEDATA) {
            loadImageData(data, id, foo, _canvas_div)
        } else if (data.type === canvas_types.TEXT) {
            loadText(data, id, foo, _canvas_div)
        } else if (data.type === canvas_types.BLOB) {
            loadImageData(data, id, foo, _canvas_div)
        } else {
            console.error('something unusual here')
        }
    }
    // _canvas_div.key = canvas_wrapper.childElementCount
    canvas_wrapper._append(_canvas_div, true)
    _canvas_div = id = data = foo = void 0
}

function _onload() {
    // textToSvg(1)
    // imagedataToSvg(7)
    
    footer.firstElementChild.removeAttribute('block')

}
