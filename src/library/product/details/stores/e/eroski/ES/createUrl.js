
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'supermercado.eroski.es',
    // prefix: null,
    url: 'https://supermercado.eroski.es/es/search/results/?q={id}',
    country: 'ES',
    store: 'eroski',
    zipcode: '',
  },
};
