
module.exports = {
  implements: 'product/offers/execute',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    domain: 'amazon.de',
    loadedSelector:'[id*=title]',
    noResultsXPath: '//body[not(//div)]',
    offerUrl: 'http://amazon.de/gp/aod/ajax/ref=aod_page_1?asin={id}&m=&pinnedofferhash=&qid=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&filters=%257B%2522all%2522%253Atrue%252C%2522new%2522%253Atrue%257D&isonlyrenderofferlist=false',
    zipcode: '',
  },
};
