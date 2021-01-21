
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'instacart.com',
    timeout: 50000,
    country: 'US',
    store: 'instacart',
    zipcode: '',
  },

  implementation: async ({ url, zipcode, storeId }, parameterValues, context, dependencies) => {
    await context.stop();
    console.log('1211parameterValues')
    console.log(parameterValues)
    const mainUrl = zipcode ? `https://${parameterValues.domain}/store/home?current_zip_code=${zipcode}` : '`https://www.instacart.com/store/home';
    // await context.goto(mainUrl, { timeout: 35000, waitUntil: 'load', checkBlocked: false });

    const inputUrl = zipcode ? `https://www.instacart.com/store/${storeId}/storefront?current_zip_code=${zipcode}` : `https://www.instacart.com/store/${storeId}/storefront`;
    await context.goto(inputUrl, { timeout: 35000, waitUntil: 'load', checkBlocked: false });

    const onMainPage = await context.evaluate(async function () {
      return !!document.querySelector('div[aria-owns="location-chooser-listbox"]');
    });

    if (onMainPage) {
      await context.waitForSelector('div[aria-owns="location-chooser-listbox"] input', { timeout: 45000 });

      await context.setInputValue('div[aria-owns="location-chooser-listbox"] input', zipcode);

      // await new Promise((resolve) => setTimeout(resolve, 35000));
      await context.click('button[type="submit"]');
      context.waitForNavigation();
      // await context.goto(mainUrl, { timeout: 35000, waitUntil: 'load', checkBlocked: false });

      if (onMainPage) {
        const newLink = await context.evaluate(async function () {
          const header = document.querySelectorAll('div[class^="rmq-c486ae44"] h2');
          let shop = null;
          [...header].forEach((node) => {
            if (node.textContent.includes('New on Instacart')) {
              shop = node;
            }
          });
          if (shop && shop.nextSibling) {
            return shop.nextSibling.querySelector('ul li a').href;
          }
          return null;
        });
        await context.goto(newLink, { timeout: 35000, waitUntil: 'load', checkBlocked: false });
        await context.goto(inputUrl, { timeout: 35000, waitUntil: 'load', checkBlocked: false });
      }

      // await context.waitForSelector('div.store-wrapper', { timeout: 15000 });
    }

    // console.log('inpewewutUrl')
    // console.log(inputUrl)
    // await context.goto(inputUrl, { timeout: 35000, waitUntil: 'load', checkBlocked: false });

    await context.waitForSelector(`span[data-identifier="store_info"] a[href^="${storeId}"]`, { timeout: 15000 });

    await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: false });
  },
};
