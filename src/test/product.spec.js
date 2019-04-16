import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

describe('Test Products', () => {
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
  });
});
