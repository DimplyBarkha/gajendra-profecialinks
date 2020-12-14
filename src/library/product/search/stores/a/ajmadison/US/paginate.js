
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'ajmadison',
    nextLinkSelector: 'a[class="link-alt line-height-1 px05 search-page__pagination-next"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    // openSearchDefinition: {
    //   template: 'https://www.ajmadison.com/b.php/Nao~10000%3BNtt~{searchTerms}',
    // },
    domain: 'ajmadison.com',
    zipcode: '',
  },
};
