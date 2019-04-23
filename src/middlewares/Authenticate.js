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
    const token = req.headers.authorization;
    if (token) {
      Authenticate.verifyUser(req, res, next, token);
    } else {
      return res.status(401).json({
        message: 'You need to be logged in to perform this action'
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
          message: 'Sorry, authorization was not successful'
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
            return res.status(401).json({
              message: 'User not found.'
            });
          }
        })
        .catch(next);
    });
  }
}

export default Authenticate;
