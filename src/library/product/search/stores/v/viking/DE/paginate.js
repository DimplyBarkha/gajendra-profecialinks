
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'DE',
    store: 'viking',
    nextLinkSelector: 'a#paginationPageNext[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main#siteContent',
    noResultsXPath: '//div[@id="searchEmpty"] | //div[@id="productPage"]',
    openSearchDefinition: null,
    domain: 'viking.de',
    zipcode: '',
  },
};
