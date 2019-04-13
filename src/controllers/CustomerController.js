import { Op } from 'sequelize';
import db from '../db/models';

const { Customer } = db;

class CustomerController {
  /**
   * Get all users profile
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} user - User object
   */
  static getAllUser(req, res, next) {
    Customer.findAll()
      .then(user => res.status(200).json({
        status: 200,
        user
      }))
      .catch(next);
  }
}

export default CustomerController;
