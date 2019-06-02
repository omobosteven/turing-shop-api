import db from '../db/models';

const { sequelize } = db;

class DepartmentController {
  /**
   * Get all departments
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} departments - Department object
   */
  static getDepartments(req, res, next) {
    sequelize
      .query('CALL catalog_get_departments()')
      .then(departments => res.status(200).send(departments))
      .catch(err => next(err.message));
  }

  /**
   * Get department by Id
   * @param {*} req - query parameters
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {object} department - Department object
   */
  static getDepartmentById(req, res, next) {
    const { department_id } = req.params;

    sequelize
      .query(`CALL catalog_get_department_details(${department_id})`)
      .then((department) => {
        if (!department[0]) {
          return res.status(404).send({
            error: {
              status: 404,
              code: 'DEP_02',
              message: 'Don\'t exist department with this ID.',
              field: 'department_id'
            }
          });
        }
        return res.status(200).send(department[0]);
      })
      .catch(err => next(err.message));
  }
}

export default DepartmentController;
