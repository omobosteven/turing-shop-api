import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import customerFixtures from '../fixtures/customerFixtures';
import db from '../db/models';
import Util from '../utilities/Util';

const { Customer } = db;
const { newUser, testUser } = customerFixtures;

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
        .post('/api/v1/customers/register')
        .set('Content-Type', 'application/json')
        .send(newUser)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('Account created successfully');
          expect(res.body.data).to.have.property('token');
          done();
        });
    });

    it('should return error if user already exist', (done) => {
      chai.request(app)
        .post('/api/v1/customers/register')
        .set('Content-Type', 'application/json')
        .send(testUser)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.message).to.equal('User already exist');
          done();
        });
    });

    it('should throw an error if fields are invalid', (done) => {
      chai.request(app)
        .post('/api/v1/customers/register')
        .set('Content-Type', 'application/json')
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.email[0]).to.equal('The email field is required.');
          done();
        });
    });
  });

  describe('Test for customer login', () => {
    it('should login a user successfully', (done) => {
      chai.request(app)
        .post('/api/v1/customers/login')
        .set('Content-Type', 'application/json')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Login successfully');
          expect(res.body.data).to.have.property('token');
          done();
        });
    });

    it('should return error if user is not registered', (done) => {
      chai.request(app)
        .post('/api/v1/customers/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'notregistered@gmail.com',
          password: testUser.password
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message)
            .to.equal('Sorry, no account is registered for this user');
          done();
        });
    });

    it('should return error if wrong password is entered', (done) => {
      chai.request(app)
        .post('/api/v1/customers/login')
        .set('Content-Type', 'application/json')
        .send({
          email: testUser.email,
          password: 'wrongpass'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message)
            .to.equal('email or password is incorrect');
          done();
        });
    });

    it('should return error if no details are entered', (done) => {
      chai.request(app)
        .post('/api/v1/customers/login')
        .set('Content-Type', 'application/json')
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors.email[0]).to.equal('The email field is required.');
          done();
        });
    });
  });
});
