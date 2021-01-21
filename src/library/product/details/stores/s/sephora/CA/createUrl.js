
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'sephora.ca',
    prefix: null,
    url: 'http://www.sephora.com/ca/en/search?keyword={id}',
    country: 'CA',
    store: 'sephora',
    zipcode: '',
  },
};
