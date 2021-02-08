module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'medpex.de',
    prefix: 'search.do?q=',
    url: 'https://medpex.de/search.do?q={id}',
    country: 'DE',
    store: 'medpex',
  },
};
