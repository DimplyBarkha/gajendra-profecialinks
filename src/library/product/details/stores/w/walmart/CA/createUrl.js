
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'walmart.ca',
    prefix: 'search.do?q=',
    url: 'https://www.walmart.ca/search.do?q={id}',
    country: 'CA',
    store: 'walmart',
    zipcode: '',
  },
};
