
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    // nextLinkSelector: 'ul[class="pagination__units"]>li[data-test="current_page"]+li>a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*=product-grid__card] > div[class*=product-card]',
    noResultsXPath: '//h1[contains(text(),"Geen resultaten voor")]',
    openSearchDefinition: {
      template: 'https://www.coolblue.nl/zoeken?query={searchTerms}&pagina={page}',
    },
    domain: 'coolblue.nl',
    zipcode: '',
  },
};
