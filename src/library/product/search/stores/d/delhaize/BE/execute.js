
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'delhaize',
    domain: 'delhaize.be',
    url: 'https://www.delhaize.be/nl-be/shop/search?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="NoSearchResultsMessage"]',
    zipcode: '',
  },
};
