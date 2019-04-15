import jwt from 'jsonwebtoken';
import db from '../db/models';
import Util from '../utilities/Util';

const secret = process.env.SECRET_KEY;
const { Customer } = db;

class CustomerSocialAuthController {
  /**
   * @description - finds an existing customer or create a new customer
   * @static
   *
   *
   * @param {object} user
   * @param {function} done
   *
   * @returns {object} createOrFindUser
   *
   * @memberof CustomerSocialAuthController
   *
   */
  static modelQuery(customer, done) {
    Customer.findOrCreate({
      where: {
        email: customer.email
      },
      defaults: {
        email: customer.email,
        name: customer.name,
        password: Util.hashPassword(customer.password)
      },
    }).spread((user, created) => {
      const {
        customer_id, email, name // eslint-disable-line
      } = user.dataValues;
      done(null, {
        customer_id, email, name, created
      });
    });
  }


  /**
 * @description response function
 * @static
 * @param {object} req
 * @param {object} res
 * @returns {json} json
 * @memberOf CustomerSocialAuthController
 */
  static response(req, res, next) {
    Customer.findOne({
      where: {
        email: req.user.email,
      }
    }).then((data) => {
      const token = jwt.sign(
        {
          customer_id: data.customer_id,
          name: data.name,
        }, secret, { expiresIn: '24h' }
      );

      if (req.user.created) {
        return res.status(201).json({
          message: 'Account created successfully',
          data: {
            token
          }
        });
      }

      return res.status(200).json({ message: 'Authentication successful' });
    }).catch(next);
  }


  /**
   * @description - callback function for passport strategy
   * @static
   *
   * @param {object} accessToken
   * @param {object} refreshToken
   * @param {object} profile
   * @param {function} done
   *
   * @returns {json} json
   *
   * @memberof CustomerSocialAuthController
   *
   */
  static passportCallback(accessToken, refreshToken, profile, done) {
    const userProfile = {
      name: `${profile.displayName}`,
      email: profile.emails[0].value,
      password: profile.id,
      socialType: profile.provider
    };
    CustomerSocialAuthController.modelQuery(userProfile, done);
  }
}

export default CustomerSocialAuthController;
