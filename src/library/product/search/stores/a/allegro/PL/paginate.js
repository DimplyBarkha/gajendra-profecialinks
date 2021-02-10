
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'PL',
    store: 'allegro',
    nextLinkSelector: 'div[data-box-name="pagination bottom"] [data-role="next-page"] i',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.opbox-listing',
    loadedXpath: null,
    noResultsXPath: '//div[@class="opbox-listing"]//p[contains(@class,"mp0t_ji")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'allegro.pl',
    zipcode: '',
  },
};
