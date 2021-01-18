
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'sephora.com',
    prefix: null,
    url: 'https://www.sephora.com/ca/en/search?keyword={id}&pageSize=150',
    country: 'CA',
    store: 'sephora',
    zipcode: '',
  },
};
