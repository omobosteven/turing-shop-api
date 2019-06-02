class QueryValidation {
  /**
   * validate query parameters
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static queryValidation(req, res, next) {
    let { limit, page, description_length } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    description_length = parseInt(description_length, 10);
    req.query.page = (page && Number.isInteger(page) && page > 0) ? page : 1;
    req.query.limit = (limit && Number.isInteger(limit) && limit > 0) ? limit : 15;
    req.query.description_length = (description_length
      && Number.isInteger(description_length) && description_length > 0)
      ? description_length : 200;
    next();
  }
}

export default QueryValidation;
