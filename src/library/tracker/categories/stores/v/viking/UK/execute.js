
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'UK',
    store: 'viking',
    domain: 'viking-direct.co.uk',
    loadedSelector: 'div#siteNavigation',
    noResultsXPath: '//div[@id="searchEmpty"] | //li[@class="search-results__result"] | //div[@id="alertWarning_0"] | //div[contains(@class,"deal-banner")]',
    zipcode: '',
  },
};
