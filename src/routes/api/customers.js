import express from 'express';
import AuthInputValidation from '../../middlewares/validations/AuthInputValidation';
import ProfileInputValidation from '../../middlewares/validations/ProfileInputValidation';
import CustomerController from '../../controllers/CustomerController';
import CustomerSocialAuthController from '../../controllers/CustomerSocialAuthController';
import Authenticate from '../../middlewares/Authenticate';
import passport from '../../db/config/oauth';

const customers = express.Router();

customers.post('/register',
  AuthInputValidation.signUpInputValidation, CustomerController.customerSignup);
customers.post('/login',
  AuthInputValidation.loginInputValidation, CustomerController.customerLogin);

customers.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

customers.get('/oauth/google', passport.authenticate('google'),
  CustomerSocialAuthController.response);

customers.get('/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

customers.get('/oauth/facebook',
  passport.authenticate('facebook', { session: false }),
  CustomerSocialAuthController.response);

customers.use(Authenticate.auth);

customers.get('/profile', CustomerController.customerDetails);
customers.put('/profile',
  ProfileInputValidation.profileUpdateValidation,
  CustomerController.updateCustomerDetails);

export default customers;
