
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'bhphotovideo',
    domain: 'bhphotovideo.com',
    loadedSelector: 'a[data-selenium="miniProductPageProductNameLink"]',
    noResultsXPath: '//span[contains(text(), "No results")]',
    zipcode: '',
  },
};
