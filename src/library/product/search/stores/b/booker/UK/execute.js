
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'booker',
    domain: 'booker.co.uk',
    url: 'https://www.booker.co.uk/catalog/products.aspx?categoryName=Default%20Catalog&keywords={searchTerms}&view=UnGrouped',
    loadedSelector: 'span#BPLIC table tr.pr',
    noResultsXPath: 'div.boxValidationError',
  },
};
