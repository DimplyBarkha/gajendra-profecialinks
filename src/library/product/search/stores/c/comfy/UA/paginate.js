
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UA',
    store: 'comfy',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.js-products-list-wrap',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'comfy.ua',
    zipcode: '',
  },
};
