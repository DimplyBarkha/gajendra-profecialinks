
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'petbarn',
    nextLinkSelector: "div[class='more-products'] input[id='load-more-products']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'petbarn.com.au',
    zipcode: '',
  },
};
