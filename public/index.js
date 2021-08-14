var fileData = {};
let test = [];
function onDocumentLoad() {
    document.getElementById("file_input").addEventListener('change',(event)=>{
        var file = event.target.files[0]
        readXlsxFile(file).then((data)=> {
            for (let i = 1; i < data.length; i++) {
                var tempData = data[i]
                fileData[i]={
                    "caseId": tempData[0],
                    "invoiceNo": tempData[1],
                    "clientName": tempData[2],
                    "bank": tempData[3],
                    "bankAddress": tempData[4],
                    "postalcode": tempData[5],
                    "contact": tempData[6],
                    "accountNo": tempData[7],
                    "clientEmail":tempData[8]
                    
                }
                test.push(fileData);
            }
        })

    })
}


function getInvoice() {
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
        var filename = JSON.parse(xhr.responseText).filename
        window.open(`/invoice/${filename}`)
    }
    xhr.open("POST","/invoice")
    xhr.setRequestHeader("Content-Type","application/json")
    xhr.send(JSON.stringify(fileData))
}

function downloadData() {
    window.open('/data')
}


