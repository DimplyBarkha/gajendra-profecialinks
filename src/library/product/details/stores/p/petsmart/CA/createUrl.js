
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'petsmart.ca',
    prefix: null,
    url: 'https://www.petsmart.ca/product-{id}.html',
    country: 'CA',
    store: 'petsmart',
    zipcode: '',
  },
};
