
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    domain: 'jumbo.com',
    loadedSelector: 'div.jum-page.gd-container',
    noResultsXPath: '//div[@class="jum-error-message"]',
    zipcode: '',
  },
};
