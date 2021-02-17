
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'loblaws',
    domain: 'loblaws.ca',
    url: 'https://www.loblaws.ca/search?search-bar={searchTerms}',
    loadedSelector: 'li[class="product-tile-group__list__item"]',
    noResultsXPath: 'h2[class="search-no-results__section-title"]',
  },
};
