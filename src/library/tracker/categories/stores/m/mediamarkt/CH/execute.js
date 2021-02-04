
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt',
    domain: 'mediamarkt.ch',
    loadedSelector: 'header#rise-header div.ms-header2__inner.ms-container',
    noResultsXPath: null,
    zipcode: '',
  },
};
