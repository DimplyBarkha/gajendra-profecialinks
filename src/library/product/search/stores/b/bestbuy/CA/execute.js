
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    domain: 'bestbuy.ca',
    url: 'https://www.bestbuy.ca/api/v2/json/search?categoryid=&currentRegion=ON&include=facets%2C%20redirects&lang=en-CA&page=1&pageSize=50&path=&query={searchTerms}&exp=&sortBy=relevance&sortDir=desc#[!opt!]{"type":"json"}[/!opt!]',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
