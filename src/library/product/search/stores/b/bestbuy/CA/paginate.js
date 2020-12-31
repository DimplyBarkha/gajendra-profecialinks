
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'CA',
    store: 'bestbuy',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      pageNb: 1,
      template: 'https://www.bestbuy.ca/api/v2/json/search?categoryid=&currentRegion=ON&include=facets%2C%20redirects&lang=en-CA&page={page}&pageSize=50&path=&query={searchTerms}&exp=&sortBy=relevance&sortDir=desc#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'bestbuy.ca',
    zipcode: '',
  },
};
