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

    return res.status(400).json({
      errors: validation.errors.all()
    });
  }
}

export default ReviewInputValidation;
