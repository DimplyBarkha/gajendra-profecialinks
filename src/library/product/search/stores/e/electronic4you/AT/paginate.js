
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'electronic4you',
    nextLinkSelector: 'div.toolbar-bottom a[title="Nächste"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul#products-list',
    noResultsXPath: '//p[@class="note-msg"]',
    openSearchDefinition: null,
    domain: 'electronic4you.at',
    zipcode: '',
  },
};
