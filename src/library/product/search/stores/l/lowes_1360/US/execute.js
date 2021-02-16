
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'lowes_1360',
    domain: 'lowes.com',
    url: 'https://www.lowes.com/search?searchTerm={searchTerms}#[!opt!]{"first_request_timeout":50000,"force200":true}[/!opt!]',
    loadedSelector: 'div[class="items"] div[class="tile_group"]:last-child , section#main ,  div[id*="pd_row"]',
    noResultsXPath: '//h1[contains(text(),"NO RESULTS FOUND FOR")] | //div[@id="mainContent"] | //div[contains(@class ,"grid-container")] | //h1[contains(text(),"Something Went Wrong")] | //h1[contains(text(),"Access Denied")]',
    zipcode: '',
  },
};
