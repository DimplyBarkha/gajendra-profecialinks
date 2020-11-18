
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'nofrills',
    nextLinkSelector: "div[class='product-grid__results__footer'] div[class='load-more-button'] button",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'nofrills.ca',
    zipcode: '',
  },
};
