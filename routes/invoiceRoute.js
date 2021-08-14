const InvoiceData = require("../models/invoiceData")
const invoiceData = new InvoiceData()

function routeInvoice(app) {
    
   
    app.route('/invoice')
        .post(invoiceData.generateInvoice)
    
    app.route('/invoice/:id')
        .get(invoiceData.getInvoice)
   console.log("Invoice route runs 1st")
}

module.exports = {routeInvoice}