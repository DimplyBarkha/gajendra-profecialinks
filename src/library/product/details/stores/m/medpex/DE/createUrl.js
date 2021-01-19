module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'medpex.de',
    prefix: null,//'search.do?q=',
    url: null,//'https://medpex.de/search.do?q={id}',
    country: 'DE',
    store: 'medpex',
  },
};
