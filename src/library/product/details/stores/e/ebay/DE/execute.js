
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'ebay',
    domain: 'ebay.de',
    loadedSelector: 'div#CenterPanelInternal',
    noResultsXPath: '//p[contains(text(),"We looked everywhere")]',
    zipcode: '',
  },
};
