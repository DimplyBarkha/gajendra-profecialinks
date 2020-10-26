
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'bhphotovideo',
    domain: 'bhphotovideo.com',
    loadedSelector: 'div[class*="productMedia"]',
    noResultsXPath: '//section[@class="body-404"]',
    zipcode: '',
  },
};
