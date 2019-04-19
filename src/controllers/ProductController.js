import db from '../db/models';

const { Product, AttributeValue, Category } = db;

class ProductController {
  /**
   * Get all products
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} product - Product object
   */
  static getProducts(req, res, next) {
    const { page, limit, order } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

    Product.findAndCountAll({
      order: [
        ['product_id', order]
      ],
      offset,
      limit,
    })
      .then((products) => {
        const { count } = products;
        const pageCount = Math.ceil(count / limit);
        return res.status(200).json({
          status: 200,
          paginationMeta: {
            pageCount,
            totalCount: count,
            outputCount: products.rows.length,
            pageSize: limit,
            currentPage: page,
          },
          data: products
        });
      })
      .catch(next);
  }

  /**
   * Get all products
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} product - Product object
   */
  static getProduct(req, res, next) {
    Product.findOne({
      include: [
        {
          model: AttributeValue,
          as: 'attributes',
          attributes: ['value'],
          through: {
            attributes: []
          }
        },
        {
          model: Category,
          as: 'category',
          attributes: [
            'name',
            'description'
          ],
          through: {
            attributes: []
          }
        }
      ],
      where: {
        product_id: req.params.id
      }
    })
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            message: 'Sorry, product is unavailable'
          });
        }
        return res.status(200).json({
          data: product
        });
      })
      .catch(next);
  }
}

export default ProductController;
