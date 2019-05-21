import Validator from 'validatorjs';


class AuthInputValidation {
  /**
   * validate customer input on signUp
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static signUpInputValidation(req, res, next) {
    let {
      email, // eslint-disable-line
      name,
      password
    } = req.body;

    if (name) {
      name = name.toString();
    }

    if (password) {
      password = password.toString();
    }

    const data = {
      email,
      name,
      password
    };

    const rules = {
      email: 'required|email',
      name: 'required|max:50',
      password: 'required|max:60'
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
   * validate customer input on login
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  static loginInputValidation(req, res, next) {
    let {
      email, //eslint-disable-line
      password
    } = req.body;

    const data = {
      email,
      password
    };

    if (password) {
      password = password.toString();
    }

    const rules = {
      email: 'required',
      password: 'required'
    };

    const validation = new Validator(data, rules);

    if (validation.passes()) {
      return next();
    }

    const { errors } = validation.errors;

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

export default AuthInputValidation;
