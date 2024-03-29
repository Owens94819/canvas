
function textToSvg(id, quality) {
    var log, data, style;
    return new Promise(function (r, j) {
        if (id instanceof Object) {
            r(id, id = void 0)
        } else {
            db.log.getItem(id).then(function (e) {
                if (e instanceof Object) {
                    r(e, e = void 0)
                } else {
                    j('empty')
                }
            });
        }
    })
        .then(function (e) {
            log = e, e = void 0
            return db.object.getItem(log.data)
        })
        .then(function (e) {
            data = e, e = void 0
            return db.style.getItem(log.data)
        })
        .then(function (e) {
            style = e, e = void 0

            log.fontSize = (Number(log.fontSize.replace(/[a-z]/igm, '')) * scalex) + "px"
            log.width = log.width * scalex
            log.x = log.x * scalex
            log.y = log.y * scaley

            var svg = `
<svg xmlns="http://www.w3.org/2000/svg" height="${original_width + 'px'}" width="${original_height + 'px'}" viewBox="0 0 ${original_height} ${original_width}">
    <foreignObject x="0" y="0" height="${original_width + 'px'}" width="${original_height + 'px'}">
    <x-body xmlns="http://www.w3.org/1999/xhtml">
    <style>
    ._canvas_div{
        width : ${log.width}px;
        left : ${log.x}px;
        top : ${log.y}px;
        transform :  ${log.transform};
    }
    .span{
           color :${log.color};
            background-Color :${log.backgroundColor};
            font-Size :${log.fontSize};
            font-Weight :${log.fontWeight};
            font-Family :${log.fontFamily};
            text-Align :${log.textAlign};
            ${style}
    }
    .svg-div{
        position: absolute;
        display: inline-flex;
    }
    .svg-center{
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .svg-span{}
    </style>
       <!--div class="svg-center svg-div"-->
       <div class="svg-div _canvas_div" style="">
       <span class="svg-span span" 
       style="">
        ${data}
        </span>
       </div>
       <!--/div-->
    </x-body>
</foreignObject>
    </svg>

`;
            if (self.dev_mode) {
                // shadow.appendChild(svg)
                shadow.appendChild((new DOMParser()).parseFromString(svg, 'image/svg+xml').firstElementChild)
            }

            data = log = style = id = void 0
            return thread(function (str) {
                return new Blob([str], { type: 'image/svg+xml' }, str = void 0)
            }, svg, svg = void 0)
        });
};








function imagedataToSvg(id, quality) {
    if (!_quality.hasOwnProperty(quality)) {
        quality = 'high'
    }
    var log, data, style;

    return new Promise(function (r, j) {
        if (id instanceof Object) {
            r(id, id = void 0)
        } else {
            db.log.getItem(id).then(function (e) {
                if (e instanceof Object) {
                    r(e, e = void 0)
                } else {
                    j('empty')
                }
            });
        }
    })
        .then(function (e) {
            log = e, e = void 0
            return db.object.getItem(log.data).then(function (e) {
                if (e instanceof Blob) {
                    return e
                } else {
                    var cnv = offscreenCanvas(log.original_width, log.original_height)
                    cnv.getContext('2d').imageSmoothingQuality = quality
                    cnv.getContext('2d').putImageData(e, 0, 0)
                    if (quality === "low") {
                        //  var _cnv = offscreenCanvas(log.width, log.height, true)
                        //_cnv.getContext('2d').imageSmoothingQuality = quality
                        //   _cnv.getContext('2d').drawImage(cnv, 0, 0, _cnv.width, _cnv.height);
                        //  cnv = _cnv, _cnv = void 0;
                    } else {
                        /**
                         * @high_quality
                         * */
                        // if (log.original_width + log.original_height > log.width + log.height) {
                        //     var _cnv = offscreenCanvas(log.width * scalex, log.height * scaley, true)
                        //     _cnv.getContext('2d').imageSmoothingQuality = quality
                        //     _cnv.getContext('2d').drawImage(cnv, 0, 0, _cnv.width, _cnv.height);
                        //     cnv = _cnv, _cnv = void 0;
                        // }
                    }
                    return cnv.convertToBlob({ type: _quality[quality].type, quality: _quality[quality].quality })
                }
            });
        })
        .then(function (e) {
            data = e, e = void 0
            return db.style.getItem(log.data)
        })
        .then(function (e) {
            style = e, e = void 0

            log.width = log.width * scalex
            log.height = log.height * scalex
            log.x = log.x * scalex
            log.y = log.y * scaley

            var svg = `
    
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" height="${original_width + 'px'}" width="${original_height + 'px'}" viewBox="0 0 ${original_height} ${original_width}">
            <foreignObject x="0" y="0" height="${original_width + 'px'}" width="${original_height + 'px'}">
            <x-body xmlns="http://www.w3.org/1999/xhtml">
            <style>
            ._canvas_div{
                width : ${log.width}px;
                height : ${log.height}px;
                left : ${log.x}px;
                top : ${log.y}px;
                transform :  ${log.transform};
            }
            .img{
                background-Color : ${log.backgroundColor};
                ${style}
            }
            .svg-div{
                position: absolute;
                display: inline-flex;
            }
            .svg-center{
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .svg-img{
                width:100%;
                height:100%;
            }
            </style>
               <!--div class="svg-center svg-div"-->
               <div class="svg-div _canvas_div" style="">
               <img class="svg-img img" src="${"data:image/png,"}" style=""></img><!--close-->
               </div>
               <!--/div-->
            </x-body>
        </foreignObject>
            </svg>
            `
            if (self.dev_mode) {
                var _svg = (new DOMParser()).parseFromString(svg, 'image/svg+xml').documentElement;
                var img = _svg.querySelector('img');//new Image()
                // img.src=decodeURIComponent(URL.createObjectURL(data));
                img.src = URL.createObjectURL(data);
                img.onload = function () {
                    URL.revokeObjectURL(this.src)
                }
                img.onerror = function (e) {
                    URL.revokeObjectURL(this.src)
                }
                shadow.appendChild(_svg)
                _svg = img = void 0;
            }

            log = style = id = void 0

            return thread(function (str, blob) {
                return new Promise(function (r) {
                    str = str.replace("\"><!--close-->", '"></img>')
                    var fr = new FileReader()
                    fr.readAsDataURL(blob)
                    blob = void 0
                    fr.onload = function () {
                        str = str.replace(/(blob|data):[^"]+/, fr.result)
                        fr = void 0
                        r(new Blob([str], { type: 'image/svg+xml' }, str = void 0))
                    }
                });
            }, [svg, data], svg = data = void 0)

        });
};








function renderAsCanvas(quality, callback) {
    type.string(quality), type.function(callback);

    var loaded = 0

    if (!_quality.hasOwnProperty(quality)) {
        quality = 'low'
        quality = 'high'
    }

    var cnv;
    if (self.shadow) {
        var cnv = shadow.querySelector('canvas')
        if (cnv) {
            cnv.remove()
        }
    }

    cnv = offscreenCanvas(original_width, original_height, true)

    cnv.width = original_width
    cnv.height = original_height

    if (cnv.style) {
        cnv.style.width = _width + 'px'
        cnv.style.height = _height + 'px'
    }

    if (self.prv_mode) {
        shadow.appendChild(cnv)
    }

    ctx = cnv.getContext('2d')
    ctx.imageSmoothingQuality = quality


    return new Promise(function (r) {
        db.log.length().then(function (len) {
            callback(round(loaded, len, 100));
            if (0 === len) {
                r()
                return
            }
            var foo = function (key, log) {
                return new Promise(function (r) {
                    if (log.type === "text") {
                        textToSvg(log, quality).then(r)
                    } else {
                        imagedataToSvg(log, quality).then(r)
                    }
                }).then(function (e) {
                    return new Promise(function (r) {
                        if (true) {
                            // faster
                            var fr = new FileReader()
                            fr.readAsDataURL(e)
                            fr.onload = function () {
                                var img = new Image()
                                img.src = fr.result
                                img.onload = function () {
                                    ctx.drawImage(img, 0, 0, cnv.width, cnv.height)
                                    img.src=null
                                    r()
                                }
                            }
                        } else {
                            // slower
                            var img = new Image()
                            img.src = URL.createObjectURL(e)
                            img.onload = function () {
                                ctx.drawImage(img, 0, 0, cnv.width, cnv.height)
                                URL.revokeObjectURL(img.src)
                                r()
                            }
                        }
                    });
                }).then(function (e) {

                    loaded += 1
                    callback(round(loaded, len, 100))
                    if (len === loaded) {
                        r()
                    }
                });
            };


            var _foo = function (node, r) {
                if (!node) {
                    r()
                    return
                }
                db.log.getItem(node._title).then(function () {
                    return foo(void 0, arguments[0])
                }).then(function () {
                    _foo(node.nextElementSibling, r)
                });
            }

            // return db.log.getAllItem(foo)
            return new Promise(function (r) {
                var node = canvas_wrapper.firstElementChild;
                _foo(node, r)
            });
        });
    }).then(function (e) {
        return cnv
    });
}
