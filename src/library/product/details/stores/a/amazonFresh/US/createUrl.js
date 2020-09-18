
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'amazon.com',
    country: 'US',
    store: 'amazonFresh',
    url: 'https://amazon.com/dp/product/{id}/?fpw=alm&s=amazonfresh&fpw=fresh',
  },
};
