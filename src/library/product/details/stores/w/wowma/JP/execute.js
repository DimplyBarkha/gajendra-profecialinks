
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'JP',
    store: 'wowma',
    domain: 'wowma.jp',
    loadedSelector: 'div#contents',
    noResultsXPath: '//body[@class="error"]',
    zipcode: '',
  },
};
