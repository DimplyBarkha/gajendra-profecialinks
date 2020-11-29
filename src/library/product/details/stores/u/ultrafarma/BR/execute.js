
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'ultrafarma',
    domain: 'ultrafarma.com.br',
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
    await context.goto('https://www.ultrafarma.com.br/busca?q=' + inputs.id);
    await new Promise(resolve => setTimeout(resolve, 50000));
  },
};
