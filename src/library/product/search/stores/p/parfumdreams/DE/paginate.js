
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'parfumdreams',
    //nextLinkSelector: 'div[class="right"] a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.parfumdreams.de/?m=5&search={searchTerms}&p={page}',
    },
    domain: 'parfumdreams.de',
    zipcode: '',
  },
};