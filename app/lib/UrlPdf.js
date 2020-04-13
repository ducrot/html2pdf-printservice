"use strict";
exports.__esModule = true;
var UrlPdf = /** @class */ (function () {
    function UrlPdf(pdfOptions, _renderer) {
        this._renderer = _renderer;
        _renderer.navOptions = {
            timeout: 0,
            waitUntil: 'networkidle0'
        };
        _renderer.pdfOptions = pdfOptions;
    }
    UrlPdf.prototype.render = function (url) {
        return this._renderer.render(url.toString());
    };
    return UrlPdf;
}());
exports.UrlPdf = UrlPdf;
