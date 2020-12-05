
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'armani',
    domain: 'armani.com',
    loadedSelector: 'div[class="item-main-content"]',
    noResultsXPath: '//div[@id="info"]',
    zipcode: '',
  },
};
