import db from '../db/models';

const { sequelize } = db;


class CategoriesController {
  /**
   * Get all categories
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} categories - Category object
   */
  static getCategories(req, res, next) {
    const { page, limit, order } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

    const allowedOrderFields = ['category_id', 'name'];
    if (order && !allowedOrderFields.includes(order)) {
      return res.status(400).send(
        {
          error: {
            status: 400,
            code: 'PAG_01',
            message: 'The order is not match field,(customer_id | name)'
          }
        }
      );
    }

    sequelize
      .query('CALL catalog_count_catagory()')
      .then((count) => {
        sequelize
          .query('CALL catalog_get_categories(:order, :limit, :offset)', {
            replacements: {
              order: order || 'categories_id',
              limit: limit || 20,
              offset
            }
          })
          .then(departments => res.status(200).send({
            count: count[0].category_count,
            rows: departments
          }));
      })
      .catch(err => next(err.message));
  }

  /**
   * Get categories by Id
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} category - Category object
   */
  static getCategoryById(req, res, next) {
    const { category_id } = req.params;

    sequelize
      .query(`CALL catalog_get_category_details(${category_id})`)
      .then((category) => {
        if (!category[0]) {
          return res.status(404).send({
            error: {
              status: 404,
              code: 'CAT_02',
              message: 'Don\'t exist category with this ID.',
              field: 'category_id'
            }
          });
        }
        return res.status(200).send(category[0]);
      })
      .catch(err => next(err.message));
  }

  /**
   * Get categories of a product
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} categories - Category object
   */
  static getCategoriesOfProduct(req, res, next) {
    const { product_id } = req.params;

    sequelize
      .query(`CALL catalog_get_categories_for_product(${product_id})`)
      .then(categories => res.status(200).send(categories))
      .catch(err => next(err.message));
  }

  /**
   * Get categories of a department
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} categories - Category object
   */
  static getCategoryOfDepartment(req, res, next) {
    const { department_id } = req.params;

    sequelize
      .query(`CALL catalog_get_department_categories(${department_id})`)
      .then(categories => res.status(200).send(categories))
      .catch(err => next(err.message));
  }
}

export default CategoriesController;
