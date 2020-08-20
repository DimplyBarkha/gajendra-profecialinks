module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'amazon.com',
    prefix: 'dp',
    country: 'US',
    store: 'amazonLg',
    // url: 'https://amazon.com/dp/{id}?th=1&psc=1',
    url: 'https://amazon.com/dp/{id}?th=1&language=en_US&showDetailProductDesc=1#productDescription_feature_div',
    zipcode: '',
  },
};
