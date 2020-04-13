import {PdfRenderer} from "./PdfRenderer";
import {PDFOptions} from "puppeteer";

export class UrlPdf {

    constructor(pdfOptions: PDFOptions, private readonly _renderer: PdfRenderer) {

        _renderer.navOptions = {
            timeout: 0,
            waitUntil: 'networkidle0'
        };

        _renderer.pdfOptions = pdfOptions;
    }

    render(url: string): Promise<Buffer> {
        return this._renderer.render(url.toString());
    }
}
