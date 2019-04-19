import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import db from '../db/models';
import app from '../index';

chai.use(chaiHttp);
const { Product } = db;

const doBeforeEach = () => {
  beforeEach((done) => {
    db.sequelize.sync({
      force: true
    }).then(() => {
      Product.create({
        name: 'Centaur',
        description: 'There were never any lady centaurs.',
        price: 14.99,
        discounted_price: 0.00,
        image: 'centaur.gif',
        display: 2
      }).then(() => {
        done();
      });
    });
  });
};

describe('Test Products', () => {
  doBeforeEach();
  describe('Get products', () => {
    it('should get all the product', (done) => {
      chai.request(app)
        .get('/api/v1/products')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.have.property('count');
          done();
        });
    });

    it('should return error if product is not available', (done) => {
      chai.request(app)
        .get('/api/v1/products/5000')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Sorry, product is unavailable');
          done();
        });
    });

    it('should return the detail of a product', (done) => {
      chai.request(app)
        .get('/api/v1/products/1')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data.name).to.equal('Centaur');
          done();
        });
    });
  });
});
