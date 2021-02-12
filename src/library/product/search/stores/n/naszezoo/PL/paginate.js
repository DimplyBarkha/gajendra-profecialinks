
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'naszezoo',
    nextLinkSelector: 'li.last a[title]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.innerbox.cf>div',
    loadedXpath: null,
    // noResultsXPath: '//div[@class="container"]/p[contains(text(),"Nie")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'naszezoo.pl',
    zipcode: '',
  },
};
