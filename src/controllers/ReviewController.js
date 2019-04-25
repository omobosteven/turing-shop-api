import db from '../db/models';

const { Review, Product } = db;

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
}

export default ReviewController;
