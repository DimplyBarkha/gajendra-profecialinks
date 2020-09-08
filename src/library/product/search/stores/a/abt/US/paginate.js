
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'abt',
    nextLinkSelector: 'div#hawkbottompager span.hawk-pageActive+a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#category_results',
    noResultsXPath: '//h2[@class="nopagetext"]',
    openSearchDefinition: null,
    domain: 'abt.com',
    zipcode: '',
  },
};
