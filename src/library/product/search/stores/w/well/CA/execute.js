
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'well',
    domain: 'well.ca',
    url: 'https://well.ca/searchresult.html?keyword={searchTerms}',
    loadedSelector: 'div#categories_main_content div.product-item',
    noResultsXPath: '(//div[@class="search_results_message"]//p)[1]',
    zipcode: '',
  },
};
