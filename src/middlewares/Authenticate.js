import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../db/models';

dotenv.config();
const { Customer } = db;

const secret = process.env.SECRET_KEY;

/**
 * @class Authenticate
 */
class Authenticate {
  /**
 * @description it checks that the user supplied a token
 *
 * @return {void}
 *
 * @param {param} req
 * @param {param} res
 * @param {func} next
 */
  static auth(req, res, next) {
    let token = req.headers['user-key'];

    if (token) {
      token = token.slice(7, token.length);
      Authenticate.verifyUser(req, res, next, token);
    } else {
      return res.status(401).json({
        error: {
          status: 401,
          code: 'AUT_02',
          message: 'Access Unauthorized',
          field: 'NoAuth'
        }
      });
    }
  }

  /**
 * @description it checks if the token supplied by the user is valid
 *
 * @return {void}
 *
 * @param {param} req
 * @param {param} res
 * @param {func} next
 * @param {param} token
 */
  static verifyUser(req, res, next, token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: {
            status: 401,
            code: 'AUT_02',
            message: 'The apikey is invalid.',
            field: 'API-KEY'
          }
        });
      }
      Customer.findByPk(decoded.customer_id)
        .then((customer) => {
          if (customer) {
            req.decoded = {
              customer_id: decoded.customer_id,
              name: decoded.name,
              email: decoded.email,
              shipping_region_id: decoded.shipping_region_id
            };
            return next();
          }
          if (!customer) {
            return res.status(404).json({
              status: 404,
              code: 'CUS_01',
              message: 'Customer not found.',
              field: 'NoCustomer'
            });
          }
        })
        .catch(next);
    });
  }
}

export default Authenticate;
