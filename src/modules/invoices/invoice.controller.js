import * as invoiceService from "./invoice.service.js";

// Create
export const createInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.createInvoice({
      ...req.body,
      companyId: req.user.companyId,
    });

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
      {
        ...req.body,
        companyId: req.user.companyId,
      }
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};