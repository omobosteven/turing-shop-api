import Validator from 'validatorjs';

class ReviewInputValidation {
  /**
   * validate review input parameters
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static reviewValidation(req, res, next) {
    const {
      review, rating
    } = req.body;

    const data = {
      review, rating
    };

    const rules = {
      review: 'required|string',
      rating: 'required|in:1,2,3,4,5'
    };

    const validation = new Validator(data, rules);

    if (validation.passes()) {
      return next();
    }

    const { errors } = validation.errors;

    if (errors.review && errors.review[0] === 'The review must be a string.') {
      return res.status(400).send({
        error: {
          status: 400,
          code: 'USR_03',
          message: 'The review field is invalid',
          field: 'review'
        }
      });
    }

    if (errors.rating && errors.rating[0] === 'The selected rating is invalid.') {
      return res.status(400).send({
        error: {
          status: 400,
          code: 'USR_03',
          message: 'The rating field is invalid, use between 1 and 5',
          field: 'rating'
        }
      });
    }

    return res.status(400).json({
      error: {
        status: 400,
        code: 'USR_02',
        message: 'The field(s) are/is required.',
        field: `${Object.keys(errors).join(', ')}`
      }
    });
  }
}

export default ReviewInputValidation;
