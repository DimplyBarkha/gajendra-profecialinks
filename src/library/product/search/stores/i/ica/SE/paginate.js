
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'ica',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    //loadedSelector: 'ul.hZbUVv>li',
    // noResultsXPath: '//ul[contains(@class,"hZbUVv") and not(li)]',
    loadedSelector:'div.main-content',
    noResultsXPath: '//header[@class="results-header grid_fluid"]',
    openSearchDefinition: null,
    domain: 'ica.se',
    zipcode: '10316',
  },
};