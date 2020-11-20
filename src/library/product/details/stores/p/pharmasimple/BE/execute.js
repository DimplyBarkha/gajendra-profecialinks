
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'pharmasimple',
    domain: 'pharmasimple.com',
    loadedSelector: 'div[class="primary_block row"]',
    noResultsXPath: '//div[@class="pagenotfound"] | //div[@class="product-container"]',
    zipcode: '',
  },
};
