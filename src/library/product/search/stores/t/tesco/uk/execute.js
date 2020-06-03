
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'uk',
    store: 'tesco',
    domain: 'tesco.com',
    url: 'https://www.tesco.com/groceries/en-GB/search?query={searchTerms}',
    loadedSelector: 'div.product-image__container',
    noResultsXPath: '//div[@class="empty-section--heading"][contains(text(),"We didn\'t find anything for")]',
  },
};
