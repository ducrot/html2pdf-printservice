# Html2PDF Printservice

Generates PDFs of Urls with [Puppeteer](https://github.com/puppeteer/puppeteer).

## Install

```bash
git clone git@github.com:ducrot/html2pdf-printservice.git html2pdf-printservice
cd $_

# Prepare Docker (optional)
docker-compose build
```

If puppeteer fails to start, install the [required dependencies](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md):
 
```bash
# Ubuntu
sudo apt install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# CentOS 7
yum install pango libXcomposite libXcursor libXdamage libXext libXi libXtst cups-libs libXScrnSaver libXrandr GConf2 alsa-lib atk gtk3 ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc
```


## Usage

Hint: Add `docker-compose run html2pdf` to run inside Docker.

```bash
node html2pdf.js <cmd> [args]

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
```

### Render from url and save to file

```bash
node app/html2pdf.js file https://domain.tld/ outfile.pdf

# or

docker-compose run html2pdf node html2pdf.js file https://domain.tld/ outfile.pdf
```

### Webserver

```bash
node app/html2pdf.js server 1234

# or

docker-compose run -p 1234:1234 html2pdf node html2pdf.js server 1234
```

Usage: `http://127.0.0.1:1234/?token=TOKEN`


### Test

```bash
node app/html2pdf.js test

# or

docker-compose run html2pdf node html2pdf.js test
```
