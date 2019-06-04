import express from 'express';
import AttributeController from '../../controllers/AttributeController';

const attributes = express.Router();

attributes.get('/', AttributeController.getAttributes);
attributes.get('/:attribute_id', AttributeController.getAttributeById);
attributes.get('/values/:attribute_id', AttributeController.getValueOfAttributes);
attributes.get('/inProduct/:product_id', AttributeController.getAttributesOfProduct);

export default attributes;
