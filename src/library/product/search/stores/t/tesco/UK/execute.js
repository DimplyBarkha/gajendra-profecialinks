module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    domain: 'tesco.com',
    url: 'https://www.tesco.com/groceries/en-GB/search?query={searchTerms}&count=48',
    loadedSelector: 'div.product-image__container > img',
    noResultsXPath: '//div[@class="empty-section--heading"][contains(text(),"We didn\'t find anything for")] | //*[contains(text(),"No products found for")]',
  },
};
