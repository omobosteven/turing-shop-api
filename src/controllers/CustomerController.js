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
      email, name, password
    } = req.body;

    Customer.findOne({
      where: { email }
    }).then((user) => {
      if (user) {
        return res.status(409).json({
          error: {
            status: 409,
            code: 'USR_04',
            message: 'The email already exists',
            field: 'email'
          }
        });
      }

      Customer.create({
        email: email.trim().toLowerCase(),
        name: name.toString().trim(),
        password: Util.hashPassword(password.toString().trim())
      }).then((customer) => {
        const token = jwt.sign({
          customer_id: customer.customer_id,
          name: customer.name,
          email: customer.email,
        }, secret, { expiresIn: '24h' });

        customer.reload().then((createdCustomer) => {
          const {
            customer_id, name: customer_name, email: customer_email, credit_card,
            address_1, address_2, city, region, postal_code, country,
            shipping_region_id, day_phone, eve_phone, mob_phone
          } = createdCustomer;

          const customerDetails = {
            customer_id,
            name: customer_name,
            email: customer_email,
            address_1,
            address_2,
            city,
            region,
            postal_code,
            country,
            shipping_region_id,
            day_phone,
            eve_phone,
            mob_phone,
            credit_card: Util.secure_card(credit_card),
          };

          return res.status(201).json({
            customer: {
              schema: customerDetails
            },
            accessToken: `Bearer ${token}`,
            expires_in: '24h'
          });
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
          error: {
            status: 404,
            code: 'USR_05',
            message: "The email doesn't exist",
            field: 'email'
          }
        });
      }

      if (bcrypt.compareSync(password.toString(), customer.password)) {
        const token = jwt.sign({
          customer_id: customer.customer_id,
          name: customer.name,
          email: customer.email
        }, secret, { expiresIn: '24h' });

        const {
          customer_id, name, email: customer_email, credit_card,
          address_1, address_2, city, region, postal_code, country,
          shipping_region_id, day_phone, eve_phone, mob_phone
        } = customer;

        const customerDetails = {
          customer_id,
          name,
          email: customer_email,
          address_1,
          address_2,
          city,
          region,
          postal_code,
          country,
          shipping_region_id,
          day_phone,
          eve_phone,
          mob_phone,
          credit_card: Util.secure_card(credit_card),
        };

        return res.status(200).json({
          customer: {
            schema: customerDetails
          },
          accessToken: `Bearer ${token}`,
          expires_in: '24h'
        });
      }

      return res.status(400).json({
        error: {
          status: 400,
          code: 'USR_01',
          message: 'Email or Password is invalid',
          field: 'password'
        }
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
        ...customer.dataValues,
        credit_card: Util.secure_card(customer.credit_card)
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
    const { customer_id } = req.decoded;
    const {
      name, email, password,
      day_phone, eve_phone, mob_phone
    } = req.body;

    Customer.findOne({
      where: {
        customer_id
      },
      attributes: { exclude: ['password'] }
    })
      .then((customer) => {
        customer.update({
          name,
          email,
          password: password
            ? Util.hashPassword(password.toString().trim()) : customer.password,
          day_phone: day_phone || customer.day_phone,
          eve_phone: eve_phone || customer.eve_phone,
          mob_phone: mob_phone || customer.mob_phone
        })
          .then(updatedCustomer => res.status(200).json({
            ...updatedCustomer.dataValues,
            credit_card: Util.secure_card(updatedCustomer.credit_card)
          }));
      })
      .catch(next);
  }

  /**
   * Update customer's credit card
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} user - User object
   */
  static updateCreditCard(req, res, next) {
    const { customer_id } = req.decoded;
    const { credit_card } = req.body;

    Customer.findOne({
      where: {
        customer_id
      },
      attributes: { exclude: ['password'] }
    })
      .then((customer) => {
        customer.update({
          credit_card: credit_card.toString()
        })
          .then(updated => res.status(200).json({
            ...updated.dataValues,
            credit_card: Util.secure_card(updated.credit_card)
          }));
      })
      .catch(next);
  }

  /**
   * Update customer's address
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} user - User object
   */
  static updateAddress(req, res, next) {
    const { customer_id } = req.decoded;
    const {
      address_1, address_2, city, region, postal_code, country, shipping_region_id
    } = req.body;

    Customer.findOne({
      where: {
        customer_id
      },
      attributes: { exclude: ['password'] }
    })
      .then((customer) => {
        customer.update({
          address_1,
          address_2: address_2 ? address_2.toString() : customer.address_2,
          city,
          region,
          postal_code,
          country,
          shipping_region_id
        })
          .then(updated => res.status(200).json({
            ...updated.dataValues,
            credit_card: Util.secure_card(updated.credit_card)
          }));
      })
      .catch(next);
  }
}

export default CustomerController;
