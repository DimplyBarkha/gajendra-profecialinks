
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'GR',
    store: 'ab',
    domain: 'ab.gr',
    loadedSelector: 'h1.page-title',
    noResultsXPath: '//div[contains(@class,"ErrorPage")] | //meta[contains(@content,"errorPage")]',
  },
};
