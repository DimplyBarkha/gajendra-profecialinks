
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SA',
    store: 'virginmegastore',
    nextLinkSelector: 'li.pagination-wrapper__item.pagination-wrapper__item--next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.product-listing.product-list__item-wrapper',
    noResultsXPath: '//h2[@class="search-empty__headline text-center"]',
    openSearchDefinition: null,
    domain: 'virginmegastore.sa',
    zipcode: '',
  },
};
