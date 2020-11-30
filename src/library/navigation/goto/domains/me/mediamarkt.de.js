module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'mediamarkt.de',
    timeout: null,
    country: 'DE',
    store: 'mediamarkt',
    zipcode: "''",
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = inputs.url;

    await context.goto(url, {
      timeout: 10000,
      waitUntil: 'load',
      checkBlocked: true,
    });
    const navigation = async function (context, inputs) {
      let url = inputs.url;

      async function checkUrlForCategoryOrBrand () {
        return await context.evaluate(function () {
          const currentUrl = document.location.href;
          if (currentUrl.includes('shop/marke/') || currentUrl.includes('de/category/')) {
            return true;
          }
          return false;
        });
      }

      const categoryOrBrandInUrl = await checkUrlForCategoryOrBrand();

      if (categoryOrBrandInUrl) {
        const searchTerm = url.match(/(?<=query=)\w+/)[0];
        url = url.replace(searchTerm, `%27${searchTerm}%27`);
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! inside', searchTerm, url);
        await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
      }
    };
    await navigation(context, inputs);
  },
};
