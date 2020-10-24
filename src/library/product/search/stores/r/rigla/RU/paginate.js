
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'rigla',
    nextLinkSelector: 'div.catalog-toolbar-pages div:not(.catalog-toolbar-pages__item_active):not(.catalog-toolbar-pages__separate_hidden)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.catalog-content',
    noResultsXPath: '//div[@class="search-results__counts" and text()="(0)"]',
    openSearchDefinition: null,
    domain: 'rigla.ru',
    zipcode: "''",
  },
};
