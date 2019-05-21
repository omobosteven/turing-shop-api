import { hashSync, genSaltSync } from 'bcrypt';

class Util {
  /**
   * hash user password
   * @function hashPassword
   * @param {*} password - password to be hashed
   *
   * @returns {hashedPassword} - hashed password
   */
  static hashPassword(password) {
    return hashSync(password, genSaltSync(2));
  }

  /**
   * secure user credit_card
   * @function secure_card
   * @param {*} credit_card - credit card to be secured
   *
   * @returns {secured card} - encrypt credit card detail
   */
  static secure_card(credit_card) {
    if (credit_card) {
      return `XXXXXXXXXXXX${credit_card.slice(12)}`;
    }

    return null;
  }
}

export default Util;
