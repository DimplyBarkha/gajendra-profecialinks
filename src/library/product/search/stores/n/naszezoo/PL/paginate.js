
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'naszezoo',
    nextLinkSelector: 'li.last a[title]',
    // nextLinkXpath: null,
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div.innerbox.cf> div',
    //loadedXpath: '//div[@class="innerbox.cf"]/div',
    noResultsXPath: '//div[@class="container"]/p[contains(text(),"Nie")]',
    // stopConditionSelectorOrXpath: null,
    resultsDivSelector: 'div.product-box',
    //openSearchDefinition: null,
    domain: 'naszezoo.pl',
    zipcode: '',
  },
};
