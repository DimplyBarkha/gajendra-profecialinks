module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'lowes.com',
    timeout: 2000000,
    country: 'US',
    store: 'lowes',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setBlockAds(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true });
    async function autoScroll(page) {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    }
    await autoScroll(context);
    const isStorePresent = await context.evaluate(async function () {
      const isStorePresent = document.querySelector('#store-search-handler');
      // @ts-ignore
      return isStorePresent ? !!isStorePresent.innerText.trim().includes('Burbank Lowe') : false;
    });
    try {
      console.log('Is store present-->', isStorePresent);
      if (!isStorePresent) {
        await context.evaluate(async function () {
          const storeButton = document.querySelector('#store-search-handler');
          if (storeButton) {
            // @ts-ignore
            storeButton.click();
          }
        });
        await context.waitForSelector('ul[class*="styles__StoreListWrapper"] li button[class*="variant--primary"]');
        await context.evaluate(async function () {
          const inputElement = document.querySelector('input[class*="type--text incomplete"]');
          inputElement && inputElement.setAttribute('value', "Burbank Lowe's");
          const formButton = document.querySelector('form button[class*="variant--primary"]');
          // @ts-ignore
          formButton && formButton.click();
        });
        await context.waitForSelector('ul[class*="styles__StoreListWrapper"] li button[class*="variant--primary"]');
        await context.evaluate(async function () {
          const selectButton = document.querySelector('ul[class*="styles__StoreListWrapper"] li button[class*="variant--primary"]');
          // @ts-ignore
          selectButton && selectButton.click();
        });
        await context.waitForNavigation();
      }
    } catch (error) {
      console.log('Faild to set store location', error);
    }
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
    await autoScroll(context);
  },
};
