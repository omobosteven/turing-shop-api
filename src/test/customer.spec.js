import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import customerFixtures from '../fixtures/customerFixtures';
import db from '../db/models';
import Util from '../utilities/Util';

const { Customer } = db;
const { newUser, testUser } = customerFixtures;
let userToken;

chai.use(chaiHttp);

const doBeforeEach = () => {
  beforeEach((done) => {
    db.sequelize.sync({
      force: true
    }).then(() => {
      Customer.create({
        email: 'test@test.com',
        name: 'luke cage',
        password: Util.hashPassword('password')
      }).then(() => {
        done();
      });
    });
  });
};

describe('Customer Register', () => {
  doBeforeEach();
  describe('Test for customer signup', () => {
    it('should register user if inputs are valid', (done) => {
      chai.request(app)
        .post('/customers')
        .set('Content-Type', 'application/json')
        .send(newUser)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.customer.schema.name).to.equal(newUser.name);
          expect(res.body).to.have.property('accessToken');
          done();
        });
    });

    it('should return error if user already exist', (done) => {
      chai.request(app)
        .post('/customers')
        .set('Content-Type', 'application/json')
        .send(testUser)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.error.code).to.equal('USR_04');
          expect(res.body.error.message).to.equal('The email already exists');
          done();
        });
    });

    it('should throw an error if fields are invalid', (done) => {
      chai.request(app)
        .post('/customers')
        .set('Content-Type', 'application/json')
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error.field).to.equal('email, name, password');
          done();
        });
    });
  });

  describe('Test for customer login', () => {
    it('should login a user successfully', (done) => {
      chai.request(app)
        .post('/customers/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test@test.com',
          password: 'password'
        })
        .end((err, res) => {
          userToken = res.body.accessToken;
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('accessToken');
          done();
        });
    });

    it('should return error if user is not registered', (done) => {
      chai.request(app)
        .post('/customers/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'notregistered@gmail.com',
          password: testUser.password
        })
        .end((err, res) => {
          expect(res.body.error.status)
            .to.equal(404);
          expect(res.body.error.message)
            .to.equal("The email doesn't exist");
          done();
        });
    });

    it('should return error if wrong password is entered', (done) => {
      chai.request(app)
        .post('/customers/login')
        .set('Content-Type', 'application/json')
        .send({
          email: testUser.email,
          password: 'wrongpass'
        })
        .end((err, res) => {
          expect(res.body.error.status).to.equal(400);
          expect(res.body.error.message)
            .to.equal('Email or Password is invalid');
          done();
        });
    });

    it('should return error if no details are entered', (done) => {
      chai.request(app)
        .post('/customers/login')
        .set('Content-Type', 'application/json')
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error.message).to.equal('The field(s) are/is required.');
          done();
        });
    });

    it('should return the details of a user', (done) => {
      chai.request(app)
        .get('/customer')
        .set('Content-Type', 'application/json')
        .set('USER-KEY', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.email).to.equal('test@test.com');
          done();
        });
    });

    it('should return error if token is not provider for profile update', (done) => {
      chai.request(app)
        .put('/customer')
        .set('Content-Type', 'application/json')
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error.message).to
            .equal('Access Unauthorized');
          done();
        });
    });

    it('should return error if token is not valid for profile update', (done) => {
      chai.request(app)
        .put('/customer')
        .set('Content-Type', 'application/json')
        .set('USER-KEY', '1234')
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error.message).to
            .equal('The apikey is invalid.');
          done();
        });
    });

    it('should update when valid inputs are entered', (done) => {
      chai.request(app)
        .put('/customers/address')
        .set('Content-Type', 'application/json')
        .set('USER-KEY', userToken)
        .send({
          address_1: '1 aminiu street',
          address_2: '235 Ikorodu road',
          city: 'maryland',
          region: 'lagos',
          postal_code: '100112',
          country: 'nigeria',
          shipping_region_id: '4'
        })
        .end((err, res) => { 
          expect(res.status).to.equal(200);
          expect(res.body.address_1).to.equal('1 aminiu street');
          done();
        });
    });

    it('should return error if invalid details are supplied for profile update',
      (done) => {
        chai.request(app)
          .put('/customer')
          .set('Content-Type', 'application/json')
          .set('USER-KEY', userToken)
          .send({})
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
      });
  });
});
