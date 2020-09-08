
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'abt',
    nextLinkSelector: 'div#hawkbottompager a.hawk-arrowRight',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#category_results_list',
    noResultsXPath: '//h2[@class="nopagetext"]',
    openSearchDefinition: null,
    domain: 'abt.com',
    zipcode: '',
  },
};
