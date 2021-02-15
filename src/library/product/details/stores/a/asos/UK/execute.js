
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'asos',
    domain: 'asos.com',
    loadedSelector: '.gallery-aside-wrapper img',
    noResultsXPath: '//script[contains(@src,"homepage")] | //p[@class="title-message"][contains(.,"can\'t find that page")]',
    zipcode: '',
  },
};
