# Html2PDF Printservice

Generates PDFs of Urls with [Puppeteer](https://github.com/puppeteer/puppeteer).

## Installation

```bash
git clone git@github.com:ducrot/html2pdf-printservice.git
cd $_

# Prepare Docker (optional)
docker-compose build
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
