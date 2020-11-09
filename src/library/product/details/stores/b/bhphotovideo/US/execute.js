
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'bhphotovideo',
    domain: 'bhphotovideo.com',
    loadedSelector: 'img[data-selenium="miniProductPageImg"], div[class*="details"]',
    noResultsXPath: '//span[contains(text(), "No results")]',
    zipcode: '',
  },
};
