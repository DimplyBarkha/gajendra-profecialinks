
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'totalwine.com',
    timeout: 60000,
    country: 'US',
    store: 'totalwine',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 35000;
    // await context.setBypassCSP(true);
    // await context.setCssEnabled(true);
    // await context.setAntiFingerprint(false);
    // await context.setJavaScriptEnabled(true);
    // await context.setBlockAds(false);
    // await context.setLoadAllResources(true);
    // await context.setLoadImages(true);
    // const inputUrl = `${url}#[!opt!]{"discard_CSP_header":true, "block_ads": false}[/!opt!]`;
    if (url.includes('?')) {
      if (!url.includes('pageSize=')) {
        url += '&pageSize=150';
      }
    } else {
      url += '?pageSize=150';
    }
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });
    await context.waitForSelector('#avg-rating-button').catch(err => { console.log('No rating found', err); });
    // console.log(zipcode);
    // if (zipcode) {
    //   await dependencies.setZipCode({ url: url, zipcode: zipcode });
    // }
    // let lastResponseData;

    // const isCaptcha = async () => {
    //   return await context.evaluate(async function () {
    //     const captchaEl = document.evaluate("//*[contains(text(),'Please verify you are a human')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //     if (captchaEl.snapshotLength) {
    //       return 'true';
    //     } else {
    //       return 'false';
    //     }
    //   });
    // };

    // const run = async () => {
    //   // do we perhaps want to go to the homepage for amazon first?
    //   lastResponseData = await context.goto(url, {
    //     timeout: timeout, waitUntil: 'load', checkBlocked: false,
    //     // timeout: 10000,
    //     // waitUntil: 'load',
    //     // checkBlocked: true,
    //     // js_enabled: true,
    //     // css_enabled: false,
    //     // random_move_mouse: true,
    //   });

    //   if (lastResponseData.status === 404 || lastResponseData.status === 410) {
    //     return;
    //   }

    //   if (lastResponseData.status === 403) {
    //     await context.evaluate(async function () {
    //       const mainButton = document.querySelector('div[role="main"]');
    //       mainButton.click();
    //     });
    //   }
    // };
    // try {
    //   await run();
    // } finally {
    //   console.log('can\'t solve');
    // }
  },
};
