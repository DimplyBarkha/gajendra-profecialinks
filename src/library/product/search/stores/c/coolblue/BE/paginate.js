
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    nextLinkSelector: 'a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: '#product-results[class*=product-grid--loading]',
    loadedSelector: 'div[class*=product-grid__card] > div[class*=product-card]',
    noResultsXPath: '//h1[contains(text(), "Geen resultaten voor")]',
    openSearchDefinition: null,
    domain: 'coolblue.be',
    zipcode: '',
  },
};
