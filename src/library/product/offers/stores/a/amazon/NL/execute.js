
module.exports = {
  implements: 'product/offers/execute',
  parameterValues: {
    country: 'NL',
    store: 'amazon',
    domain: 'amazon.nl',
    loadedSelector:'[id*=title]',
    noResultsXPath: '//body[not(//div)]',
    offerUrl: 'http://www.amazon.nl/gp/aod/ajax/ref=aod_page_1?asin={id}&pc=dp&filters=%257B%2522all%2522%253Atrue%252C%2522new%2522%253Atrue%257D&isonlyrenderofferlist=false',
    zipcode: '',
  },
};
