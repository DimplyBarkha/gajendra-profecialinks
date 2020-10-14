
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BG',
    store: 'ebag',
    domain: 'ebag.bg',
    loadedSelector: 'div#detailed-view',
    noResultsXPath: '//div[@class="error-page-content"] | //span[@id="category-results-count"]',
    zipcode: '',
  },
};
