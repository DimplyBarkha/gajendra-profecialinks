
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'group-digital',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="category-products"] > ul',
    noResultsXPath: '//p[@class="note-msg"]',
    openSearchDefinition: null,
    domain: 'group-digital.fr',
    zipcode: '',
  },
};
