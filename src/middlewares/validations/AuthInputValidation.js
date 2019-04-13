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
    const {
      email,
      firstname,
      lastname,
      password
    } = req.body;

    const data = {
      email,
      firstname,
      lastname,
      password
    };

    const rules = {
      email: 'required|email',
      firstname: 'required|string|max:24',
      lastname: 'required|string|max:24',
      password: 'required|string|min:8|max:50'
    };

    const message = {
      'email.email': 'Please enter a valid :attribute address.',
      'min.password':
      ':attribute is too short. should be more than :min characters.',
      'max.password':
      ':attribute is too long.',
      'min.firstname':
      ':attribute is too short. Min length is :min characters.',
      'max.firstname':
      ':attribute is too long. Max length is :max characters.',
      'min.lastname':
      ':attribute is too short. Min length is :min characters.',
      'max.lastname':
      ':attribute is too long. Max length is :max characters.',
    };

    const validation = new Validator(data, rules, message);

    if (validation.passes()) {
      return next();
    }
    return res.status(400).json({
      errors: validation.errors.all()
    });
  }
}

export default AuthInputValidation;
