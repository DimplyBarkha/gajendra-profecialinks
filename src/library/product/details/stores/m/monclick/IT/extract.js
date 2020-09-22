const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'monclick',
    transform,
    domain: 'monclick.it',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await context.click('div[class*="image-content-gallery"] li[class*="gallery-video"]');
      await context.waitForSelector('div[class*=product-gallery-overlay]');
      await context.evaluate(async () => {
        const element = document.querySelector('footer#footer');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      });
    } catch (e) {
      console.log(e);
    }
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  },
};
