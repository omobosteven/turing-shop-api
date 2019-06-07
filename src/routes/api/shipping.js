import express from 'express';
import ShippingController from '../../controllers/ShippingController';

const shipping = express.Router();

shipping.get('/regions', ShippingController.getShippingRegions);
shipping.get('/regions/:shipping_region_id', ShippingController.getShippingRegionsInfo);

export default shipping;
