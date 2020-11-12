
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'viovet',
    domain: 'viovet.co.uk',
    url: 'https://www.viovet.co.uk/advanced_search_result.php?keywords={searchTerms}',
    loadedSelector: 'span[class="_results-view-option"]',
    noResultsXPath: '//h3[@style="margin-top:10px;"]',
    zipcode: '',
  },
};
