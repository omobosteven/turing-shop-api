import '@babel/polyfill';
import db from '../db/models';
import ProductHelper from './helpers/products';

const {
  Product, sequelize, Review
} = db;

class ProductController {
  /**
   * Get all products
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} product - Product object
   */
  static getProducts(req, res, next) {
    const { page, limit, description_length } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

    Product.findAndCountAll({
      attributes: [
        'product_id',
        'name',
        'description',
        'price',
        'discounted_price',
        'thumbnail',
        [sequelize.fn('CONCAT',
          sequelize.fn('LEFT',
            sequelize.col('description'), description_length), '...'), 'description']],
      order: [
        ['product_id', 'ASC']
      ],
      offset,
      limit,
    })
      .then(products => res.status(200)
        .json({
          count: products.count,
          rows: products.rows
        }))
      .catch(err => next(err.message));
  }

  /**
   * Search for products in catalog
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} product - Product object
   */
  static searchProduct(req, res, next) {
    const {
      query_string, all_words, page, limit, description_length
    } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

    if (!query_string) {
      return res.status(500).send({
        error: {
          status: 500,
          code: 'PRO_02',
          message: 'The query parameter query_string is empty',
          field: 'query_string'
        }
      });
    }

    sequelize
      .query('CALL catalog_count_search_result(:query_string, :all_words)', {
        replacements: {
          query_string,
          all_words: all_words || 'on',
        }
      }).then((count) => {
        sequelize
          .query('CALL catalog_search'
            + '(:query_string, :all_words, :description_length, :limit, :offset)', {
            replacements: {
              query_string,
              all_words: all_words || 'on',
              description_length,
              limit,
              offset
            }
          }).then(products => res.status(200).send({
            count: count[0]['count(*)'],
            products
          }));
      })
      .catch(err => next(err.message));
  }

  /**
   * Get a product by ID
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next object
   * @returns {object} product - Product object
   */
  static async getProductById(req, res, next) {
    const { product_id } = req.params;
    try {
      const product = await ProductHelper.getProduct(product_id);
      if (product.error) {
        return res.status(404)
          .json(product.error);
      }
      return res.status(200)
        .send(product);
    } catch (e) {
      next(e);
    }
  }


  /**
   * Get all products in category
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} product - Product object
   */
  static getCategoryProduct(req, res, next) {
    const { category_id } = req.params;
    const { page, limit, description_length } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

    sequelize
      .query(`CALL catalog_count_products_in_category(${category_id})`)
      .then((count) => {
        sequelize
          .query(`CALL catalog_get_products_in_category(
            :category_id, :description_length, :limit, :offset)`,
          {
            replacements: {
              category_id,
              description_length,
              limit,
              offset
            }
          })
          .then(products => res.status(200)
            .send({
              count: count[0].categories_count,
              rows: products
            }));
      })
      .catch(next);
  }

  /**
   * Get all products in department
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} product - Product object
   */
  static getDepartmentProduct(req, res, next) {
    const { department_id } = req.params;
    const { page, limit, description_length } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

    sequelize
      .query(`CALL catalog_count_products_on_department(${department_id})`)
      .then((count) => {
        sequelize
          .query(`CALL catalog_get_products_in_category(
            :department_id, :description_length, :limit, :offset)`,
          {
            replacements: {
              department_id,
              description_length,
              limit,
              offset
            }
          })
          .then(products => res.status(200)
            .send({
              count: count[0].products_on_department_count,
              rows: products
            }));
      })
      .catch(next);
  }

  /**
   * Get products details
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} product - Product object
   */
  static async getProductDetails(req, res, next) {
    const { product_id } = req.params;
    const product = await ProductHelper.getProduct(product_id);
    if (product.error) {
      return res.status(404)
        .json(product.error);
    }

    sequelize
      .query(`CALL catalog_get_product_details(${product_id})`)
      .then(data => res.status(200)
        .send(data[0]))
      .catch(next);
  }

  /**
   * Get a product location
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} product - Product object
   */
  static async getProductLocations(req, res, next) {
    const { product_id } = req.params;
    const product = await ProductHelper.getProduct(product_id);
    if (product.error) {
      return res.status(404)
        .json(product.error);
    }

    sequelize
      .query(`CALL catalog_get_product_locations(${product_id})`)
      .then(locations => res.status(200)
        .send(locations[0]))
      .catch(next);
  }

  /**
   * Get a product reviews
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} reviews - Reviews object
   */
  static async getProductReviews(req, res, next) {
    const { product_id } = req.params;

    const product = await ProductHelper.getProduct(product_id);
    if (product.error) {
      return res.status(404)
        .json(product.error);
    }

    sequelize
      .query(`CALL catalog_get_product_reviews(${product_id})`)
      .then(reviews => res.status(200)
        .send(reviews))
      .catch(next);
  }

  /**
   * Create a product review
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} review - Review object
   */
  static async createProductReview(req, res, next) {
    const { customer_id } = req.decoded;
    const { product_id } = req.params;
    const { rating, review } = req.body;

    const product = await ProductHelper.getProduct(product_id);
    if (product.error) {
      return res.status(404)
        .json(product.error);
    }

    Review.findOne({
      where: {
        customer_id,
        product_id: parseInt(product_id, 10)
      }
    })
      .then((existingReview) => {
        if (existingReview) {
          return res.status(409)
            .json({
              error: {
                status: 409,
                code: 'REV_01',
                message: 'Review already for this product',
                field: 'DuplicateReview'
              }
            });
        }

        sequelize
          .query('CALL catalog_create_product_review'
            + '(:customer_id, :product_id, :review, :rating)',
          {
            replacements: {
              customer_id, product_id, review, rating
            }
          })
          .then(reviews => res.status(201).send(reviews));
      })
      .catch(next);
  }
}

export default ProductController;
