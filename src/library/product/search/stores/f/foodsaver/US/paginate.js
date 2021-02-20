
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'foodsaver',
    nextLinkSelector: null, //'div.search-result-options > div> ul> li.current-page +li',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id*="product-search-results"] div.product-search-grid div.product-grid-wrapper div.product-grid div.product', //'div.search-result-content >ul >li',
    noResultsXPath: '//div[@id="content-search-results"]//div[@class="result-count-wrapper-js"]//div[contains(@class,"result-count")]', //'//div[contains(@class,"no-hits-container")]',
    openSearchDefinition: null,
    domain: 'foodsaver.com',
    zipcode: '',
  },
};
