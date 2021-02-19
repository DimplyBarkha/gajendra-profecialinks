
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'JP',
    store: 'wowma',
    domain: 'wowma.jp',
    url: 'https://wowma.jp/itemlist?keyword={searchTerms}',
    loadedSelector: 'div.searchListingItems',
    noResultsXPath: '//div[@class="notFoundMessageArea"]',
    zipcode: '',
  },
};
