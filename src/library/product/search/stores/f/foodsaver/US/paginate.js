
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'foodsaver',
    // nextLinkSelector: 'div.search-result-options > div> ul> li.current-page +li',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div.search-result-content >ul >li',
    noResultsXPath: '//div[contains(@class,"no-hits-container")]',
    openSearchDefinition: null,
    domain: 'foodsaver.com',
    zipcode: '',
  },
};
