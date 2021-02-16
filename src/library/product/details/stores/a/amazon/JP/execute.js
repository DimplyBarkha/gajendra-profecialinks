
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'JP',
    store: 'amazon',
    domain: 'amazon.co.jp',
    loadedSelector: 'div#dp, center span.h1',
    noResultsXPath: '//td/b[contains(text(),"Looking for something?")]',
    zipcode: '',
  },
};
