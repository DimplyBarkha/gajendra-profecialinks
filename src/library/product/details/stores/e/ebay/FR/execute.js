
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'ebay',
    domain: 'ebay.fr',
    loadedSelector: 'div#CenterPanelInternal',
    noResultsXPath: '//p[contains(text(),"We looked everywhere")]',
    zipcode: '',
  },
};
