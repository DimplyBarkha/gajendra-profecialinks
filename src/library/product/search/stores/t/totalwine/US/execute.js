module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    domain: 'totalwine.com',
    url: 'https://www.totalwine.com/search/all?text={searchTerms}',
    // url: 'https://www.totalwine.com/search/all?text={searchTerms}&aty=1,1,1,1',
    loadedSelector: 'a[class="productImg__3fOOgAmO"] > picture > img',
    noResultsXPath: '//div[contains(.,"Not available in Sacramento")] | //*[contains(text(),"Not available in")]',
    zipcode: '',
  },
};
