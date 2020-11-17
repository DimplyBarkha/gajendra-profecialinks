
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'perekrestok',
    domain: 'vprok.ru',
    url: 'https://www.vprok.ru/catalog/search?text=libero',
    loadedSelector: 'body',
    noResultsXPath: null ,
    zipcode: '',
  },
};
