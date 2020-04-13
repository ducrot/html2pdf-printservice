import * as puppeteer from 'puppeteer';
import {Browser, DirectNavigationOptions, PDFOptions, SetCookie} from 'puppeteer';


export interface CookieOptions {
    cookies: SetCookie | SetCookie[];
}


export class PdfRenderer {

    pdfOptions: PDFOptions = {};
    navOptions: DirectNavigationOptions = {};

    debug: boolean = false;

    private readonly _browser: Browser;

    protected constructor(browser: Browser) {
        this._browser = browser;
    }

    static async create(): Promise<PdfRenderer> {
        let browser = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
            args: ['--no-sandbox', '--font-render-hinting=medium']
        });
        return new PdfRenderer(browser);
    }

    async close(): Promise<void> {
        return this._browser.close();
    }

    async render(url: string, cookieOptions?: CookieOptions, navOptions?: DirectNavigationOptions, pdfOptions?: PDFOptions): Promise<Buffer> {
        let page = await this._browser.newPage();

        navOptions = Object.assign({}, this.navOptions, navOptions ||{});

        if (this.debug) {
            page.on('console', msg => console.log('PdfRenderer page log >>>', msg.text()));
        }

        if (cookieOptions) {
            if (Array.isArray(cookieOptions.cookies)) {
                await page.setCookie(...cookieOptions.cookies);
            } else {
                await page.setCookie(cookieOptions.cookies);
            }
            if (this.debug) {
                console.log("PdfRenderer setting cookies: " + JSON.stringify(cookieOptions.cookies));
            }
        }

        if (this.debug) {
            console.log("PdfRenderer opening page " + url + " with options: " + JSON.stringify(navOptions));
        }

        await page.goto(url, navOptions);

        pdfOptions = Object.assign({}, this.pdfOptions, pdfOptions ||{});

        let buffer = await page.pdf(pdfOptions);

        await page.close({
            runBeforeUnload: false
        });

        return buffer;
    }

}