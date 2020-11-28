
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'sphere-sante',
    domain: 'sphere-sante.com',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: "''",
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    await context.goto('https://www.sphere-sante.com/');
    await context.setInputValue('input.search-input.searchTrack', inputs.id);
    await new Promise(resolve => setTimeout(resolve, 30000));
    await context.clickAndWaitForNavigation('.autocomplete-suggestions.content .column.products_search .autocomplete-suggestion.row', {}, { timeout: 50000 });
  },
};
