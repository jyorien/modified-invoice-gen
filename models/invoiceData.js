const Excel = require('exceljs')
const archiver = require('archiver');
const fs = require('fs');

let test = []
class InvoiceData {

    getData(req,res) {
        res.download('invoicedata.xlsx')
    }

    getInvoice(req,res) {
        res.download(req.params.id)
    }
    generateInvoice(req,res) {
        //console.log("given data",req.body)
        const output = fs.createWriteStream('example.zip');
        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        output.on('close',()=>{
            res.send({"filename":`example.zip`})

        })
        var example = req.body;
        test.push(example);
        var testObj = test[0];
        console.log("test obj", testObj)
        for(let i = 1; i < Object.keys(testObj).length+1; i++) 
        {
            var invoiceData = testObj[i]
        
            console.log("hello data", invoiceData)
        
        var invoiceItem = {
            "0": {
                "description":"Service Fee",
                "quantity":"1",
                "unitPrice":"500.00",
              
            },
            "1": {
                "description":"New client discount",
                "quantity":"2",
                "unitPrice":"-50.00",
              
            },
            

        }

        insertIntoTemplate(invoiceData,invoiceItem,i).then(()=>{
        

        })
       


    } // for loop ends here

    function insertIntoTemplate(data, itemData,index) {
            
        var workbook = new Excel.Workbook()
        return workbook.xlsx.readFile('template.xlsx')
        .then(() => {
            var worksheet = workbook.getWorksheet("Invoice")

            //date: H5
            var rowInvoiceNo = worksheet.getRow(5)
            rowInvoiceNo.getCell("H").value = getCurrentDate()
            // invoice no: F5
            var rowInvoiceNo = worksheet.getRow(5)
            rowInvoiceNo.getCell("F").value = data.invoiceNo
            // customer id: F8
            var rowInvoiceNo = worksheet.getRow(8)
            rowInvoiceNo.getCell("F").value = data.caseId
            // client name: A8
            var rowClientName = worksheet.getRow(8)
            rowClientName.getCell("A").value = data.clientName
            // bank name: A9
            var rowBankName = worksheet.getRow(9)
            rowBankName.getCell("A").value = data.bank
            //bank address: A10
            var rowBankAddress = worksheet.getRow(10)
            rowBankAddress.getCell("A").value = data.bankAddress
            // postal code: A11
            var rowPostalCode = worksheet.getRow(11)
            rowPostalCode.getCell("A").value = data.postalcode
            // contact: A12
            var rowContact = worksheet.getRow(12)
            rowContact.getCell("A").value = `${data.contact}`
            // client email: A13
            var rowClientEmail = worksheet.getRow(13)
            rowClientEmail.getCell("A").value = data.clientEmail
            // bank account no: F9
            var rowBankAccount = worksheet.getRow(9)
            rowBankAccount.getCell("F").value = `Bank Account no: ${data.accountNo}`
            var dataIndex = 0
            var subtotal = 0
            for (let i = 16; i < Object.keys(itemData).length+16; i++) {
                var row = worksheet.getRow(i)
                var tempData = itemData[dataIndex]
                var amount = tempData.quantity * tempData.unitPrice
                row.getCell("A").value = tempData.description
                row.getCell("F").value = tempData.quantity
                row.getCell("G").value = tempData.unitPrice
                row.getCell("H").value = amount
                subtotal+=amount
                row.commit()
                dataIndex+=1
            }
            // subtotal: H31
            var rowSubtotal = worksheet.getRow(31)
            rowSubtotal.getCell("H").value = subtotal
            var taxTotal = 0.07*subtotal
            // tax: H33
            var rowTax = worksheet.getRow(33)
            rowTax.getCell("H").value = taxTotal
            // total: H34
            var totalText =  subtotal+taxTotal
            var rowTotal = worksheet.getRow(34)
            rowTotal.getCell("H").value = totalText

            rowSubtotal.commit()
            rowTax.commit()
            rowTotal.commit()

            rowBankAccount.commit()
            rowBankAddress.commit()
            rowBankName.commit()
            rowClientName.commit()
            rowContact.commit()
            rowInvoiceNo.commit()
            rowPostalCode.commit()
            rowClientEmail.commit()
            console.log("commited")
            // console.log(testObj[i])
            workbook.xlsx.writeFile(`${data.invoiceNo}.xlsx`).then(()=> {
                console.log(`${data.invoiceNo}`)
                archive.file(`${data.invoiceNo}.xlsx`,{name: `${data.invoiceNo}.xlsx`})
                if (index==Object.keys(testObj).length) {
                    archive.finalize()
                    console.log("pls")
                    archive.pipe(output)
    
                }
            })
    
        })
        
    }

    function getCurrentDate() {
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const dateObj = new Date();
    const month = monthNames[dateObj.getMonth()];
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`

    }

    } 
}

module.exports = InvoiceData