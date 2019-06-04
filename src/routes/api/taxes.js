import express from 'express';
import TaxesController from '../../controllers/TaxController';

const taxes = express.Router();

taxes.get('/', TaxesController.getTaxes);
taxes.get('/:tax_id', TaxesController.getTaxById);

export default taxes;
// TODO: validate all params Id
