
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'staples.com',
    prefix: null,
    url: 'https://www.staples.com/product_{id}',
    country: 'US',
    store: 'staples',
    zipcode: '',
  },
};
