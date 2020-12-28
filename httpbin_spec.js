//used axios since the library Request-Promise has been deprecated
const axios = require('axios');
//CHAI as an assertion library
//EXPECT as an assertion style
const { expect } = require('chai');
const baseUrl = 'http://httpbin.org';
const headersContentType = 'content-type';

describe('httpbin API tests', async function() {
  //Response codes - Generates responses with given status code
  it('Response code is 201', async function() {
    const statusGetRequest = await axios.get(baseUrl + '/status/201');
    expect(statusGetRequest.status).to.equal(201);
    expect(statusGetRequest.statusText).to.equal('CREATED');
  });

  //Response inspection - Inspect the response data like caching and headers
  it('should Return 304 if an `If-Modified-Since` or `If-None-Match` present. Otherwise 200 OK', async function() {
    const cacheGetRequest = await axios.get(baseUrl + '/cache');
    //Cached response code equals 200
    expect(cacheGetRequest.status).to.equal(200);
    //Returns a 304 if an If-Modified-Since header or If-None-Match is present. Returns the same as a GET otherwise
    expect(cacheGetRequest.headers).to.not.have.any.keys('if-modified-since', 'if-none-match');
  }); 

  it("Response header's property `cache-control` should return proper value", async function() {
    const cacheGetRequest = await axios.get(baseUrl + '/cache/10');
    expect(cacheGetRequest.headers).to.have.property('cache-control', 'public, max-age=10')
  }); 

  it('`Freeform` is present in response headers with its proper value', async function() {
    const responseHeadersPostRequest = await axios.post(baseUrl + '/response-headers?freeform=Type-in-anything');
    expect(responseHeadersPostRequest.headers).to.have.property('freeform').to.include('Type-in-anything');
  });

  //Response Formats - Returns responses in different data formats
  it('Response headers should include property `content-length` and its proper value', async function() {
    const denyGetRequest = await axios.get(baseUrl + '/deny');
    expect(denyGetRequest.headers).to.have.property('content-length').to.include(239);
  });
  //Negative test
  it('Response headers should include property `content-length` and its proper value', async function() {
    const denyGetRequest = await axios.get(baseUrl + '/deny');
    expect(denyGetRequest.headers).to.have.property('content-length').to.not.include(230);
  }); 
  
  //Positive test
  it('Response headers should include property `content-type` and its proper value', async function() {
    const denyGetRequest = await axios.get(baseUrl + '/html');
    expect(denyGetRequest.headers).to.have.property(headersContentType).to.include('text/html');
  });
  
  //Image - Returns different image formats
  it('Should return right image type based on request', async function() {
    const imageGetRequest = await axios.get(baseUrl + '/image/webp');
    expect(imageGetRequest.headers).to.have.property(headersContentType).to.include('image/webp');
  });
});