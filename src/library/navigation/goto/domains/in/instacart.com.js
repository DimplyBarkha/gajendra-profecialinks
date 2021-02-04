
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'instacart.com',
    timeout: 50000,
    country: 'US',
    store: 'instacart',
    zipcode: '',
  },

  implementation: async ({ url, zipcode, storeId, storeID }, parameterValues, context, dependencies) => {
    // const mainUrl = zipcode ? `https://${parameterValues.domain}/store/home?guest=true&current_zip_code=${zipcode}` : '`https://www.instacart.com/store/home?guest=true';
    // await context.goto(mainUrl, { timeout: 35000, waitUntil: 'load', checkBlocked: false });
    const store = storeId || storeID;

    const inputUrl = zipcode ? `https://www.instacart.com/store/${store}/storefront?guest=true&current_zip_code=${zipcode}` : `https://www.instacart.com/store/${store}/storefront?guest=true`;
    await context.goto(inputUrl, { timeout: 55000, waitUntil: 'load', checkBlocked: false });

    const onMainPage = await context.evaluate(async function () {
      return !!document.querySelector('div[aria-owns="location-chooser-listbox"]');
    });

    if (onMainPage) {
      await context.waitForSelector('div[aria-owns="location-chooser-listbox"] input', { timeout: 45000 });

      await context.setInputValue('div[aria-owns="location-chooser-listbox"] input', zipcode);

      await context.click('button[type="submit"]');
      context.waitForNavigation();

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
        if (newLink) {
          await context.goto(newLink, { timeout: 35000, waitUntil: 'load', checkBlocked: false });
        }
        await context.goto(inputUrl, { timeout: 35000, waitUntil: 'load', checkBlocked: false });
      }
    }

    await context.waitForSelector(`span[data-identifier="store_info"] a[href^="${store}"]`, { timeout: 15000 });

    await context.goto(url, { timeout: 38000, waitUntil: 'load', checkBlocked: false });
  },
};
