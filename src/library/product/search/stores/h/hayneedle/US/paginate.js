
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'hayneedle',
    nextLinkSelector: 'button.pagination__showPrevNextPagintion___uz5y-',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-card__carousel___1CjvO > img',
    noResultsXPath: '//div[@class="search-null-results__sorryMessage___4RXAF"]',
    openSearchDefinition: null,
    domain: 'hayneedle.US',
    zipcode: '',
  },
};
