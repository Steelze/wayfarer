import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import app from '../src/app';
import QueryBuilder from '../src/db/QueryBuilder';

chai.use(chaiHttp);

const base = '/api/v1/';
const user = {
  email: 'admin@blog.com',
  password: '123456',
};

describe('Test Login route', () => {
  before(() => QueryBuilder.truncate('users'));
  describe('Test user cannot signin with invalid credentials', () => {
    describe('Test email field', () => {
      it('should respond with error for missing email field', (done) => {
        chai.request(app)
          .post(`${base}auth/signin`)
          .send({
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error');
            done();
          });
      });
      it('should respond with error for empty email field', (done) => {
        chai.request(app)
          .post(`${base}auth/signin`)
          .send({
            email: '',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error');
            done();
          });
      });
      it('should respond with error for email field with white spaces', (done) => {
        chai.request(app)
          .post(`${base}auth/signin`)
          .send({
            email: '                           ',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error');
            done();
          });
      });
      it('should respond with error for invalid email', (done) => {
        chai.request(app)
          .post(`${base}auth/signin`)
          .send({
            email: 'admin@.com',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error');
            done();
          });
      });
      it('should respond with error for unregistered email', (done) => {
        chai.request(app)
          .post(`${base}auth/signin`)
          .send({
            email: 'admin@app.com',
            password: '123456',
          })
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.equal('Invalid credentials');
            done();
          });
      });
    });
    describe('Test password field', () => {
      it('should respond with error for missing password field', (done) => {
        chai.request(app)
          .post(`${base}auth/signin`)
          .send({
            email: 'admin@blog.com',
          })
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error');
            done();
          });
      });
      it('should respond with error for empty password field', (done) => {
        chai.request(app)
          .post(`${base}auth/signin`)
          .send({
            email: 'admin2@blog.com',
            password: '',
          })
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error');
            done();
          });
      });
      it('should respond with error for wrong password', (done) => {
        chai.request(app)
          .post(`${base}auth/signin`)
          .send({
            email: 'admin@blog.com',
            password: 'invalid',
          })
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.equal('Invalid credentials');
            done();
          });
      });
    });
  });
  describe('Test user can signin with valid credentials', () => {
    beforeEach((done) => {
      chai.request(app)
        .post(`${base}auth/signup`)
        .send({
          first_name: 'Way',
          last_name: 'Jeff',
          email: 'admin@blog.com',
          password: '123456',
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });
    it('should respond with status 201, token and user data', (done) => {
      chai.request(app)
        .post(`${base}auth/signin`)
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status', 'success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.all.keys('token', 'user');
          expect(res.body.data.user).to.have.any.keys('id', 'email', 'first_name', 'last_name', 'is_admin');
          expect(res.body.data.user.email).to.equal(user.email);
          done();
        });
    });
    afterEach(() => QueryBuilder.truncate('users'));
  });
});
