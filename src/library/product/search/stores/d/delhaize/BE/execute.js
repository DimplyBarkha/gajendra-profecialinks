
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'delhaize',
    domain: 'delhaize.be',
    url: 'https://www.delhaize.be/fr-be/shop/search?q={searchTerms}',
    loadedSelector: 'div.ctoKut',
    noResultsXPath: '//div[contains(@class, "sc-3brks3-2")]/p/span',
    zipcode: '',
  },
};
