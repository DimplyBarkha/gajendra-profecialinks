module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'lowes.com',
    timeout: 20000,
    country: 'US',
    store: 'lowes',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    // Added #SP_ACPage after url to load enhanced content block.

    const newUrlCheck = `${url}`;
    if (newUrlCheck.includes('!opt!')) {
      const newUrl = `${url}`;
      await context.goto(newUrl, {
        firstRequestTimeout: 60000,
        timeout: 60000,
        waitUntil: 'load',
        checkBlocked: true,
      });
      await new Promise((resolve, reject) => setTimeout(resolve, 1500));
    } else {
      const newUrl = `${url}#SP_ACPage`;
      await context.goto(newUrl, {
        firstRequestTimeout: 60000,
        timeout: 60000,
        waitUntil: 'load',
        checkBlocked: true,
      });
    }
    const checkText = await context.evaluate(async function () {
      // const xpath = document.evaluate('//h1[contains(text(),"Access Denied")]', document, null, XPathResult.ANY_TYPE);
      const xpath = document.querySelector('h1');
      if (xpath) {
        if (xpath.innerText.includes('Access Denied')) {
          return 'true';
        } else {
          return 'false';
        }
      }
    });
    if (checkText === 'true') {
      // @ts-ignore
      await context.reportBlocked(403, 'Blocked');
    }

    // async function autoScroll(page) {
    //   await page.evaluate(async () => {
    //     await new Promise((resolve) => {
    //       var totalHeight = 0;
    //       var distance = 100;
    //       var timer = setInterval(() => {
    //         var scrollHeight = document.body.scrollHeight;
    //         window.scrollBy(0, distance);
    //         totalHeight += distance;

    //         if (totalHeight >= scrollHeight) {
    //           clearInterval(timer);
    //           resolve();
    //         }
    //       }, 100);
    //     });
    //   });
    // }
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
    // await autoScroll(context);
  },
};
