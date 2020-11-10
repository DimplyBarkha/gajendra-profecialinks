
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'Bezokularow',
    domain: 'bezokularow.pl',
    url: 'https://www.bezokularow.pl/szukaj?szukaj=tak&fraza={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="row"]/p[@class="noitems"]',
    zipcode: '',
  },
};
