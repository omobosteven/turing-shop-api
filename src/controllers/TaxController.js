import db from '../db/models';

const { sequelize } = db;


class TaxController {
  /**
   * Get all taxes
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} taxes - Tax object
   */
  static getTaxes(req, res, next) {
    sequelize
      .query('CALL catalog_get_taxes()')
      .then(taxes => res.status(200).send(taxes))
      .catch(err => next(err.message));
  }

  /**
   * Get tax by Id
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} tax - Tax object
   */
  static getTaxById(req, res, next) {
    const { tax_id } = req.params;

    sequelize
      .query(`CALL catalog_get_tax_details(${tax_id})`)
      .then((tax) => {
        if (!tax[0]) {
          return res.status(404).send({
            error: {
              status: 404,
              code: 'ATT_02',
              message: 'Don\'t exist tax with this ID.',
              field: 'tax_id'
            }
          });
        }
        return res.status(200).send(tax[0]);
      })
      .catch(err => next(err.message));
  }
}

export default TaxController;
