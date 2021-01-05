
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'debijenkorf.nl',
    prefix: null,
    // url: 'https://www.debijenkorf.nl/product-lister-page.html?SearchTerm={id}',
    url: 'https://ceres-catalog.debijenkorf.nl/catalog/product/show?productVariantCode={id}&cached=false&locale=nl_NL&api-version=2.34',
    country: 'NL',
    store: 'bijenkorf',
    zipcode: '',
  },
};
