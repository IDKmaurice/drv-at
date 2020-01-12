module.exports = {
    prepareDocument: (size, layout, placeholders) => {

        let PDFDocument = require('pdfkit')

        let availableFormats = ['A4']
        size.format = (size.format) ? size.format : 'A4'
        size.landscape = (size.landscape) ? 'landscape' : 'portrait'

        if(typeof size.margin == 'object')
        {
            if(Object.keys(size.margin).length === 4)
            {
                size.margins = {
                    'top': size.margin.top,
                    'left': size.margin.left,
                    'bottom': size.margin.bottom,
                    'right': size.margin.right,
                }
            }
            else
            {
                size.margins = {
                    'top': 0,
                    'left': 0,
                    'bottom': 0,
                    'right': 0,
                }
            }
        }
        else if(typeof size.margin == 'number')
        {
            size.margins = {
                'top': size.margin,
                'left': size.margin,
                'bottom': size.margin,
                'right': size.margin,
            }
        }
        else
        {
            size.margins = {
                'top': 0,
                'left': 0,
                'bottom': 0,
                'right': 0,
            }
        }

        doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape'
        })

        

        let border = (x, y, w, h, l, s, opacity = 1) => {
            let m = l / 2
            let s1 = s
            let s2 = s*2
            let s3 = s*3

            w = horizontalBounding(x, w)
            h = verticalBounding(h, y)
            x = horizontalBounding(x)
            y = verticalBounding(y)
        
            doc.polygon(
                [x+m, y+m+s3],
                [x+m, h-m-s3],
                [x+m+s2, h-m-s3],
                [x+m+s2, h-m-s1],
                [x+m+s1, h-m-s1],
                [x+m+s1, h-m-s2],
                [x+m+s3, h-m-s2],
                [x+m+s3, h-m],
                [w-m-s3, h-m],
                [w-m-s3, h-m-s2],
                [w-m-s1, h-m-s2],
                [w-m-s1, h-m-s1],
                [w-m-s2, h-m-s1],
                [w-m-s2, h-m-s3],
                [w-m, h-m-s3], 
                [w-m, y+m+s3],
                [w-m-s2, y+m+s3],
                [w-m-s2, y+m+s1],
                [w-m-s1, y+m+s1],
                [w-m-s1, y+m+s2],
                [w-m-s3, y+m+s2],
                [w-m-s3, y+m],
                [x+m+s3, y+m],
                [x+m+s3, y+m+s2],
                [x+m+s1, y+m+s2],
                [x+m+s1, y+m+s1],
                [x+m+s2, y+m+s1],
                [x+m+s2, y+m+s3]
            ).lineWidth(l).opacity(opacity).stroke()
            doc.opacity(1)
        }



        let text = (x, y, w, h, style, text) => {

            x = horizontalBounding(x)
            y = verticalBounding(y)
            if(w) w = LENGTH(w)
            if(h) h = LENGTH(h, 'VERTICAL')

            let attributes = {}
            let color = (style.color) ? style.color : 'black'
            let font = (style.font) ? style.font : 'Helvetica'
            let fontSize = (style.size) ? style.size : 12
            attributes.align = (style.align) ? style.align : 'left'
            if(w) attributes.width = w
            if(h) attributes.height = h

            for (var prop in placeholders) {
                let value = placeholders[prop]

                text = text.replace(new RegExp('{{'+prop+'}}', 'g'), value)
            }

            doc.font(font).fontSize(fontSize).fillColor(color).text(text, x, y, attributes)
        }



        const horizontalBounding = (x, width = null) => {

            let returnValue = size.margins.left

            x = LENGTH(x) + size.margins.left
            width = LENGTH(width)

            returnValue = (width) ? x + width : x

            if( returnValue < size.margins.left){
                returnValue = size.margins.left
            }

            if( returnValue > doc.page.width - size.margins.right){
                returnValue = doc.page.width - size.margins.right
            }

            return returnValue
        }



        const verticalBounding = (y, height = null) => {

            let returnValue = size.margins.top

            y = LENGTH(y, 'VERTICAL') + size.margins.top
            height = LENGTH(height, 'VERTICAL')

            returnValue = (height) ? y + height : y

            if( returnValue < size.margins.top){
                returnValue = size.margins.top
            }

            if( returnValue > doc.page.height - size.margins.bottom){
                returnValue = doc.page.height - size.margins.bottom
            }

            return returnValue
        }



        const LENGTH = (length, direction) => {

            let maxSize = (direction == 'VERTICAL') ?
            doc.page.height - size.margins.top - size.margins.bottom :
            doc.page.width - size.margins.left - size.margins.right

            if(typeof length == 'string')
            {
                length = length.replace(/[^0-9%]/, '')

                if(length.endsWith('%'))
                {
                    length = length.replace(/[%]/, '')
                    length = maxSize * ( parseInt(length) / 100 )
                }
                else
                {
                    length = parseInt(length)
                }
            }

            return length
        }



        layout.forEach(elem => {

            let operation = Object.getOwnPropertyNames(elem)[0]
            let prop = elem[operation]

            switch (operation) {
                case 'border':
                    border(prop.x, prop.y, prop.width, prop.height, prop.stroke, prop.corner, prop.opacity)
                    break

                case 'text':
                    text(prop.x, prop.y, prop.width, prop.height, prop.style, prop.text)
                    break
            
                default:
                    break
            }
        })


        doc.end()

        let writeStream = fs.createWriteStream('filename.pdf')
        let pdfStream = doc.pipe(writeStream)

        pdfStream.on('finish', function() {
            //module.exports.printDocument()
        })
    },
    printDocument: () => {

        const printer = require('node-native-printer')
        // require temp
        console.log('PRINTING')
    
        filename = 'filename.pdf'
        printername = 'Brother MFC-L3770CDW series Printer'
        data = fs.readFileSync(filename)
        
        console.log(printer.listPrinters())
        console.log(printer.printerOptions(printername))
        
        if( process.platform != 'win32') {
            
        } else {
            printer.print(filename, {
                "landscape": true,
                "paperSize": "A4",
                "sides": "two-sided-long-edge"
            }, printername)
        }
    },
}