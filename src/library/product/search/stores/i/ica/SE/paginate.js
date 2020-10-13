
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'ica',
    nextLinkSelector: 'div.show-more-button-wrapper',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul.hZbUVv>li',
    noResultsXPath: '//ul[contains(@class,"hZbUVv")]/li',
    openSearchDefinition: null,
    domain: 'ica.se',
    zipcode: '10316',
  },
};