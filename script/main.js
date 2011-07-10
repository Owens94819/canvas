"use strict";


var
    error_msg = 'something unusual here',
    canvas_defaults = function (r) {
        var img = new Image();
        img.src = "./image/1.png";
        img.onload = function () {
            imageToCanvas(img, r);
        }
    },
    canvas_types = {
        IMAGEDATA: "imagedata",
        TEXT: "text"
    },
    canvas_state = [],
    canvas_reshape = {
        center: function (event, elm) {
            var e = elm.parentElement;
            var PRVX;
            var PRVY;
            canvas_board[canvas_events.mousemove] = function (ev) {
                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }

                e.style.top = (e.offsetTop + (ev.movementY*transform_speed|| 0)) + 'px'
                e.style.left = (e.offsetLeft + (ev.movementX*transform_speed|| 0)) + 'px'
                // e.scrollIntoViewIfNeeded(true)
            }
        },
        "right_imagedata": function (event, elm) {
            var PRVX;
            var PRVY;
            var p = elm.parentElement

            canvas_board[canvas_events.mousemove] = function (ev) {
                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }
                p.style.height = p.offsetHeight + "px"
                p.style.width = (p.offsetWidth + ((ev.movementX *transform_speed|| -1))) + "px";
            }
        },
        "bottom_imagedata": function (event, elm) {
            var PRVX;
            var PRVY;
            var p = elm.parentElement

            canvas_board[canvas_events.mousemove] = function (ev) {
                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }
                p.style.width = p.offsetWidth + "px";
                p.style.height = (p.offsetHeight + ((ev.movementY *transform_speed|| -1))) + "px";
            }
        },
        "bottom-right_imagedata": function (event, elm) {
            var p = elm.parentElement
            var PRVX;
            var PRVY;

            canvas_board[canvas_events.mousemove] = function (ev) {
                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }

                p.style.width = (p.offsetWidth + ((ev.movementY *transform_speed|| 0))) + "px";
                p.style.height = "auto";

            }
        },
        "bottom-right_text": function (event, elm) {
            var p = elm.parentElement.querySelector('span');

            var PRVX;
            var PRVY;
            canvas_board[canvas_events.mousemove] = function (ev) {
                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }
                // font: 900 85px serif;
                p.style.fontSize = (Number(p.style.fontSize.replace(/[a-z]/img, '')) + ((ev.movementY*transform_speed|| 0))) + "px";
                // elm.style.width = p.offsetWidth+"px"//(p.offsetWidth + ((ev.movementX || ev.webkitMovementX || -1))) + "px";
            }
        },
        "right_text": function (event, elm) {
            var PRVX;
            var PRVY;
            var p = elm.parentElement
            canvas_board[canvas_events.mousemove] = function (ev) {
                if (typeof ev.movementX !== 'number') {
                    var x = ev.clientX || ev.touches[0].clientX
                    var y = ev.clientY || ev.touches[0].clientY
                    ev.movementX = PRVX ? (x - PRVX) : 0;
                    ev.movementY = PRVY ? (y - PRVY) : 0;
                    PRVX = x
                    PRVY = y
                }
                // p.style.height = p.offsetHeight + "px"
                p.style.width = (p.offsetWidth + ((ev.movementX *transform_speed|| -1))) + "px";
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
    this.appendChild(e)
}


function insert(data) {
    canvas = canvas.cloneNode();
    canvas.width = data.width
    canvas.height = data.height
    canvas.getContext('2d').putImageData(data, 0, 0)
    canvas_wrapper.appendChild(canvas)
}

function imageToCanvas(img, r, both) {
    var _canvas = canvas.cloneNode();
    _canvas.width = img.width
    _canvas.height = img.height

    void _canvas.getContext('2d').drawImage(img, 0, 0, _canvas.width, _canvas.height)

    if (typeof img.close === "function") {
        void img.close()
    }

    img = void 0

    var _canvas_div = canvas_div.cloneNode(true)
    void _canvas_div.setAttribute('default', canvas_types.IMAGEDATA)
    void _canvas_div.appendChild(_canvas)


    void _zIdexCore(_zIdexCore.both).then(function (id) {
        _canvas_div._id = id[0]
        _canvas_div._type = canvas_types.IMAGEDATA
        void canvas_wrapper._append(_canvas_div)

        _canvas_div.style.width = `${_canvas_div.offsetWidth}px`
        _canvas_div.style.height = `${_canvas_div.offsetHeight}px`
        _canvas_div.style.left = `${_canvas_div.offsetLeft-(_canvas_div.offsetWidth/2)}px`
        _canvas_div.style.top = `${_canvas_div.offsetTop-(_canvas_div.offsetHeight/2)}px`
        void _canvas_div.removeAttribute('default')

        void new Promise(function (_r) {
                if (r instanceof Promise) {
                    _r(r)
                } else {
                    _r()
                }
                r = _r = void 0
            })
            .then(function () {
                return db.log.setItem(_canvas_div._id, {
                    original_height: _canvas.height,
                    original_width: _canvas.width,
                    height: _canvas_div.offsetHeight,
                    width: _canvas_div.offsetWidth,
                    x: _canvas_div.offsetLeft,
                    y: _canvas_div.offsetTop,
                    data: id[1],
                    type: _canvas_div._type
                })
            })
            .then(function () {
                r = void 0;
                void db.object.setItem(id[1], _canvas.getContext('2d').getImageData(0, 0, _canvas.width, _canvas.height))
                id = void 0;
                loadImageData.replicate(void 0, _canvas, void 0, {
                    width: _canvas_div.offsetWidth,
                    height: _canvas_div.offsetHeight
                }, 'load')

                _canvas_div = _canvas = void 0;
            });

    });
}

function getImage() {
    openFs().then(function (e) {
        createImageBitmap(e).then(function (e) {
            imageToCanvas(e)
            e = void 0
        });
        e = void 0
    });
}

function _getImage() {
    var img = new Image();
    img.src = "image/1.png"
    img.onload = function () {
        imageToCanvas(img)
    }
}

function getText(txt, data) {
    var txt = prompt("Enter Text") || "New Text"
    txt = txt.trim()
    var span = document.createElement("span")
    span.innerText = txt

    txt = void 0;

    span.style.fontSize = "24px"
    span.style.fontFamily = "serif"

    var _canvas_div = canvas_div.cloneNode(true)
    void _canvas_div.setAttribute('default', canvas_types.TEXT)
    _canvas_div.appendChild(span)


    void _zIdexCore(_zIdexCore.both).then(function (id) {
        _canvas_div._id = id[0]
        _canvas_div._type = canvas_types.TEXT
        canvas_wrapper._append(_canvas_div)

        _canvas_div.style.width = `${span.offsetWidth+1}px`
        _canvas_div.style.left = `${_canvas_div.offsetLeft-(_canvas_div.offsetWidth/2)}px`
        _canvas_div.style.top = `${_canvas_div.offsetTop-(_canvas_div.offsetHeight/2)}px`

        void _canvas_div.removeAttribute('default')

        db.log.setItem(_canvas_div._id, {
            original_style: span.style.cssText,
            fontWeight: span.style.fontWeight,
            fontSize: span.style.fontSize,
            fontFamily: span.style.fontFamily,
            width: span.offsetWidth+1,
            x: _canvas_div.offsetLeft,
            y: _canvas_div.offsetTop,
            data: id[1],
            type: _canvas_div._type
        }).then(function () {
            db.object.setItem(id[1], span.innerText)
            id = void 0
        });

    });
}

function loadStyleSheet(elm) {
    void elm.removeAttribute('hidden')
    //
}

function loadImageData(data, id, foo, _canvas_div) {

    var _canvas = canvas.cloneNode();
    void _canvas.setAttribute('hidden', "")


    _canvas_div.style.width = `${data.width}px`
    _canvas_div.style.height = `${data.height}px`
    _canvas_div.style.left = `${data.x}px`
    _canvas_div.style.top = `${data.y}px`

    _canvas_div._id = id
    _canvas_div._type = data.type
    _canvas_div.appendChild(_canvas)

    void loadImageData.replicate(data.data, _canvas, void 0, data, 'reset').then(function () {
        if (foo) {
            void foo(_canvas_div)
            foo = void 0
        }
        void loadStyleSheet(_canvas)
        _canvas_div = _canvas = void 0
    });
    id = data = void 0
}

loadImageData.replicate = function (e, _canvas, cnv, data, type) {
    if ('number' === typeof e) {
        return new Promise(function (r) {
            void db.object.getItem(e).then(function (e) {
                if (!e) {
                    void console.error(error_msg)
                    return e = void 0
                }
                void loadImageData.replicate(e, _canvas, cnv, data, type)
                r(type = _canvas = data = cnv = e = void 0)
            })
        });
    }

    if (!cnv) {
        cnv = _canvas.cloneNode();
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

    if (type === "reset") {
        _canvas.width = data.width
        _canvas.height = data.height
    }

    void _canvas.getContext('2d').drawImage(cnv, 0, 0, _canvas.width, _canvas.height)
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

    span.style.fontSize = data.fontSize
    span.style.fontWeight = data.fontWeight
    span.style.fontFamily = data.fontFamily


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
    void loadImageData.replicate(e.data, c, cnv, void 0, 'update')
    cnv = c = void 0
    e = void 0
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
        } else if (type.match(/^(bottom_imagedata|right_imagedata|bottom\-right_imagedata)$/)) {
            e.width = elm.offsetWidth;
            e.height = elm.offsetHeight;
            void updatePixels(e, elm)
        } else if (type.match(/^(bottom-right_text)$/)) {
            var c = elm.querySelector('span')
            e.fontSize = c.style.fontSize
            e.width = elm.offsetWidth
        } else if (type.match(/^(right_text)$/)) {
            e.width = elm.offsetWidth
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
    if (pa) {
        canvas_wrapper._remove()
        db.log.getItem(pa._id).then(function (val) {
            db.log.removeItem(pa._id)
            db.object.removeItem(val.data)
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
            _zIdexCore().then(function (id) {
                db.object.getItem(val.data).then(function (e) {
                    if (!e) {
                        console.error(error_msg);
                        return void 0
                    }
                    val.data = id;
                    db.log.setItem(id, val)
                    db.object.setItem(id, e)
                    incoming(id, val, function (e) {
                        e.click()
                    })
                    val = e = void 0
                });
            });
        });
    }
}




function _zIdexCore(_e) {
    return new Promise(function (r, j) {
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
                    return _zIdexCore.default-1
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
                    return _zIdexCore.default-1
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
}

function canvaSize(w, h) {
    if (typeof w !== 'number') {
        w = 500
    }
    if (typeof h !== 'number') {
        h = 500
    }

    _width = w
    _height = h

    canva.width = (_width = w) + "px"
    canva.height = (_height = h) + "px"
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

function round(number, number_max, percentage) {
    // percentage = less than percentage (100)    (10,1000,100)
    percentage = percentage || 100;
    return Math.min((number * percentage) / number_max, percentage);
}



ready.then(function (e) {
    db.log.getAllItem(incoming)
    // .then(function(e){
    // })
    footer.firstElementChild.removeAttribute('block')
});

function incoming(id, data, foo) {
    var _canvas_div = canvas_div.cloneNode(true)
    if (!data) {
        console.error('something unusual here')
    } else {
        if (data.type === canvas_types.IMAGEDATA) {
            loadImageData(data, id, foo, _canvas_div)
        } else if (data.type === canvas_types.TEXT) {
            loadText(data, id, foo, _canvas_div)
        } else {
            console.error('something unusual here')
        }
    }
    // _canvas_div.key = canvas_wrapper.childElementCount
    canvas_wrapper._append(_canvas_div, true)
    _canvas_div = id = data = foo = void 0
}


