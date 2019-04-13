import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../db/models';
import Util from '../utilities/Util';

const { Customer } = db;

dotenv.config();
const secret = process.env.SECRET_KEY;
class CustomerController {
  /**
   * Get all users profile
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
        name: `${firstname.trim().toLowerCase()} ${lastname.trim().toLowerCase()}`,
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
}

export default CustomerController;
