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
          if (clickButton.length == 2) {
            clickButton[1].click();
          } else {
            clickButton[0].click();
          }
        }
        console.log('clicked successfully');
      } catch (e) {
        console.log('not able to click');
      }
    });
    await context.waitForNavigation({ timeout });
    // await context.evaluate(() => {
    //   const showMoreProducts = document.querySelectorAll('a[class="c-link f5 mb2 mt0 db-m dn"]');
    //   if (showMoreProducts.length) {
    //     showMoreProducts.forEach((element, index) => {
    //       if (index == 1) {
    //         element.click();
    //         console.log('click happend');
    //       } else {
    //         console.log('not able to click')
    //       }
    //     })
    //   }
    // });
    // try {
    //   await context.waitForNavigation({ timeout: 50000 });
    //   console.log('waiting for next page to load')
    // } catch (e) {
    //   console.log('can not move to the next page')
    // }
  },
};
