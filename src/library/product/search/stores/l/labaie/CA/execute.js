
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'labaie',
    domain: 'labaie.com',
    url: 'https://www.labaie.com/search?q={searchTerms}&search-button=&lang=fr_CA&start=0&sz=24',
    loadedSelector: '.product-grid,.primary-images-wrapper',
    noResultsXPath: '//span[@class="search-no-result"]|//div[@class="home-page"]|//div[contains(@class,"error-page-main")]',
    zipcode: '',
  },
};
