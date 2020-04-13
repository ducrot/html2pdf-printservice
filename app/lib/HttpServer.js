"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var http = require("http");
var url = require("url");
var jwt = require("jsonwebtoken");
var UrlPdf_1 = require("./UrlPdf");
var HttpServer = /** @class */ (function () {
    function HttpServer(_pdfOptions, _renderer) {
        var _this = this;
        this._pdfOptions = _pdfOptions;
        this._renderer = _renderer;
        this.onRequest = function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var token, params, pdfOptions, urlPdf, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = url.parse(request.url, true).query.token || null;
                        if (!token) {
                            response.writeHead(422, {
                                'Content-Type': 'text/plain'
                            });
                            response.end('`token` query parameter is required');
                            return [2 /*return*/];
                        }
                        try {
                            params = jwt.verify(token, process.env.SECRET);
                        }
                        catch (err) {
                            response.writeHead(422, {
                                'Content-Type': 'text/plain'
                            });
                            response.end('`token` parameter must be a valid JWT: ' + err);
                            return [2 /*return*/];
                        }
                        if (!params.url) return [3 /*break*/, 2];
                        pdfOptions = Object.assign(this._pdfOptions, params.options);
                        console.log("Render pdf from url `" + params.url + "` with options ", pdfOptions);
                        urlPdf = new UrlPdf_1.UrlPdf(pdfOptions, this._renderer);
                        return [4 /*yield*/, urlPdf.render(params.url)];
                    case 1:
                        buffer = _a.sent();
                        response.writeHead(200, {
                            'Content-Type': 'application/pdf',
                            'Content-Length': buffer.length
                        });
                        response.write(buffer);
                        return [3 /*break*/, 3];
                    case 2:
                        response.statusCode = 404;
                        response.end();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this._server = http.createServer(this.onRequest);
    }
    HttpServer.prototype.listen = function (port) {
        this._server.listen(port);
        return this;
    };
    return HttpServer;
}());
exports.HttpServer = HttpServer;
