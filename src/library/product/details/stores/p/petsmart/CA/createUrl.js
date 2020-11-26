
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'petsmart.ca',
    prefix: null,
    url: 'https://www.petsmart.ca/search/?q={id}',
    country: 'CA',
    store: 'petsmart',
    zipcode: '',
  },
};
