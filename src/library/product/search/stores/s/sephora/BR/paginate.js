
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'sephora',
    nextLinkSelector: "div[class='nm-search-results-container col-main'] div[class='nm-total-pagination'] div[class='neemu-pagination-container'] ul[class='neemu-pagination'] li",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'sephora.com.br',
    zipcode: '',
  },
};
