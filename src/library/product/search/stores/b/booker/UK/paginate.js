
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    nextLinkSelector: 'div.search-results+div a.page-link[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'main.inner-list',
    noResultsXPath: '//p[contains(text(),"search returned no results")] | //h1[contains(text(),"The website is undergoing essential maintenance")] | //h1[contains(text(),"Sorry, this page does not exist")]',
    domain: 'booker.co.uk',
  },
};
