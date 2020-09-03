const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'group-digital',
    transform,
    domain: 'group-digital.fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    // Scrolling till specifications as manufacturer images are loaded on website after scrolling down
    await new Promise(resolve => setTimeout(resolve, 10000));
    await context.evaluate(async function () {
      let scrollSelector = document.querySelector('div[class~="footer-container"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('div[class~="footer-container"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    });
    try {
      await context.waitForSelector('div#wc-aplus');
    } catch (error) {
      console.log('Manufacturer content not loaded');
    }
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
