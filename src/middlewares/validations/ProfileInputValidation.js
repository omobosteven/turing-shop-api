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
    let {
      name, email, password, // eslint-disable-line
      day_phone, eve_phone, mob_phone
    } = req.body;

    if (name) {
      name = name.toString();
    }
    if (password) {
      password = password.toString();
    }
    if (day_phone) {
      day_phone = day_phone.toString();
    }
    if (eve_phone) {
      eve_phone = eve_phone.toString();
    }
    if (mob_phone) {
      mob_phone = mob_phone.toString();
    }

    const data = {
      name,
      email,
      password,
      day_phone,
      eve_phone,
      mob_phone
    };

    const rules = {
      name: 'required|max:50',
      email: 'required|email',
      password: 'max:60',
      day_phone: ['regex:/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[/0-9]*$/g'],
      eve_phone: ['regex:/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[/0-9]*$/g'],
      mob_phone: ['regex:/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[/0-9]*$/g']
    };

    const validation = new Validator(data, rules);

    if (validation.passes()) {
      return next();
    }

    const { errors } = validation.errors;

    if (errors) {
      if (errors.email && errors.email[0] === 'The email format is invalid.') {
        return res.status(400).json({
          error: {
            status: 400,
            code: 'USR_03',
            message: 'The email is invalid',
            field: 'email'
          }
        });
      }

      if (errors.password
        && errors.password[0] === 'The password may not be greater than 60 characters.') {
        return res.status(400).json({
          error: {
            status: 400,
            code: 'USR_07',
            message: 'This is too long password',
            field: 'password'
          }
        });
      }

      if (errors.name
        && errors.name[0] === 'The name may not be greater than 50 characters.') {
        return res.status(400).json({
          error: {
            status: 400,
            code: 'USR_07',
            message: 'This is too long name',
            field: 'name'
          }
        });
      }

      if (errors.day_phone
        && errors.day_phone[0] === 'The day phone format is invalid.') {
        return res.status(400).json({
          error: {
            status: 400,
            code: 'USR_06',
            message: 'The day_phone is invalid. +(123)45678910',
            field: 'day_phone'
          }
        });
      }

      if (errors.eve_phone
        && errors.eve_phone[0] === 'The eve phone format is invalid.') {
        return res.status(400).json({
          error: {
            status: 400,
            code: 'USR_06',
            message: 'The eve_phone is invalid. +(123)45678910',
            field: 'eve_phone'
          }
        });
      }


      if (errors.mob_phone
        && errors.mob_phone[0] === 'The mob phone format is invalid.') {
        return res.status(400).json({
          error: {
            status: 400,
            code: 'USR_06',
            message: 'The mob_phone is invalid. +(123)45678910',
            field: 'mob_phone'
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

  /**
   * validate customer input on credit card update
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static creditCardValidation(req, res, next) {
    let { credit_card } = req.body;

    if (credit_card) {
      credit_card = credit_card.toString();
    }

    const data = {
      credit_card
    };

    const rules = {
      credit_card: 'required|size:16'
    };

    const validation = new Validator(data, rules);

    if (validation.passes()) {
      return next();
    }

    const { errors } = validation.errors;

    if (errors.credit_card[0] === 'The credit card field is required.') {
      return res.status(400).json({
        error: {
          status: 400,
          code: 'USR_02',
          message: 'The field is required',
          field: 'credit_card'
        }
      });
    }

    if (errors.credit_card[0]
      === 'The credit card must be 16 characters.') {
      return res.status(400).json({
        error: {
          status: 400,
          code: 'USR_08',
          message: 'The credit card is invalid. must be 16 digits',
          field: 'credit_card'
        }
      });
    }
  }

  /**
   * validate customer input on address update
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static addressValidation(req, res, next) {
    const {
      address_1, address_2, city, region, postal_code, country, shipping_region_id
    } = req.body;

    const data = {
      address_1, address_2, city, region, postal_code, country, shipping_region_id
    };

    const rules = {
      address_1: 'required',
      city: 'required',
      region: 'required',
      postal_code: 'required',
      country: 'required',
      shipping_region_id: 'required|integer|in:1,2,3,4',
    };

    const validation = new Validator(data, rules);

    if (validation.passes()) {
      return next();
    }

    const { errors } = validation.errors;

    if (errors) {
      if (errors.shipping_region_id
          && errors.shipping_region_id[0] === 'The selected shipping region id is invalid.') {
        return res.status(400).json({
          error: {
            status: 400,
            code: 'USR_09',
            message: 'The Shipping region ID is invalid. Enter number between 1 and 4',
            field: 'shipping_region_id'
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
}

export default ProfileInputValidation;
