import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import db from '../db/models';
import app from '../index';
import Util from '../utilities/Util';

chai.use(chaiHttp);
const {
  Customer, Product, Department, Category
} = db;

let userToken;

const doBeforeEach = () => {
  beforeEach((done) => {
    db.sequelize.sync({
      force: true
    }).then(() => {
      Customer.create({
        email: 'test@test.com',
        name: 'luke cage',
        password: Util.hashPassword('password')
      });

      Department.create({
        name: 'Regional'
      }).then((department) => {
        Category.create({
          name: 'French',
          department_id: department.department_id
        });
      });
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
    it('should login a user successfully', (done) => {
      chai.request(app)
        .post('/api/v1/customers/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test@test.com',
          password: 'password'
        })
        .end((err, res) => {
          userToken = res.body.data.token;
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Login successfully');
          expect(res.body.data).to.have.property('token');
          done();
        });
    });

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

  describe('Test Reviews', () => {
    it('should create a review for a product', (done) => {
      chai.request(app)
        .post('/api/v1/products/1/reviews')
        .set('Content-Type', 'application/json')
        .set('Authorization', userToken)
        .send({
          review: 'good test',
          rating: 4
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('Review created successfully');
          done();
        });
    });


    it('should not create a review for a product with invalid inputs', (done) => {
      chai.request(app)
        .post('/api/v1/products/1/reviews')
        .set('Content-Type', 'application/json')
        .set('Authorization', userToken)
        .send({
          review: 'good test',
          rating: 24
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.rating[0]).to
            .equal('The selected rating is invalid.');
          done();
        });
    });

    it('should return error if product does not exist', (done) => {
      chai.request(app)
        .post('/api/v1/products/21/reviews')
        .set('Content-Type', 'application/json')
        .set('Authorization', userToken)
        .send({
          review: 'good test',
          rating: 2
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to
            .equal('Sorry, product is not available');
          done();
        });
    });
  });
});
