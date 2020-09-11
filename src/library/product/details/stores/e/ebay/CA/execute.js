
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'ebay',
    domain: 'ebay.ca',
    loadedSelector: 'div#CenterPanelInternal',
    noResultsXPath: '//p[contains(text(),"We looked everywhere")]',
    zipcode: '',
  },
};
