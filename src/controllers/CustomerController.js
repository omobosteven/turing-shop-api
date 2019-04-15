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
          name: customer.name
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
          name: customer.name
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
}

export default CustomerController;
