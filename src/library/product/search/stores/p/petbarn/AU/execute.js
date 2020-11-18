
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'petbarn',
    domain: 'petbarn.com.au',
    url: "https://www.petbarn.com.au/search?q={searchTerms}",
    loadedSelector: "ul[class='products-grid last'] li[class *='item last'] a[class='product-image'] img",
    noResultsXPath: "//p[@class='note-msg' and text()='There are no products matching the selection.']",
    zipcode: '',
  },
};
