
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    openSearchDefinition: {
      template: 'https://www.lowes.com/search?searchTerm={searchTerms}&page={page}',
    },
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="items"] div[class="tile_group"]:last-child , section#main , div[id*="pd_row"]',
    noResultsXPath: '//h1[contains(text(),"NO RESULTS FOUND FOR")] | //h1[contains(text(),"Something Went Wrong")] | //h1[contains(text(),"Access Denied")]',
    domain: 'lowes.com',
    zipcode: '',
  },
};
