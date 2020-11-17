
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    // nextLinkSelector: 'li:nth-last-child(2) a',
    // nextLinkXpath: '//a[contains(text(),">")]', 
    // loadedXpath: '//div[contains(@class,"product-view-container")]',
    nextLinkXpath: '//a[contains(text(),">")]',
    loadedSelector: 'div.product-view-container',
    noResultsXPath: '//div[contains(text()," Tip")]',
    // openSearchDefinition: {
    //   template: 'https://www.plein.nl/zoeken?search={searchTerms}&p={page}', 
    // },    
  },
  domain: 'plein.nl',
  zipcode: "''",
};
