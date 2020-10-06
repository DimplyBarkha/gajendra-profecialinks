
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'ebay',
    domain: 'ebay.com.au',
    url: 'http://www.ebaystores.com.au/dyson-australia/_i.html?rt=nc&_nkw={searchTerms}&_sid=1630776705&_trksid=p4634.c0.m14.l1581',
    loadedSelector: 'div.p-box',
    noResultsXPath: "//span[contains(@class,'countClass') and contains(concat(' ',text(),' '),' 0 ')]",
    zipcode: '',
  },
};
