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
var dotenv = require("dotenv");
var fs_1 = require("fs");
var PdfRenderer_1 = require("./lib/PdfRenderer");
var UrlPdf_1 = require("./lib/UrlPdf");
var HttpServer_1 = require("./lib/HttpServer");
var minimist = require("minimist");
var puppeteer = require("puppeteer");
dotenv.config();
var usage = process.argv[1] + " <cmd> [args]\n\nCommands:\n  file [url] [outputFile]\n  server [port]\n  test\n  \nOptions CLI:\n  --format=A4\n  --landscape=false\n  --printBackground=true\n  --marginTop=16mm\n  --marginLeft=11mm\n  --marginRight=11mm\n  --marginBottom=20mm\n  --debug\n  \nOptions Server via JSON Web Token (JWT) (override Options CLI)\n[\n    'url' => 'http://domain.tld/',\n    'options' => [\n        'format' => 'A4',\n        'landscape' => false,\n        'printBackground' => true,\n        'margin' => [\n            'top' => '16mm',\n            'left' => '11mm',\n            'right' => '11mm',\n            'bottom' => '20mm',\n        ]\n    ]\n]\n";
var argv = Object.assign({
    format: 'A4',
    landscape: 'false',
    printBackground: 'true',
    marginTop: '16mm',
    marginLeft: '25mm',
    marginRight: '15mm',
    marginBottom: '20mm',
}, minimist(process.argv.slice(2)));
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var pdfOptions, url, outputFile, renderer, urlPdf, buffer, stream, port, renderer, server, browser, ver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pdfOptions = {
                        format: argv.format,
                        landscape: argv.landscape !== 'false',
                        printBackground: argv.printBackground === 'true',
                        margin: {
                            top: argv.marginTop,
                            left: argv.marginLeft,
                            right: argv.marginRight,
                            bottom: argv.marginBottom,
                        }
                    };
                    if (!(argv._.length === 3 && argv._[0] === 'file')) return [3 /*break*/, 4];
                    url = argv._[1];
                    outputFile = argv._[2];
                    console.log('Creating PDF for url ' + url);
                    return [4 /*yield*/, PdfRenderer_1.PdfRenderer.create()];
                case 1:
                    renderer = _a.sent();
                    renderer.debug = !!argv.debug;
                    urlPdf = new UrlPdf_1.UrlPdf(pdfOptions, renderer);
                    return [4 /*yield*/, urlPdf.render(url)];
                case 2:
                    buffer = _a.sent();
                    stream = fs_1.createWriteStream(outputFile);
                    stream.write(buffer);
                    console.log('Done: ' + outputFile);
                    return [4 /*yield*/, renderer.close()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 4:
                    if (!(argv._.length === 2 && argv._[0] === 'server')) return [3 /*break*/, 6];
                    port = parseInt(argv._[1]);
                    return [4 /*yield*/, PdfRenderer_1.PdfRenderer.create()];
                case 5:
                    renderer = _a.sent();
                    renderer.debug = !!argv.debug;
                    server = new HttpServer_1.HttpServer(pdfOptions, renderer);
                    console.log('Start server on port `' + port + '`');
                    server.listen(port);
                    return [3 /*break*/, 11];
                case 6:
                    if (!(argv._.length === 1 && argv._[0] === 'test')) return [3 /*break*/, 10];
                    return [4 /*yield*/, puppeteer.launch({
                            headless: true,
                            ignoreHTTPSErrors: true,
                            args: ['--no-sandbox', '--font-render-hinting=medium']
                        })];
                case 7:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.version()];
                case 8:
                    ver = _a.sent();
                    console.log("Puppeteer got browser version: " + ver);
                    return [4 /*yield*/, browser.close()];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    console.error(usage);
                    process.exit(1);
                    _a.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    });
}
main()["catch"](function (e) {
    console.error(e);
    process.exit(1);
});
