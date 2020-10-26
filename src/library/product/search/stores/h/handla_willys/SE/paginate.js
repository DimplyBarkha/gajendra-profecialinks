
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'handlawillys',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ax-search-result',
    noResultsXPath: '//div[contains(@class,"no-search-result")]',
    // openSearchDefinition: null,
    domain: 'willys.se',
    zipcode: '',
  },
};