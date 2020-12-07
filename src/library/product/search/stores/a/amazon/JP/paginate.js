
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'JP',
    store: 'amazon',
    nextLinkSelector: 'div.a-text-center>ul.a-pagination>li.a-last>a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img.s-image',
    loadedXpath: null,
    noResultsXPath: '//div[@class="a-section a-spacing-base a-spacing-top-medium"]//span[@class="a-size-medium a-color-base"][1]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'amazon.jp',
    zipcode: '',
  },
};
