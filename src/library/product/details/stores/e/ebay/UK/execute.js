
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'ebay',
    domain: 'ebay.co.uk',
    loadedSelector: 'div#CenterPanelInternal',
    noResultsXPath: '//p[contains(text(),"We looked everywhere")]',
    zipcode: '',
  },
};
