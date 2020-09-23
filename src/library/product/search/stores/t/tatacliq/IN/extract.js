const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'tatacliq',
    transform,
    domain: 'tatacliq.com',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    async function loadImages () {
      const delay = t => new Promise(resolve => setTimeout(resolve, t));
      async function waitForImages (node) {
        while (node.querySelectorAll('img:not([alt=\'star icon\'])').length === 0) {
          console.log('waiting for images to load');
          await delay(1000);
        }
        console.log('Images loaded.');
      }
      const nodes = Array.from(document.querySelectorAll("div[id='grid-wrapper_desktop']>div>div>div>div>div"));
      console.log('Starting image loading');
      let row = 1;
      for (const node of nodes) {
        console.log('Row Number: ', row++);
        node.scrollIntoView({ behavior: 'smooth' });
        await waitForImages(node);
      }
    }

    await context.evaluate(loadImages);
    const { transform } = parameters;
    const { productDetails } = dependencies;

    return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
  },
};
