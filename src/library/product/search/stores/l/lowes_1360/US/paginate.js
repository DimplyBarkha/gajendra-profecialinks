
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'lowes_1360',
    openSearchDefinition: {
      template: 'https://www.lowes.com/search?searchTerm={searchTerms}&page={page}#[!opt!]{"first_request_timeout":50000,"force200":true}[/!opt!]',
    },
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="items"] div[class="tile_group"]:last-child , section#main , div[id*="pd_row"]',
    noResultsXPath: '//h1[contains(text(),"NO RESULTS FOUND FOR")] | //div[@id="mainContent"] | //div[contains(@class ,"grid-container")] | //h1[contains(text(),"Something Went Wrong")] | //h1[contains(text(),"Access Denied")]',
    domain: 'lowes.com',
    zipcode: '',
  },
};
