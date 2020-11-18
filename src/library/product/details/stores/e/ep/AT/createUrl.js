
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'ep.at',
    prefix: null,
    url: 'https://www.ep.at/search/?text={id}',
    country: 'AT',
    store: 'ep',
    zipcode: '',
  },
};
