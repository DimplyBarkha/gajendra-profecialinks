
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'otto-office',
    domain: 'otto-office.com',
    url: 'https://www.otto-office.com/de/app/search/index?query%5Bquery%5D={searchTerms}&wkid=OO-6-DEhPQEeweqET8VaQpR&plid=nav-search',
    loadedSelector: "body",
    noResultsXPath: null,
    zipcode: '',
  },
};
