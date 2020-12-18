const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  if (inputs.id) {
    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      const optionalWait = async (sel) => {
        try {
          await context.waitForSelector(sel, { timeout: 60000 });
        } catch (err) {
          console.log(`Couldn't load selector => ${sel}`);
        }
      };
      const noResultsSelector = document.querySelector('section.page-not-found');
      if (noResultsSelector) {
        throw new Error('No results for this RPC');
      }
      const isSelector = document.querySelector('div.products article h2 a');
      if (isSelector) {
        try {
          isSelector.click();
          optionalWait('h1[itemprop="name"]');
          await stall(10000);
        } catch (err) {
          console.log('Not clicked' + err);
        }
      }
    });
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'senea',
    transform,
    domain: 'senea.fr',
    zipcode: '',
  },
  implementation,
};
