
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'canadiantire.ca',
    prefix: 'search.do?q=',
    url: 'https://canadiantire.ca/search.do?q={id}',
    country: 'CA',
    store: 'canadiantire',
    zipcode: '',
  },
};
