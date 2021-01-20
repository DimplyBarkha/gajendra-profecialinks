
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'staples',
    nextLinkSelector: 'div.ais-pagination-container li.ais-Pagination-item--nextPage a.ais-Pagination-link',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ais-results-as-block  div.ais-hits--item',
    noResultsXPath: '//div[@class="ais-hit-empty"]',
    openSearchDefinition: null,
    domain: 'staples.ca',
    zipcode: "''",
  },
};
