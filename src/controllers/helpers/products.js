import db from '../../db/models';

const { Product } = db;

class ProductHelper {
  static getProduct(product_id) {
    return Product.findOne({
      where: {
        product_id
      }
    })
      .then((product) => {
        if (!product) {
          return {
            error: {
              status: 404,
              code: 'PRO_01',
              message: "Don't exist product with this ID",
              field: 'NoProduct'
            }
          };
        }
        return product;
      })
      .catch(err => err);
  }
}

export default ProductHelper;
