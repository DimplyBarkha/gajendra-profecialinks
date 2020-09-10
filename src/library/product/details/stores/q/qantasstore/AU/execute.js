
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'qantasstore',
    domain: 'qantasstore.com.au',
    loadedSelector: 'head',
    noResultsXPath: '//div[@class="uid-EmptyResultsParagraphComponent"]',
    zipcode: '',
  },
};
