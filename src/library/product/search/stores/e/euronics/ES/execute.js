/**
 *
 * @param { { keywords: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  await context.goto('https://euronics.es');
  await context.waitForXPath('//input[@id="txtBuscador"]');
  await context.setInputValue('#txtBuscador', (inputs.keywords || inputs.Keywords));
  await stall(2000);
  return context.evaluate(function () {
    return document.querySelectorAll('.df-card').length > 0;
  });

}

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'euronics',
    domain: 'euronics.es',
    url: 'https://www.euronics.es',
  },
  implementation,
};
