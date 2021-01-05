
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'linio',
    domain: 'linio.com.mx',
    url: 'https://www.linio.com.mx/search?scroll=&q={searchTerms}',
    loadedSelector: 'div[itemtype*="http://schema.org/Product"]',
    noResultsXPath: '//div[contains(@class,"text-content secondary-text")]',
    zipcode: '',
  },
};
