const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'intermarche',
    transform,
    domain: 'intermarche.com',
    zipcode: '',
  },
  implementation: async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let morePages = true;
        let pageCount = 0;
        let scrollTop = 0
        while (morePages) {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          const ele = document.querySelector('div[class*="styled__LoaderWrapper"]');
          scrollTop = scrollTop + 5000;
          window.scroll(0, scrollTop);
          morePages = !!ele;
          if (pageCount++ == 7) break;
        }
      });
    }
    await applyScroll(context);
    return await context.extract(productDetails, { transform });
  }
};
