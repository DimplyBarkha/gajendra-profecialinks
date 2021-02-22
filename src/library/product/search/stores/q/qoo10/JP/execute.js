
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'JP',
    store: 'qoo10',
    domain: 'qoo10.jp',
    url: 'https://www.qoo10.jp/s/?keyword={searchTerms}',
    loadedSelector: 'div#div_gallery_new',
    noResultsXPath: '//div[@class="bd_nolst"]',
    zipcode: '',
  },
};
