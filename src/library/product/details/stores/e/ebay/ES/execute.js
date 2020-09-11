
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'ebay',
    domain: 'ebay.es',
    loadedSelector: 'div#CenterPanelInternal',
    noResultsXPath: '//p[contains(text(),"We looked everywhere")]',
    zipcode: '',
  },
};
