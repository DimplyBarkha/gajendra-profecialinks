
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'woolworths_sydney',
    nextLinkSelector: 'div.paging-section>a.paging-next',
    nextLinkXpath: null,//'//div[@class="paging-section"]/a[contains(@class,"paging-next")]',//'//span[contains(text(),"Go to Next Page")]/../i',
    mutationSelector: null,
    spinnerSelector: 'div.product-grid--tile div.ghostTile-tile',
    loadedSelector: 'main#center-panel',
    loadedXpath: null,
    noResultsXPath: '//span[contains(text(),"Unfortunately, we could")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'woolworths.com.au',
    zipcode: '',
  },
};
