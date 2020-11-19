
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'delhaize_FR',
    domain: 'delhaize_FR.be',
    url: 'https://www.delhaize.be/fr-be/shop/search?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="NoSearchResultsMessage"]',
    zipcode: '',
  },
};
