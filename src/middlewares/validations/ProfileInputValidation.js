import Validator from 'validatorjs';

class ProfileInputValidation {
  /**
   * validate customer input on profile update
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static profileUpdateValidation(req, res, next) {
    const {
      name, creditcard,
      address1, address2, city, region,
      postalcode, country, shippingregion,
      dayphone, evephone, mobphone
    } = req.body;

    const data = {
      name,
      creditcard,
      address1,
      address2,
      city,
      region,
      postalcode,
      country,
      shippingregion,
      dayphone,
      evephone,
      mobphone
    };

    const rules = {
      name: 'string|max:50',
      creditcard: 'string|size:16',
      address1: 'string|max:100',
      address2: 'string|max:100',
      city: 'string|max:100',
      region: 'string|max:100',
      postalcode: 'string|max:100',
      country: 'string|max:100',
      shippingregion: 'integer|in:1,2,3,4',
      dayphone: 'string|max:100',
      evephone: 'string|max:100',
      mobphone: 'string|max:100'
    };

    const messages = {
      'max.name': ':attribute is too long.',
      'max.address1': ':attribute is too long.',
      'max.address2': ':attribute is too long.',
      'max.city': ':attribute is too long.',
      'max.region': ':attribute is too long.',
      'max.postalcode': ':attribute is too long.',
      'max.country': ':attribute is too long.',
      'max.dayphone': ':attribute is too long.',
      'max.evephone': ':attribute is too long.',
      'max.mobphone': ':attribute is too long.',
      'max.creditcard': 'The :attribute is invalid',
      'in.shippingregion': 'The shipping region must be between 1 and 4'
    };

    const validation = new Validator(data, rules, messages);

    if (validation.passes()) {
      return next();
    }

    return res.status(400).json({
      errors: validation.errors.all()
    });
  }
}

export default ProfileInputValidation;
