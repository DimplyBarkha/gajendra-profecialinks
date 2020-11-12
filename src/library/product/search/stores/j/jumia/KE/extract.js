const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'KE',
    store: 'jumia',
    transform,
    domain: 'jumia.co.ke',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const closeNewsletterBtn = await context.evaluate(async function () {
      document.querySelector('button[data-track-onclick="popupClose"]');
    });
    if (closeNewsletterBtn) {
      await context.click('button[data-track-onclick="popupClose"]');
    }
    await context.evaluate(async function () {
      const body = document.body;
      const html = document.documentElement;
      const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

      let scrollTop = 0;
      while (scrollTop <= pageHeight) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        scrollTop += 200;
        window.scroll(0, scrollTop);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
