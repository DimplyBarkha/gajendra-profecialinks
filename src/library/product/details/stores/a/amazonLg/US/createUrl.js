module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'amazon.com',
    prefix: 'dp',
    country: 'US',
    store: 'amazonLg',
    url: 'https://amazon.com/dp/{id}?th=1&psc=1',
    zipcode: '',
  },
};
