
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RO',
    store: 'mega-image',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mega-image.ro',
    zipcode: '',
  },
  implementation: async function (inputs, parameters, context, dependencies) {
    // As we extract data using api call we don't need pagination
    await context.evaluate(async function () {
      const nextPageElement = document.querySelector('link[rel="next"]');
      if (nextPageElement) {
        nextPageElement.parentNode.removeChild(nextPageElement);
      }
    });
  },
};
