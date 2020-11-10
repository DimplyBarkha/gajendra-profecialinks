
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ZA',
    store: 'clicks',
    nextLinkSelector: 'div[class="lastBox nextBtn "] a' ,
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div[class="wishplp"]',
    noResultsXPath: '//p[contains(text(),"Sorry,We found no results for")]',
    // resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://clicks.co.za/search?q={searchTerms}&page={page-1}',
    // },
    domain: 'clicks.co.za',
    zipcode: "''",
  },
};
