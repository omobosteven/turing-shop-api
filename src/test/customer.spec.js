import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import customerFixtures from '../fixtures/customerFixtures';
import db from '../db/models';
import Util from '../utilities/Util';

const { Customer } = db;

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
        .send(customerFixtures.validDetails)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.data).to.have.property('token');
          done();
        });
    });

    it('should return error if user already exist', (done) => {
      chai.request(app)
        .post('/api/v1/customers/register')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test@test.com',
          firstname: 'luke',
          lastname: 'cage',
          password: 'password'
        })
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
});
