
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'keurig',
    domain: 'keurig.com',
    url: 'https://www.keurig.com/search?text={searchTerms}',
    loadedSelector: 'div.top_content img,img#base_image',
    noResultsXPath: '//div[@class="search-result-heading-empty"] | //h1[contains(.,"Sorry...")] | //div[contains(@class,"grid-area") and contains(.,"No products found")] | //div[contains(@class,"availablity-form")]',
    zipcode: '',
  },
};
