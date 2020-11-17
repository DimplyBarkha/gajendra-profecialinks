
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PE',
    store: 'linio',
    domain: 'linio.com',
    url: 'https://www.linio.com.pe/search?scroll=&q=Puramino',
    // url: 'https://www.linio.com.pe/search?scroll=&q={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
