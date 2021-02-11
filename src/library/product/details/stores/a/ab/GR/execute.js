
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'GR',
    store: 'ab',
    domain: 'ab.gr',
    // loadedSelector: 'h1.page-title',
    loadedSelector: 'h1.page-title , #__next',
    // noResultsXPath: '//div[contains(@class,"ErrorPage")] | //meta[contains(@content,"errorPage")]',
    noResultsXPath: '//div[contains(@class,"ErrorPage")] | //meta[contains(@content,"errorPage")] | //div[contains(@class,"NoSearchResultsMessage")]',
  },
};
