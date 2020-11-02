
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'reservebar.com',
    prefix: null,
    url: 'https://www.reservebar.com/search?q={id}',
    country: 'US',
    store: 'reservebar',
    zipcode: '',
  },
};
