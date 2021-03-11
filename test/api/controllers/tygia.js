var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers',function(){

    describe('tygia',function(){

        describe('GET /crawlTyGia',function(){

            it('should return TyGia', function(done){

                request(server)
                .get('/crawlTyGia')
                .query({currency: 'CNY',type: 'Buy',date: ''})
                .set('Accept','application/json')
                .expect('Content-Type',/json/)
                .expect(200)
                .end(function(err,res){
                    should.not.exist(err);
                    res.body.should.eql({"result":"3,471.75"});
                    done();
                });
            });
        });

    });

});