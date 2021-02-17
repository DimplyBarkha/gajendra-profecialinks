
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'amazon.com',
    prefix: null,
    // url: 'https://www.amazon.com/dp/product/{id}/?th=1&psc=1&showDetailProductDesc=1&s=amazonfresh&fpw=alm&language=en_US',
    url: 'https://www.amazon.com/dp/product/{id}?language=en_US&s=amazonfresh&th=1&psc=1&showDetailProductDesc=1&fpw=alm',
    // url: 'https://www.amazon.com/dp/product/{id}?s=amazonfresh&language=en_US',
    country: 'US',
    store: 'Freshamazon',
    zipcode: '90210',
  },
};
