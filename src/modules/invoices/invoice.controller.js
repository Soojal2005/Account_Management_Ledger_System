import * as invoiceService from "./invoice.service.js";

// Create
export const createInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body);

    res.status(201).json({
      success: true,
      data: invoice,
    });
  } catch (err) {
    next(err);
  }
};

// Mark Paid
export const markInvoicePaid = async (req, res, next) => {
  try {
    const result = await invoiceService.markInvoicePaid(
      req.params.invoiceId,
      req.body
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};