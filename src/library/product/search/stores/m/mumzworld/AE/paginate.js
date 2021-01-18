
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'AE',
    store: 'mumzworld',
    nextLinkSelector: '#paginationbottom > div > ol > li:last-child > a[onclick *="gotoPage"]',
    mutationSelector: 'span#stats div[@class="stats"] h2',
    spinnerSelector: 'div[id="alg_showloaderdv"][style=""]',
    loadedSelector: 'div#hits ul[class *="products-grid"]',
    noResultsXPath: '//div[@id="algolai_no_results" and @style="display:none"]',
    openSearchDefinition: null,
    domain: 'mumzworld.com',
    zipcode: '',
  },
};
