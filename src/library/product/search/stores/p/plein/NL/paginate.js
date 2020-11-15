
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    // nextLinkSelector: null,
    //nextLinkXpath: '//ul[@class="pagination"]//a[contains(text(),">")]', 
    // nextLinkXpath: '(//a[contains(text(),">")])[position()=1]',
    // '//ul[@class="pagination"]/li[position()=last()]/a',
    // mutationSelector: null,
    // spinnerSelector: null,
    //loadedSelector: 'div.clear.product-grid-view',
    loadedXpath: '//div[contains(@class,"product-view-container")]',
    // noResultsXPath: null,
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.plein.nl/zoeken?search={searchTerms}&p={page}', 
    },
    domain: 'plein.nl',
    zipcode: "''",
  },
};
