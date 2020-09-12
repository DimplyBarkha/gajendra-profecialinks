
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'melectronics',
    domain: 'melectronics.ch',
    loadedSelector: 'div[class="tiles--row"] > div[class="tiles--item slider--item"] a[class="u-reset"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
