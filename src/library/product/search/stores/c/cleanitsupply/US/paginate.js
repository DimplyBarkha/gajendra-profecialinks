
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'cleanitsupply',
    nextLinkSelector: 'a[onclick="CISCategoryGrid.goToNextPage(); return false;"]',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'ul.small-block-grid-2.medium-block-grid-3.large-block-grid-4.text-center.item-grid li',
    noResultsXPath: '//span[contains(text()," Your search did not return an exact match.")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'cleanitsupply.com',
    zipcode: '',
  },
};
