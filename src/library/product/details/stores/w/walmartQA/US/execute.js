module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'walmartQA',
    domain: 'walmart.com',
    loadedSelector: '#questions-answers',
    noResultsXPath: '//*[@id="questions-answers"][not(//div[@class="ReviewList-content"])]',
  },
};
