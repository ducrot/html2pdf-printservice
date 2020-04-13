import * as http from 'http';
import * as url from 'url';
import * as jwt from 'jsonwebtoken';
import {PdfRenderer} from "./PdfRenderer";
import {PDFOptions} from "puppeteer";
import {UrlPdf} from "./UrlPdf";

interface Params {
    url: string,
    options?: PDFOptions
}

export class HttpServer {

    private readonly _server: http.Server;

    constructor(private _pdfOptions: PDFOptions, private readonly _renderer: PdfRenderer) {
        this._server = http.createServer(this.onRequest);
    }

    listen(port: number): this {
        this._server.listen(port);
        return this;
    }

    private onRequest = async (request: http.IncomingMessage, response: http.ServerResponse) => {
        const token = url.parse(request.url, true).query.token || null;
        let params: Params;

        if (!token) {
            response.writeHead(422, {
                'Content-Type': 'text/plain'
            });
            response.end('`token` query parameter is required');
            return;
        }

        try {
            params = jwt.verify(token, process.env.SECRET);
        } catch (err) {
            response.writeHead(422, {
                'Content-Type': 'text/plain'
            });
            response.end('`token` parameter must be a valid JWT: ' + err);
            return;
        }

        if (params.url) {
            // Merge pdf options from token
            const pdfOptions = Object.assign(this._pdfOptions, params.options);

            console.log("Render pdf from url `" + params.url + "` with options ", pdfOptions);

            // Render PDF
            let urlPdf = new UrlPdf(pdfOptions, this._renderer);
            const buffer = await urlPdf.render(params.url);
            response.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Length': buffer.length
            });
            response.write(buffer);
        } else {
            response.statusCode = 404;
            response.end();
        }
    }
}
