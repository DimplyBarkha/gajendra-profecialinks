
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'lyreco',
    domain: 'lyreco.com',
    url: 'https://www.lyreco.com/webshop/NLNL/welcome?lc={searchTerms}',
    loadedSelector: 'div.picture_grid a.prod_visu img',
    noResultsXPath: '//div[contains(@class,"DidYouMean")]//b',
    zipcode: '',
  },
};
