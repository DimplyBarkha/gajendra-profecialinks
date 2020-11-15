
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'woolworths',
    // nextLinkSelector: null,
    nextLinkXpath: '//span[contains(text(),"Go to Next Page")]/../i',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div.ng-trigger-staggerFadeInOut',
    // loadedXpath: null,
    noResultsXPath: '//span[contains(text(),"Unfortunately, we could")]',
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    // openSearchDefinition: null,
    // openSearchDefinition: {
    //   template: 'https://www.woolworths.com.au/shop/search/products?searchTerm={searchTerms}&pageNumber=', 
    // },
    domain: 'woolworths.com.au',
    zipcode: "''",
  },
};
