import express from 'express';
import ProfileInputValidation from '../../middlewares/validations/ProfileInputValidation';
import CustomerController from '../../controllers/CustomerController';
import Authenticate from '../../middlewares/Authenticate';

const customer = express.Router();

customer.use(Authenticate.auth);

customer.get('/', CustomerController.customerDetails);
customer.put('/',
  ProfileInputValidation.profileUpdateValidation,
  CustomerController.updateCustomerDetails);

export default customer;
