
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DK',
    store: 'madcoop',
    domain: 'madcoop.dk',
    zipcode: '',
    // dependencies: {
    //   goto: 'action:navigation/goto',
    // },
  },
  implementation: async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
    const { url, id } = inputs;
    let builtUrl;
    // if (!url) {
    //   if (!id) throw new Error('No id provided');
    //   else builtUrl = await dependencies.createUrl(inputs);
    //   if (!builtUrl) return false; // graceful exit when not able to create a url
    // }
    const url1 = `https://butik.mad.coop.dk`;
    console.log(url);
    const brand = inputs.Brand;
    const store = inputs.storeId;
    console.log(brand);
    console.log(store);
    console.log('osmosys');
    console.log(inputs);
    if (brand) {
      await context.goto(url1, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      await context.waitForSelector('input[class="c-search-field"]');
      await context.setInputValue('input[class="c-search-field"]', brand);
      await new Promise((resolve, reject) => setTimeout(resolve, 10000));
      builtUrl = await context.evaluate(function () {
        const tempUrl = document.querySelector("div.result div.c-product-tile a");
        if (tempUrl) {
          return `https://butik.mad.coop.dk${tempUrl.getAttribute('href')}`;
        } else {
          throw Error(`We can't find any product for input provided`);
        }
      });
    }
    console.log ('navigating to: ' + builtUrl);
      //await context.goto(newUrl, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    await dependencies.goto({ ...inputs, url: builtUrl || url });
  
    if (loadedSelector) {
      await context.waitForFunction(
        (selector, xpath) => {
          return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
        },
        { timeout: 10000 },
        loadedSelector,
        noResultsXPath,
      );
    }
    return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
  },
};
