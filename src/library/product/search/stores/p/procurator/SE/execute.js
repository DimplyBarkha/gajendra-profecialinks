
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'procurator',
    domain: 'procurator.net',
    url: 'https://www.procurator.net/sv-se/search?filter.query={searchTerms}',
    loadedSelector: 'a.item-box-image img',
    noResultsXPath: '//h2[contains(text(),"Tyvärr så gav din sökning " )]',
    zipcode: '',
  },
};
