
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'jumia.co.ke',
    timeout: null,
    country: 'KE',
    store: 'jumia',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.goto(url);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const isProduct = await context.evaluate(function (sel) {
      const selector = document.querySelector(sel);
      return selector;
    }, 'section.card.-fh');
    if (isProduct) {
      const gotoUrl = await context.evaluate(function () {
        const productSelector = document.querySelector('section.card.-fh > div > article > a');
        if (productSelector) {
          const productUrl = productSelector.getAttribute('href');
          return 'https://www.jumia.co.ke' + productUrl;
        }
      });
      await context.goto(gotoUrl);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
