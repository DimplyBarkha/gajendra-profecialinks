const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'tatacliq',
    transform,
    domain: 'tatacliq.com',
    zipcode: '',
  },

  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    // const result = await context.evaluate(() => {
    //     return document.querySelector('#root>div>div:nth-child(4)>div')
    // })
    // if (result) {
    //     await context.waitForFunction(() => {
    //         return !document.querySelector('#root>div>div:nth-child(4)>div')
    //     }, 50000)
    // }

    // await context.evaluate(() => {
    //   document.querySelector('div#grid-wrapper_desktop>div>div>div>div>div:last-child').scrollIntoView({ behavior: 'smooth' });
    // });
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
    // try {
    //   await context.waitForSelector("div[id='grid-wrapper_desktop']>div>div>div>div>div:last-child>div:last-child", 80000);
    // } catch (e) {
    //   console.log(e);
    // }
    await context.evaluate(loadImages);
    const { transform } = parameters;
    const { productDetails } = dependencies;
    // await delay(7000);
    return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
  },
};
