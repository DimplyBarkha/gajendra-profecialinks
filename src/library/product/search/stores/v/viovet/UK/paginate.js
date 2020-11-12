
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'viovet',
    nextLinkSelector: 'a[class="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'span[class="_results-view-option"]',
    noResultsXPath: '//h3[@style="margin-top:10px;"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'viovet.co.uk',
    zipcode: '',
  },
};
