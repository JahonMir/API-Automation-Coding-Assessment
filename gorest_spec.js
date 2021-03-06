//used Supertest library
const supertest = require('supertest');
const request = supertest('https://gorest.co.in/public-api/');
//CHAI as an assertion library
//EXPECT as an assertion style
const { expect } = require('chai');
//please use your unique TOKEN below
const myToken = 'your accsess token';

describe('gorest.co.in API tests', async function() {
    
    it('GET /users', async () => {
      const res = await request.get(`users?access-token=${myToken}`)
        expect(res.status).to.equal(200);
        expect(res.body.data).to.not.be.empty;
    });

    it('POST /users', async () => {
      const data = {
      email: `getrandomnumber-${Math.floor(Math.random()*999)}@mail.ru`,
      name: "Jerry",
      gender: "Male",
      status: "Active"
      };
      const res = await request.post('users')
        .set('Authorization', `Bearer ${myToken}`)
        .send(data) 
      expect(res.status).to.eq(200);
      expect(res.body.data).to.deep.include(data);
    });

    it('POST /users with empty data form',  async () => {
      const data = {};
      const res = await request.post('users')
        .set('Authorization', `Bearer ${myToken}`)
        .send(data)
      expect(res.body.code).to.equal(422);    
      expect(res.body.data[0]).to.have.property('message').to.include("can't be blank");
    });

    it("POST /posts", async () => {
      const data = {
        user_id: 777,
        title: 'Triple Seven',
        body: 'just triple sevens nothing special about them'
      };
      const res = await request.post('posts')
        .send(data)
        .set('Authorization', `Bearer ${myToken}`)
        //console.log(res.body);
        expect(res.body.code).to.eq(201);
        expect(res.body.data.user_id).to.eq(777);
        expect(res.body.data.title).to.include('Triple Seven');
        postUserId = res.body.data.user_id;
    });

    it('GET /posts/xxx', async () => {
      const res = await request.get(`posts/777`)
      .set('Authorization', `Bearer ${myToken}`)
      expect(res.body.code).to.eq(200);
      expect(res.body.data).to.not.be.empty;
    });

    it('POST /post with empty data form', async () => {
      const data = {};
      const res = await request.post('posts')
        .set('Authorization', `Bearer ${myToken}`)
        .send(data)
      expect(res.body.code).to.eq(422);    
      expect(res.body.meta).to.be.a('null');
    });

    it('should update users data', async () => {
      const data = {
        name: "007"
      };
      const res = await request.put('users/199')
        .set('Authorization', `Bearer ${myToken}`)
        .send(data)
      expect(res.body.code).to.eq(200);    
      expect(res.body.data).to.have.property('name').to.eq('007');
    });

    it('should update users data with wrong data type', async () => {
      const data = {
        status: "Very Active"
      };
      const res = await request.put('users/200')
        .set('Authorization', `Bearer ${myToken}`)
        .send(data)
      expect(res.body.code).to.eq(422);    
      expect(res.body.data[0]).to.have.property('message').to.eq('can be Active or Inactive');
    
    it('should return product categories data', async () => {
      const res = await request.get('product-categories')
      .set('Authorization', `Bearer ${myToken}`)
      expect(res.body.meta.pagination).to.have.property('total').to.be.a('number');
      expect(res.body.data).to.not.be.empty;
    });
  });
});
