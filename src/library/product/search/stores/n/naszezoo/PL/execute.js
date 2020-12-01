
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'naszezoo',
    domain: 'naszezoo.pl',
    url: 'https://www.naszezoo.pl/pl/searchquery/{searchTerms}',
    loadedSelector: 'div.innerbox.cf> div',
    noResultsXPath: '//div[@class="container"]/p[contains(text(),"Nie")]',
    zipcode: '',
  },
};
