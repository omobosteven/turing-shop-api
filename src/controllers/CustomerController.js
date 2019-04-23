import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../db/models';
import Util from '../utilities/Util';

const { Customer } = db;

dotenv.config();
const secret = process.env.SECRET_KEY;
class CustomerController {
  /**
   * Register a user
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} user - User object
   */
  static customerSignup(req, res, next) {
    const {
      email, firstname, lastname, password
    } = req.body;

    Customer.findOne({
      where: { email }
    }).then((user) => {
      if (user) {
        return res.status(409).json({
          message: 'User already exist'
        });
      }
      Customer.create({
        email: email.trim().toLowerCase(),
        name: `${firstname.trim()} ${lastname.trim()}`,
        password: Util.hashPassword(password)
      }).then((customer) => {
        const token = jwt.sign({
          customer_id: customer.customer_id,
          name: customer.name,
          email: customer.email,
          shipping_region_id: customer.shipping_region_id
        }, secret, { expiresIn: '24h' });

        return res.status(201).json({
          message: 'Account created successfully',
          data: {
            token
          }
        });
      });
    }).catch(next);
  }

  /**
   * Login a user
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} user - User object
   */
  static customerLogin(req, res, next) {
    const {
      email, password
    } = req.body;

    Customer.findOne({
      where: { email: email.toLowerCase() }
    }).then((customer) => {
      if (!customer) {
        return res.status(404).json({
          message: 'Sorry, no account is registered for this user'
        });
      }

      if (bcrypt.compareSync(password, customer.password)) {
        const token = jwt.sign({
          customer_id: customer.customer_id,
          name: customer.name,
          email: customer.email,
          shipping_region_id: customer.shipping_region_id
        }, secret, { expiresIn: '24h' });

        return res.status(200).json({
          message: 'Login successfully',
          data: {
            token
          }
        });
      }

      return res.status(400).json({
        message: 'email or password is incorrect'
      });
    }).catch(next);
  }

  /**
   * Get a customer's profile
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} user - User object
   */
  static customerDetails(req, res, next) {
    const { customer_id } = req.decoded; // eslint-disable-line

    Customer.findOne({
      where: {
        customer_id
      },
      attributes: { exclude: ['password'] }
    })
      .then(customer => res.status(200).json({
        data: customer
      })).catch(next);
  }

  /**
   * Update customer's profile
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} user - User object
   */
  static updateCustomerDetails(req, res, next) {
    const { customer_id } = req.decoded; // eslint-disable-line
    const {
      name, creditcard,
      address1, address2, city, region,
      postalcode, country, shippingregion,
      dayphone, evephone, mobphone
    } = req.body;

    Customer.findOne({
      where: {
        customer_id
      },
      attributes: { exclude: ['password'] }
    })
      .then((customer) => {
        customer.update({
          name: name || customer.name,
          credit_card: creditcard || customer.credit_card,
          address_1: address1 || customer.address_1,
          address_2: address2 || customer.address_2,
          city: city || customer.city,
          region: region || customer.region,
          postal_code: postalcode || customer.postal_code,
          country: country || customer.country,
          shipping_region_id: shippingregion || customer.shipping_region_id,
          day_phone: dayphone || customer.day_phone,
          eve_phone: evephone || customer.eve_phone,
          mob_phone: mobphone || customer.mob_phone
        })
          .then(updatedCustomer => res.status(200).json({
            message: 'Profile successfully updated',
            data: updatedCustomer
          }));
      })
      .catch(next);
  }
}

export default CustomerController;
