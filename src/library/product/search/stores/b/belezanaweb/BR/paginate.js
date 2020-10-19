
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'belezanaweb',
    nextLinkSelector: "div[class='showcase-gondola'] button",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'belezanaweb.com.br',
    zipcode: '',
  },
};
