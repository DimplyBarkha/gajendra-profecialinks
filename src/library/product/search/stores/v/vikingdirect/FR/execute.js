
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'vikingdirect',
    domain: 'vikingdirect.fr',
    url: 'https://www.vikingdirect.fr/catalog/search.do?Ntt={searchTerms}',
    loadedSelector: 'div.clearfix.block.top, div#skuPageContentWrapper',
    noResultsXPath: '//h1[contains(text(), "Mince ! Rien ne correspond à ")]',
    zipcode: '',
  },
};
