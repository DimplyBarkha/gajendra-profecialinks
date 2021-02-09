
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'viovet',
    domain: 'viovet.co.uk',
    url: 'https://www.viovet.co.uk/advanced_search_result.php?keywords={searchTerms}',
    loadedSelector: 'span[class="_results-view-option"]',
    noResultsXPath: '//h3[contains(. , "Here is a list of our most popular products:")] | //h1[contains(. , "Page Not Found")]',
    zipcode: '',
  },
};
