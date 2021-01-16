
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'officemag',
    nextLinkSelector: 'li.forw',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.listItemsContainer',
    noResultsXPath: '//div[@class="searchPageForm"]',
    openSearchDefinition: null,
    domain: 'officemag.ru',
    zipcode: '',
  },
};
