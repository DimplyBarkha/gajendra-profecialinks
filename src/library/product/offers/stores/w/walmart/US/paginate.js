module.exports = {
    implements: 'product/offers/paginate',
    parameterValues: {
      country: 'US',
      store: 'walmart',
      nextLinkSelector: '',
      spinnerSelector: null,
      loadedSelector: '',
      noResultsXPath: '',
      // Use openSearchDefinition if nextLink has navigation issues.
      openSearchDefinition: {
        indexOffset: 1,
        template: '',
      },
      domain: 'walmart.com',
    },
  };
  