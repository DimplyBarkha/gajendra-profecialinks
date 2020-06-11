async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
 
  await context.goto("https://www.amazon.com/dp/B002OROE22?th=1");



  // TODO: Check for not found?
}


module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonTest',
    domain: 'amazon.com',
    loadedSelector: null,
    noResultsXPath: null,
  },
  implementation
};
