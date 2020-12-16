
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    nextLinkSelector: 'nav.yFHi8N > a:last-child[class = _1LKTO3 ]',//null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div._3LxdjL._3NzWOH' ,
    noResultsXPath: 'nav.yFHi8N > a:last-child[class = ge-49M ]' ,
    openSearchDefinition: null, //{
      //template: 'https://www.flipkart.com/search?q={searchTerms}?&page={page}',
    //},
    domain: 'flipkart.com',
    zipcode: "''",
  },
};

