
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'viovet',
    nextLinkSelector: 'a[class="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'span[class="_results-view-option"]',
    noResultsXPath: '//h3[contains(. , "Here is a list of our most popular products:")] | //h1[contains(. , "Page Not Found") or contains(. , "did not match any products")]',
    resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://www.viovet.co.uk/advanced_search_result.php?keywords={searchTerms}&page={page}',
    //   pageStartNb: 1,
    // },
    domain: 'viovet.co.uk',
    zipcode: '',
  },
};
