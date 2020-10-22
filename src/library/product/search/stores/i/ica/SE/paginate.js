
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'ica',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#component-wrapper',
    noResultsXPath: '//div[@id="component-wrapper"]//ul[contains(@class,"hZbUVv") and not(li)]',
    openSearchDefinition: null,
    domain: 'ica.se',
    zipcode: '10316',
  },
};