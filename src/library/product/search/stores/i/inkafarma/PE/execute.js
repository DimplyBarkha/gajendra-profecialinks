
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PE',
    store: 'inkafarma',
    domain: 'inkafarma.pe',
    url: 'https://inkafarma.pe/buscador?keyword={searchTerms}',
    loadedSelector: 'img.img-fluid',
    noResultsXPath: '//div[@id="noresultsBar"]//span//strong',
    zipcode: '',
  },
};
