'use strict';

let request = require('supertest');
let expect = require('chai').expect;
let helper = require('../../helper.js');
let faker = require('faker');
let app = require('../../../server/app');

describe('Users', function() {
	describe('.list - GET /api/users', function() {
		it('no token provided', function(done) {
      request(app)
        .get('/api/users')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.have.property('message', 'no token provided');
          done();
        });
    });

    it('invalid token', function(done) {
      request(app)
        .get('/api/users')
        .set('token', helper.user.invalidToken)
        .expect(401, {message: 'invalid token'}, done);
    });

    it('list', function(done) {
      request(app)
        .get('/api/users')
        .set('token', helper.user.token)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.instanceOf(Array);
          done();
        });
    });
	});

	describe('.create - POST /api/users', function() {
		it('no token provided', function(done) {
      request(app)
        .post('/api/users')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.have.property('message', 'no token provided');
          done();
        });
    });

    it('invalid token', function(done) {
      request(app)
        .post('/api/users')
        .field('token', helper.user.invalidToken)
        .expect(401, {message: 'invalid token'}, done);
    });

    it('create', function(done) {
      request(app)
        .post('/api//users')
        .set('token', helper.user.token)
        .field('test', 'true')
        .field('email', faker.internet.email())
        .field('password', faker.internet.password())
        .end(function(err, res) {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.property('id');
          done();
        });
    });
	});

	describe('.get - GET /api/users/:id', function() {
		it('no token provided', function(done) {
      request(app)
        .get('/api/users/'+helper.user._id)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.have.property('message', 'no token provided');
          done();
        });
    });

    it('invalid token', function(done) {
      request(app)
        .get('/api/users/'+helper.user._id+'?token='+helper.user.invalidToken)
        .expect(401, {message: 'invalid token'}, done);
    });

    it('not found', function(done) {
      request(app)
        .get('/api/users/'+helper.user._id.toString().replace(/^.{2}/, 'dd'))
        .set('token', helper.user.token)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.equal(null);
          done();
        });
    });

    it('get user', function(done) {
      request(app)
        .get('/api/users/'+helper.user._id.toString())
        .set('token', helper.user.token)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('_id', helper.user._id.toString());
          expect(res.body).to.have.property('email', helper.user.email);
          expect(res.body).to.have.property('createdAt');
          expect(res.body).to.not.have.property('password');
          expect(res.body).to.not.have.property('__v');
          done();
        });
    });
	});
});

