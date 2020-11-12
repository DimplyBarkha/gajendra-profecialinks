
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'kohls.com',
    prefix: null,
    url: 'https://www.kohls.com/product/prd-{id}/',
    country: 'US',
    store: 'kohls',
    zipcode: '',
  },
};
