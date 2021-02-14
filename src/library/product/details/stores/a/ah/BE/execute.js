module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    domain: 'ah.be',
    loadedSelector: null,
    noResultsXPath: '//*[contains(text(),"helaas, we konden dit product niet vinden")]',
    zipcode: '',
  },
};
