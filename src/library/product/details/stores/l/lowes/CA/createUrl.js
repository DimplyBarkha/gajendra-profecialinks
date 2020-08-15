
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'lowes.ca',
    prefix: 'product',
    url: 'https://www.lowes.ca/product/{id}',
    country: 'CA',
    store: 'lowes',
    zipcode: '',
  },
};
