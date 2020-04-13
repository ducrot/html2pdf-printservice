import * as dotenv from "dotenv";
import {createWriteStream} from "fs";
import {PdfRenderer} from "./lib/PdfRenderer";
import {UrlPdf} from "./lib/UrlPdf";
import {HttpServer} from "./lib/HttpServer";
import * as minimist from "minimist";
import * as puppeteer from "puppeteer";
import {PDFFormat, PDFOptions} from "puppeteer";

dotenv.config();
const usage = `${process.argv[1]} <cmd> [args]

Commands:
  file [url] [outputFile]
  server [port]
  test
  
Options CLI:
  --format=A4
  --landscape=false
  --printBackground=true
  --marginTop=16mm
  --marginLeft=11mm
  --marginRight=11mm
  --marginBottom=20mm
  --debug
  
Options Server via JSON Web Token (JWT) (override Options CLI)
[
    'url' => 'http://domain.tld/',
    'options' => [
        'format' => 'A4',
        'landscape' => false,
        'printBackground' => true,
        'margin' => [
            'top' => '16mm',
            'left' => '11mm',
            'right' => '11mm',
            'bottom' => '20mm',
        ]
    ]
]
`;


const argv = Object.assign({
    format: 'A4',
    landscape: 'false',
    printBackground: 'true',
    marginTop: '16mm',
    marginLeft: '25mm',
    marginRight: '15mm',
    marginBottom: '20mm',
}, minimist(process.argv.slice(2)));


async function main() {

    let pdfOptions : PDFOptions = {
        format: argv.format as PDFFormat,
        landscape: argv.landscape !== 'false',
        printBackground: argv.printBackground === 'true',
        margin: {
            top: argv.marginTop,
            left: argv.marginLeft,
            right: argv.marginRight,
            bottom: argv.marginBottom,
        }
    };

    if (argv._.length === 3 && argv._[0] === 'file') {

        // Render PDF by url and save to file

        let url = argv._[1];
        let outputFile = argv._[2];

        console.log('Creating PDF for url ' + url);

        let renderer = await PdfRenderer.create();
        renderer.debug = !!argv.debug;
        let urlPdf = new UrlPdf(pdfOptions, renderer);
        const buffer = await urlPdf.render(url);

        let stream = createWriteStream(outputFile);
        stream.write(buffer);
        console.log('Done: ' + outputFile);

        await renderer.close();

    } else if (argv._.length === 2 && argv._[0] === 'server') {

        // Render PDF by JSON Web Token (JWT) and send to browser

        let port = parseInt(argv._[1]);

        let renderer = await PdfRenderer.create();
        renderer.debug = !!argv.debug;
        let server = new HttpServer(pdfOptions, renderer);

        console.log('Start server on port `' + port + '`');
        server.listen(port);

    } else if (argv._.length === 1 && argv._[0] === 'test') {

        //

        let browser = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
            args: ['--no-sandbox', '--font-render-hinting=medium']
        });
        let ver = await browser.version();
        console.log("Puppeteer got browser version: " + ver);
        await browser.close();

    } else {

        console.error(usage);
        process.exit(1);

    }

}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
