const InvoiceData = require("../models/invoiceData")
const invoiceData = new InvoiceData()

function routeInvoice(app) {
    
   
    app.route('/invoice')
        .post(invoiceData.generateInvoice)
    
    app.route('/invoice/:id')
        .get(invoiceData.getInvoice)
   
    app.route('/data')
        .get(invoiceData.getData)
}

module.exports = {routeInvoice}