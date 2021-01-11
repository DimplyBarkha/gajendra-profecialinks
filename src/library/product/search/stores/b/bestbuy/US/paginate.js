
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    // nextLinkSelector: 'a.sku-list-page-next[aria-disabled="false"]',
    mutationSelector: null, //"ol.paging-list",
    spinnerSelector: null,
    loadedSelector: 'ol.sku-item-list',
    noResultsXPath: "//div[contains(@class,'no-result')] | //h1[@class='heading VPT-title' and text()='We’re sorry, something went wrong.']",
    openSearchDefinition: {
      template: 'https://www.bestbuy.com/site/searchpage.jsp?st={searchTerms}&cp={page}',
    },
    domain: 'bestbuy.com',
    zipcode: '',
  },
};
