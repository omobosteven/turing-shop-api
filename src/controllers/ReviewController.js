import db from '../db/models';

const { Review, Product, Customer } = db;

class ReviewController {
  /**
   * Create a review for a product
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} review - Review object
   */
  static createReview(req, res, next) {
    const { customer_id } = req.decoded; // eslint-disable-line
    const { id } = req.params;
    const { review, rating } = req.body;

    Product.findByPk(parseInt(id, 10))
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            message: 'Sorry, product is not available'
          });
        }

        Review.findOne({
          where: {
            customer_id,
            product_id: parseInt(id, 10)
          }
        }).then((existingReview) => {
          if (existingReview) {
            return res.status(409).json({
              message: "Thank you, but it seemed you've given a review already."
            });
          }

          Review.create({
            customer_id,
            product_id: parseInt(id, 10),
            review: review.trim(),
            rating
          }).then(createdReview => res.status(201).json({
            message: 'Review created successfully',
            data: createdReview
          }));
        });
      })
      .catch(next);
  }

  /**
   * Update a review for a product
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} review - Review object
   */
  static updateReview(req, res, next) {
    const { customer_id } = req.decoded; // eslint-disable-line
    const { id, reviewId } = req.params;
    const { review, rating } = req.body;

    Product.findByPk(parseInt(id, 10))
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            message: 'Sorry, product is not available'
          });
        }

        Review.findOne({
          where: {
            review_id: parseInt(reviewId, 10)
          }
        }).then((existingReview) => {
          if (!existingReview) {
            return res.status(404).json({
              message: 'Sorry, review is not available'
            });
          }

          if (existingReview.customer_id !== customer_id) { // eslint-disable-line
            return res.status(403).json({
              message: 'Sorry, you are not allowed to perform this operation'
            });
          }

          existingReview.update({
            review: review || existingReview.review,
            rating: rating || existingReview.rating
          }).then(updatedReview => res.status(200).json({
            message: 'Review updated successfully',
            data: updatedReview
          }));
        });
      })
      .catch(next);
  }

  /**
   * Delete a review for a product
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} review - Review object
   */
  static deleteReview(req, res, next) {
    const { customer_id } = req.decoded; // eslint-disable-line
    const { id, reviewId } = req.params;

    Product.findByPk(parseInt(id, 10))
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            message: 'Sorry, product is not available'
          });
        }

        Review.findOne({
          where: {
            review_id: parseInt(reviewId, 10)
          }
        }).then((existingReview) => {
          if (!existingReview) {
            return res.status(404).json({
              message: 'Sorry, review is not available'
            });
          }

          if (existingReview.customer_id !== customer_id) { // eslint-disable-line
            return res.status(403).json({
              message: 'Sorry, you are not allowed to perform this operation'
            });
          }

          existingReview.destroy().then(() => res.status(200).json({
            message: 'Review deleted successfully'
          }));
        });
      })
      .catch(next);
  }

  /**
   * Get all reviews for a product
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} review - Review object
   */
  static getReviews(req, res, next) {
    const { page, limit, order } = req.query;
    const offset = parseInt((page - 1), 10) * limit;
    const { id } = req.params;

    Product.findByPk(parseInt(id, 10))
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            message: 'Sorry, product is not available'
          });
        }

        Review.findAndCountAll({
          where: {
            product_id: id
          },
          attributes: { exclude: ['customer_id'] },
          include: [{
            model: Customer,
            as: 'customer',
            attributes: ['name'],
          }],
          order: [
            ['review_id', order]
          ],
          offset,
          limit,
        }).then((review) => {
          Review.sum('rating').then((total) => {
            const { count } = review;
            const pageCount = Math.ceil(count / limit);
            const avg = total / count;
            return res.status(200).json({
              paginationMeta: {
                pageCount,
                totalCount: count,
                outputCount: review.rows.length,
                pageSize: limit,
                currentPage: page,
              },
              average_rating: avg,
              data: review.rows
            });
          });
        });
      })
      .catch(next);
  }
}

export default ReviewController;
