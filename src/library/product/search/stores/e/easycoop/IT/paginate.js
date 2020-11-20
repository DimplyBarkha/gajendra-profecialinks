
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'easycoop',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ais-Hits',
    noResultsXPath: '//div[contains(@class,"results container results--empty")]',
    openSearchDefinition: null,
    domain: 'easycoop.it',
    zipcode: "''",
  },
};