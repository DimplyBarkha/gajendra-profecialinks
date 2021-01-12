
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GR',
    store: 'hondoscenter',
    domain: 'hondoscenter.com',
    url: 'https://www.hondoscenter.com/en/apotelesmata-proionton/p13/?search-for={searchTerms}#[!opt!]{"type":"json"}[/!opt!]',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
