
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    nextLinkXpath: '//a[contains(@class,"sku-list-page-next") and contains(@aria-disabled,"false")]',
    nextLinkSelector: 'a.sku-list-page-next[aria-disabled="false"]',
    //nextLinkSelector: 'a.sku-list-page-next',
    mutationSelector: null, //"ol.paging-list",
    spinnerSelector: null,
    loadedSelector: 'ol.sku-item-list',
    noResultsXPath: "//div[contains(@class,'no-result')] | //h1[@class='heading VPT-title' and text()='We’re sorry, something went wrong.']",
    // openSearchDefinition: {
    //   template: 'https://www.bestbuy.com/site/searchpage.jsp?st={searchTerms}&cp={page}',
    // },
    domain: 'bestbuy.com',
    zipcode: '',
  },
};
