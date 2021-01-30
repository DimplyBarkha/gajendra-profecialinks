async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  // Hack: Getting rid of default pagination
  return false;
}
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'lyko',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.gXdoAx',
    noResultsXPath: null,
    // openSearchDefinition: {
    //   template: 'https://lyko.com/sv/sok?q={searchTerms}&sortBy=popularity&count=150',
    // },
    domain: 'lyko.com',
    zipcode: '',
  },
  implementation,
};
