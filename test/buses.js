import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import app from '../src/app';
import QueryBuilder from '../src/db/QueryBuilder';

chai.use(chaiHttp);

const base = '/api/v1/';
const user = {
  first_name: 'Jeffery',
  last_name: 'Way',
  email: 'user@blog.com',
  password: '123456',
};
const admin = {
  first_name: 'Admin',
  last_name: 'Way',
  email: 'admin@blog.com',
  password: '123456',
};

const bus = {
  number_plate: 'XAS454YR',
  manufacturer: 'Toyota',
  model: 'Camry',
  year: 2015,
  capacity: 6,
};

let user_token;
let admin_token;

describe('Test Buses route', () => {
  before(async () => {
    await QueryBuilder.truncate('users');
    await QueryBuilder.truncate('buses');
    await chai.request(app)
      .post(`${base}auth/signup`)
      .send(user)
      .then((res) => {
        user_token = res.body.data.token;
        expect(res.status).to.equal(201);
      });
    await chai.request(app)
      .post(`${base}auth/signup`)
      .send(admin)
      .then((res) => {
        expect(res.status).to.equal(201);
      });
    await QueryBuilder.update('users', { is_admin: true }, { email: admin.email });
    await chai.request(app)
      .post(`${base}auth/signin`)
      .send({
        email: 'admin@blog.com',
        password: '123456',
      })
      .then((res) => {
        admin_token = res.body.data.token;
        expect(res.status).to.equal(200);
      });
  });
  describe('Test buses can be viewed', () => {
    describe('Users can not view buses', () => {
      it('should respond with status 403 and error message', (done) => {
        chai.request(app)
          .get(`${base}buses`)
          .set('Authorization', `Bearer ${user_token}`)
          .end((err, res) => {
            expect(res.status).to.equal(403);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });
    describe('Admins can view buses', () => {
      it('should respond with status 200 and error message', (done) => {
        chai.request(app)
          .get(`${base}buses`)
          .set('Authorization', `Bearer ${admin_token}`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            done();
          });
      });
    });
  });
  describe('Test buses can be created', () => {
    describe('Users can not create buses', () => {
      it('should respond with status 403 and error message', (done) => {
        chai.request(app)
          .post(`${base}buses`)
          .set('Authorization', `Bearer ${user_token}`)
          .send(bus)
          .end((err, res) => {
            expect(res.status).to.equal(403);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });
    describe('Admin cannot create trip data with invalid credentials', () => {
      describe('Test number plate field', () => {
        it('should respond with error for missing number plate field', (done) => {
          chai.request(app)
            .post(`${base}buses`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
              manufacturer: 'Toyota',
              model: 'Camry',
              year: '2015',
              capacity: 6,
            })
            .end((err, res) => {
              expect(res.status).to.equal(422);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body).to.have.property('error');
              done();
            });
        });
        it('should respond with error for empty number plate field', (done) => {
          chai.request(app)
            .post(`${base}buses`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
              number_plate: '',
              manufacturer: 'Toyota',
              model: 'Camry',
              year: '2015',
              capacity: 6,
            })
            .end((err, res) => {
              expect(res.status).to.equal(422);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body).to.have.property('error');
              done();
            });
        });
      });
      describe('Test manufacturer field', () => {
        it('should respond with error for missing manufacturer field', (done) => {
          chai.request(app)
            .post(`${base}buses`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
              number_plate: 'VAR435HG',
              model: 'Camry',
              year: '2015',
              capacity: 6,
            })
            .end((err, res) => {
              expect(res.status).to.equal(422);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body).to.have.property('error');
              done();
            });
        });
        it('should respond with error for empty manufacturer field', (done) => {
          chai.request(app)
            .post(`${base}buses`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
              number_plate: 'VAR456GF',
              manufacturer: '',
              model: 'Camry',
              year: '2015',
              capacity: 6,
            })
            .end((err, res) => {
              expect(res.status).to.equal(422);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body).to.have.property('error');
              done();
            });
        });
      });
      describe('Test model field', () => {
        it('should respond with error for missing model field', (done) => {
          chai.request(app)
            .post(`${base}buses`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
              number_plate: 'VAR456GF',
              manufacturer: 'Toyota',
              year: '2015',
              capacity: 6,
            })
            .end((err, res) => {
              expect(res.status).to.equal(422);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body).to.have.property('error');
              done();
            });
        });
        it('should respond with error for empty model field', (done) => {
          chai.request(app)
            .post(`${base}buses`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
              number_plate: 'VAR456GF',
              manufacturer: 'Toyota',
              model: '',
              year: '2015',
              capacity: 6,
            })
            .end((err, res) => {
              expect(res.status).to.equal(422);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body).to.have.property('error');
              done();
            });
        });
      });
      describe('Test year field', () => {
        it('should respond with error for missing year field', (done) => {
          chai.request(app)
            .post(`${base}buses`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
              number_plate: 'VAR456GF',
              manufacturer: 'Toyota',
              model: 'Camry',
              capacity: 6,
            })
            .end((err, res) => {
              expect(res.status).to.equal(422);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body).to.have.property('error');
              done();
            });
        });
        it('should respond with error for empty year field', (done) => {
          chai.request(app)
            .post(`${base}buses`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
              number_plate: 'VAR675GH',
              manufacturer: 'Toyota',
              model: 'Camry',
              year: '',
              capacity: 6,
            })
            .end((err, res) => {
              expect(res.status).to.equal(422);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body).to.have.property('error');
              done();
            });
        });
        it('should respond with error for invalid year field', (done) => {
          chai.request(app)
            .post(`${base}buses`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
              number_plate: 'VAR675GH',
              manufacturer: 'Toyota',
              model: 'Camry',
              year: 'GHTA',
              capacity: 6,
            })
            .end((err, res) => {
              expect(res.status).to.equal(422);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body).to.have.property('error');
              done();
            });
        });
      });
      describe('Test capacity field', () => {
        it('should respond with error for missing capacity field', (done) => {
          chai.request(app)
            .post(`${base}buses`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
              number_plate: 'VAR456GF',
              manufacturer: 'Toyota',
              model: 'Camry',
              year: '2015',
            })
            .end((err, res) => {
              expect(res.status).to.equal(422);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body).to.have.property('error');
              done();
            });
        });
        it('should respond with error for empty capacity field', (done) => {
          chai.request(app)
            .post(`${base}buses`)
            .set('Authorization', `Bearer ${admin_token}`)
            .send({
              number_plate: 'GHA564TH',
              manufacturer: 'Toyota',
              model: 'Camry',
              year: '2015',
              capacity: '',
            })
            .end((err, res) => {
              expect(res.status).to.equal(422);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body).to.have.property('error');
              done();
            });
        });
      });
    });
    describe('Admin can create trip', () => {
      it('should respond with status 201 and bus data', (done) => {
        chai.request(app)
          .post(`${base}buses`)
          .set('Authorization', `Bearer ${admin_token}`)
          .send(bus)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data.number_plate).to.equal(bus.number_plate);
            expect(res.body.data.manufacturer).to.equal(bus.manufacturer);
            expect(res.body.data.model).to.equal(bus.model);
            expect(res.body.data.year).to.equal(bus.year);
            expect(res.body.data.capacity).to.equal(bus.capacity);
            done();
          });
      });
    });
  });
});
