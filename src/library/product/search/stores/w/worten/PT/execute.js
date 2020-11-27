
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PT',
    store: 'worten',
    domain: 'worten.pt',
    url: 'https://www.worten.pt/search?query={searchTerms}&sortBy=relevance&hitsPerPage=24&page=1',
    loadedSelector: 'div.w-product-list__row',
    // noResultsXPath:'//h2[contains(text(),"Algo não correu bem.")]'
  },
};
