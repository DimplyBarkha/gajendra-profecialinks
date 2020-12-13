
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'delhaize',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ctoKut',
    noResultsXPath: '//div[contains(@class, "sc-3brks3-2")]/p/span',
    openSearchDefinition: null,
    domain: 'delhaize.be',
    zipcode: '',
  },
};
