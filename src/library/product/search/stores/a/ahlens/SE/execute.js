
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    domain: 'ahlens.se',
    url: 'https://ahlensapiplatformprod.azure-api.net/personalized-products/?query={searchTerms}&start=0&rows=150&placement=search_page.find#[!opt!]{"type":"json"}[/!opt!]',
    //loadedSelector: 'body',
    noResultsXPath: '//div[@data-testid="AhSearchResults_noHitsErrorMessage"]',
    zipcode: '',
  },
};
