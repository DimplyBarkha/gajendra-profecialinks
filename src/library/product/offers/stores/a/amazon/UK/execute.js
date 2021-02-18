
module.exports = {
  implements: 'product/offers/execute',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    domain: 'amazon.co.uk',
    loadedSelector:'[id*=title]',
    noResultsXPath: '//body[not(//div)]',
    offerUrl: 'http://amazon.co.uk/gp/aod/ajax/ref=aod_page_1?asin={id}&m=&pinnedofferhash=&qid=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&filters=%257B%2522all%2522%253Atrue%252C%2522new%2522%253Atrue%257D&isonlyrenderofferlist=false',
    zipcode: '',
  },
};