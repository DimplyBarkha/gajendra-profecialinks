
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'but',
    domain: 'but.fr',
    url: 'https://www.but.fr/Common/Search/SearchProductsList?KeyWords={searchTerms}',
    loadedSelector: "div[class='content-page-liste'] div.product-container.short-product-title-line",
    noResultsXPath: '//div[@class="no-result-content"]',
    zipcode: '',
  },
};
