
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'romeos',
    domain: 'martinplace.romeosonline.com.au',
    url: 'https://martinplace.romeosonline.com.au/search?utf8=%E2%9C%93&q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="search-results__empty-message"]',
    zipcode: '',
  },
};
