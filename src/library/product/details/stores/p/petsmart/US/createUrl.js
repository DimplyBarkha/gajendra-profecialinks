
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'petsmart.com',
    prefix: null,
    url: 'https://www.petsmart.com/search/?q={id}',
    country: 'US',
    store: 'petsmart',
    zipcode: '',
  },
};
