//used Supertest library
const supertest = require('supertest');
const request = supertest('https://gorest.co.in/public-api/');
//CHAI as an assertion library
//EXPECT as an assertion style
const { expect } = require('chai');
//please use your unique TOKEN below
const myToken = 'your token';

describe('gorest.co.in API tests', async function() {
  it('GET /users', () => {
    request.get(`users?access-token=${myToken}`).end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body.data).to.not.be.empty;
    });
  });
  it('POST /users', () => {
    const data = {
    email: `getrandomnumber-${Math.floor(Math.random()*999)}@mail.ru`,
    name: "Jerry",
    gender: "Male",
    status: "Active"
    };
    return request.post('users')
      .set('Authorization', `Bearer ${myToken}`)
      .send(data)
      .then((res) => {
    expect(res.status).to.eq(200);
    expect(res.body.data).to.deep.include(data);
    });
  });

  it('POST /users with empty data form', () => {
    const data = {};
    return request.post('users')
      .set('Authorization', `Bearer ${myToken}`)
      .send(data)
      .then((res) => {
    expect(res.body.code).to.equal(422);    
    expect(res.body.data[0]).to.have.property('message').to.include("can't be blank");
    });
  });

  it('should return product categories data', () => {
    return request.get('product-categories')
    .set('Authorization', `Bearer ${myToken}`)
    .then(res => {
    //console.log(res.body);
    expect(res.body.meta.pagination).to.have.property('total').to.be.a('number');
    expect(res.body.data).to.not.be.empty;
    });
  });

  it("should return requested user's post data", () => {
    return request.get('posts/200')
      .set('Authorization', `Bearer ${myToken}`)
      .then((res) => {
    expect(res.body.data.user_id).to.eq(188);
    expect(res.body.data.title).to.include('Sum quo universe vitae vomito');
    });
  });

  it('POST /post with empty data form', () => {
    const data = {};
    return request.post('posts')
      .set('Authorization', `Bearer ${myToken}`)
      .send(data)
      .then((res) => {
    expect(res.body.code).to.eq(422);    
    expect(res.body.meta).to.be.a('null');
    });
  });

  it('should update users data', () => {
    const data = {
      name: "007"
    };
    return request.put('users/199')
      .set('Authorization', `Bearer ${myToken}`)
      .send(data)
      .then((res) => {
    expect(res.body.code).to.eq(200);    
    expect(res.body.data).to.have.property('name').to.eq('007');
    });
  });

  it('should update users data with wrong data type', () => {
    const data = {
      status: "Very Active"
    };
    return request.put('users/200')
      .set('Authorization', `Bearer ${myToken}`)
      .send(data)
      .then((res) => {
    expect(res.body.code).to.eq(422);    
    expect(res.body.data[0]).to.have.property('message').to.eq('can be Active or Inactive');
    });
  });
});