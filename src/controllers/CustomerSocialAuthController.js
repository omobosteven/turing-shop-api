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
          email: data.email
        }, secret, { expiresIn: '24h' }
      );

      const {
        customer_id, name, email: customer_email, credit_card, address_1, address_2, // eslint-disable-line
        city, region, postal_code, country, shipping_region_id, day_phone, // eslint-disable-line
        eve_phone, mob_phone // eslint-disable-line
      } = data;

      const customerDetails = {
        customer_id, name, email: customer_email, credit_card, address_1, address_2, // eslint-disable-line
        city, region, postal_code, country, shipping_region_id, day_phone, // eslint-disable-line
        eve_phone, mob_phone }; // eslint-disable-line


      return res.status(200).json({
        customer: {
          schema: customerDetails
        },
        accessToken: `Bearer ${token}`,
        expires_in: '24h'
      });
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
