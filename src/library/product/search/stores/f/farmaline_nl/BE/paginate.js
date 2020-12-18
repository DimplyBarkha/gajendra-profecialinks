
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'BE',
    store: 'farmaline_nl',
    nextLinkSelector: 'a[rel="nofollow"]',
    nextLinkXpath: '(//a[text()="next"])[2]',
    // mutationSelector: null,
    spinnerSelector: 'div#loadingPane',
    loadedSelector: 'ul#articleList',
    // loadedXpath: null,
    noResultsXPath: '//strong[contains(text(),"Geen producten gevonden.")]',
    // stopConditionSelectorOrXpath: null,
    // resultsDivSelector: null,
    // openSearchDefinition: null,
    domain: 'farmaline.be',
    zipcode: '',
  },
};
