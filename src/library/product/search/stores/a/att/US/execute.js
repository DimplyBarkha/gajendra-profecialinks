
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'att',
    domain: 'att.com',
    url: 'https://www.att.com/global-search/search?catField=Shop&group=true&q={searchTerms}',
    loadedSelector: 'ul.support-list',
    noResultsXPath: '//div[@class="container inner-container marginTopBottom20"]',
    zipcode: "''",
  },
};
