module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.com.br',
    timeout: 50000,
    zipcode: '',
    store: 'carrefour',
    country: 'BR',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters, context, dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 50000;
    await context.setLoadImages(true);
    await context.setLoadAllResources(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    try {
      await context.waitForSelector('a[class="c-link f5 mb2 mt0 db-m dn"]', { timeout });
      console.log('click button loaded successfully');
    } catch (e) {
      console.log('not able to load the click button');
    }

    await context.evaluate(() => {
      try {
        var clickButton = document.querySelectorAll('a[class="c-link f5 mb2 mt0 db-m dn"]');
        if (clickButton.length) {
          clickButton[0].click()
          console.log('clicked successfully');
        }
      } catch (e) {
        console.log('not able to click');
      }
    });
    await context.waitForSelector('div[class*="galleryItem"]', { timeout: 40000 });
  },
};
