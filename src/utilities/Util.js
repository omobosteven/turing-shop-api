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
}

export default Util;
