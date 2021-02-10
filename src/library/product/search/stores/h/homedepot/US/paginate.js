
module.exports = {
  // implements: 'product/search/paginate',
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    nextLinkSelector: null,
    // nextPageUrlSelector: 'a[aria-label="Next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img[class="stretchy"],div[class="product-details"]>div>span[class="product-title"] > h1',
    // loadedSelector: 'div.results-wrapped',
    // stopConditionSelectorOrXpath: null,
    stopConditionSelectorOrXpath: '//div[@class="product-details"]/div/span[@class="product-title"]/h1',
    noResultsXPath: null,
    // openSearchDefinition: null,
    openSearchDefinition: {
      // indexOffset: 0,
      // template: 'https://www.homedepot.com/s/{searchTerms}?NCNI-5&Nao={startIndex}',
      template: 'https://www.homedepot.com/s/{searchTerms}?NCNI-5&Nao={offset}',
    },
    domain: 'homedepot.com',
    zipcode: '',
  },
};

// ********************************

// module.exports = {
//   implements: 'navigation/paginate',
//   parameterValues: {
//     template: null,
//     country: 'US',
//     store: 'homedepot',
//     nextLinkSelector: null,
//     nextPageUrlSelector: null,
//     nextLinkXpath: null,
//     mutationSelector: null,
//     spinnerSelector: null,
//     loadedSelector: null,
//     loadedXpath: null,
//     noResultsXPath: null,
//     stopConditionSelectorOrXpath: null,
//     resultsDivSelector: null,
//     openSearchDefinition: null,
//     domain: 'homedepot.com',
//     zipcode: '',
//   },
// };
