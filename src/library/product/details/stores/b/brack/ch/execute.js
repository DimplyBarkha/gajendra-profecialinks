
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ch',
    store: 'brack',
    domain: 'brack.ch',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@id,"searchInfo")]//*[contains(text(),"Leider konnten wir zu Ihrer Suchanfrage")]',
    zipcode: "''",
  },
};
