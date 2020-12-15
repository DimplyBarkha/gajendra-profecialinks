
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'ES',
    store: 'bebitus',
    domain: 'bebitus.com',
    loadedSelector: 'div.ratings-bazaarvoice-overlay',
    noResultsXPath: '//div[contains(@class,"page-exception")]',
  },
};
