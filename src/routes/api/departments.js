import express from 'express';
import DepartmentController from '../../controllers/DepartmentController';

const departments = express.Router();

departments.get('/', DepartmentController.getDepartments);
departments.get('/:department_id', DepartmentController.getDepartmentById);

export default departments;
