import db from '../db/models';

const { sequelize } = db;


class AttributeController {
  /**
   * Get all attributes
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} attributes - Attribute object
   */
  static getAttributes(req, res, next) {
    sequelize
      .query('CALL catalog_get_attributes()')
      .then(attributes => res.status(200).send(attributes))
      .catch(err => next(err.message));
  }

  /**
   * Get attributes by Id
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} attributes - Attribute object
   */
  static getAttributeById(req, res, next) {
    const { attribute_id } = req.params;

    sequelize
      .query(`CALL catalog_get_attribute_details(${attribute_id})`)
      .then((attribute) => {
        if (!attribute[0]) {
          return res.status(404).send({
            error: {
              status: 404,
              code: 'ATT_02',
              message: 'Don\'t exist attribute with this ID.',
              field: 'attribute_id'
            }
          });
        }
        return res.status(200).send(attribute[0]);
      })
      .catch(err => next(err.message));
  }

  /**
   * Get values attributes from attributes
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} values - Attribute Value object
   */
  static getValueOfAttributes(req, res, next) {
    const { attribute_id } = req.params;

    sequelize
      .query(`CALL catalog_get_attribute_values(${attribute_id})`)
      .then(values => res.status(200).send(values))
      .catch(err => next(err.message));
  }

  /**
   * Get attributes for product
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} attribute - Attribute object
   */
  static getAttributesOfProduct(req, res, next) {
    const { product_id } = req.params;

    sequelize
      .query(`CALL catalog_get_product_attributes(${product_id})`)
      .then(attributes => res.status(200).send(attributes))
      .catch(err => next(err.message));
  }
}

export default AttributeController;
