const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'keurig',
    transform,
    domain: 'keurig.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
      await context.click('div#_tealiumModalClose');
    } catch (error) {
      console.log('no sign up modal found');
    }
    await new Promise(resolve => setTimeout(resolve, 3500));
    await context.evaluate(async function () {
      let scrollSelector = document.querySelector('div.footer-wrapper');
      // @ts-ignore
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('div.footer-wrapper');
        // @ts-ignore
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    });
    try {
      await context.click('div.expand-collapse.collapsed a');
    } catch (error) {
      console.log('see more button not found');
    }
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  },
};
