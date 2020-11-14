
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PK',
    store: 'metro-online',
    domain: 'metro-online.pk',
    url: "https://metro-online.pk/search/{searchTerms}",
    loadedSelector: "ul[class='productsitems clearfix'] div[class='productdivinner'] div[class='productimg'] img",
    noResultsXPath: "//div[@class='noproductfound ng-scope']",
    zipcode: '',
  },
};
