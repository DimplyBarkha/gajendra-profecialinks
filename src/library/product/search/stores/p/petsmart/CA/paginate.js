
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'CA',
    store: 'petsmart',
    nextLinkSelector: 'li.current-page + li',
    mutationSelector: null,
    spinnerSelector: 'div.loader',
    loadedSelector: 'ul#search-result-items li',
    noResultsXPath: '//p[contains(text(), "no results")] | //ul[@id="search-result-items" and not(li)]',
    // openSearchDefinition: {
    //   template: 'https://www.petsmart.ca/search/?q={searchTerms}&pmin=0.00&srule=relevance&start={index}&sz=36',
    //   pageStartNb: 0,
    //   pageIndexMultiplier: 36,
    // },
    domain: 'petsmart.ca',
    zipcode: '',
  },
};
