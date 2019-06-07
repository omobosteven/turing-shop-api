import db from '../db/models';

const { sequelize } = db;

class ShippingController {
  /**
   * Get all shipping region
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} regions - ShippingRegion object
   */
  static getShippingRegions(req, res, next) {
    sequelize
      .query('CALL customer_get_shipping_regions()')
      .then(regions => res.status(200).send(regions))
      .catch(err => next(err.message));
  }

  /**
   * Get shipping info
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} info - ShippingRegion object
   */
  static getShippingRegionsInfo(req, res, next) {
    const { shipping_region_id } = req.params;

    sequelize
      .query(`CALL orders_get_shipping_info(${shipping_region_id})`)
      .then((info) => {
        if (!info[0]) {
          return res.status(404).send({
            error: {
              status: 404,
              code: 'ATT_02',
              message: 'Don\'t exist shipping region with this ID.',
              field: 'shipping_region_id'
            }
          });
        }
        return res.status(200).send(info);
      })
      .catch(err => next(err.message));
  }
}

export default ShippingController;
