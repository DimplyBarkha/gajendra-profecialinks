module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    domain: 'fust.ch',
    loadedSelector: 'div[class="inner n-bodycontainer__inner"]',
    noResultsXPath: '//meta[contains(@content,"Seite nicht gefunden")]',
    zipcode: '',
  },
};
