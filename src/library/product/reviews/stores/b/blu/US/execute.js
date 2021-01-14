
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'blu',
    domain: 'blu.com',
    loadedSelector: 'div#reviews',
    noResultsXPath: '//span[contains(text(),"No reviews yet")| boolean(//div[@class="sc-1tgc0g2-2 ipFJnx"])',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
