
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'sephora',
    nextLinkSelector: "div.nm-search-results-container > div.nm-total-pagination >  div.neemu-pagination-container >  ul.neemu-pagination > li.neemu-pagination-next",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "div.nm-product-img-container > a.product-image >img",
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'sephora.com.br',
    zipcode: '',
  },
};

