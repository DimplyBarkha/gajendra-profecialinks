
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'lyreco',
    domain: 'lyreco.com',
    url: 'https://www.lyreco.com/webshop/NLNL/welcome?lc={searchTerms}',
    loadedSelector: 'img.imgRoco',
    noResultsXPath: '//div[contains(@class,"DidYouMean")]//b',
    zipcode: '',
  },
};
