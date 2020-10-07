
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'fnac.com',
    prefix: null,
    url: 'https://www.fnac.com/a{id}',
    country: 'FR',
    store: 'fnac',
    zipcode: '',
  },
};
