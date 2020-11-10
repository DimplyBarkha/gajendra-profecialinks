
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'salonsupplies',
    nextLinkSelector: 'div#productFooter div.pagination a:nth-last-child(2)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.contentGrid ul li a.productimage img',
    noResultsXPath: '//p[contains(text(),"we found 0 related products")]',
    openSearchDefinition: null,
    domain: 'salonsupplies.co.uk',
    zipcode: "''",
  },
};
