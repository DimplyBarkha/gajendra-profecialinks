
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'sephora.com',
    prefix: null,
    url: 'http://sephora.com/search?keyword={id}',
    country: 'CA',
    store: 'sephora',
    zipcode: '',
  },
};
