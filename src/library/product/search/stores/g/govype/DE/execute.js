
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'govype',
    domain: 'govype.com',
    url: 'https://www.govype.com/de/de/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.search.results',
    noResultsXPath: '//div[@class="message notice"]//div[contains(text(),"Deine Suche ergab")]',
    zipcode: '',
  },
};
