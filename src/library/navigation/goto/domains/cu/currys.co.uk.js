module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'currys.co.uk',
    timeout: 50000,
    country: 'UK',
    store: 'currys',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);

    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    const lastResponseData = await context.goto(url, { waitUntil: 'networkidle0', block_ads: false, js_enabled: true });

    // await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: false });

    if (lastResponseData.status === 500 || lastResponseData.status === 503) {
      throw Error('Bad response code: ' + lastResponseData.status);
    }

    if (lastResponseData.status === 403) {
      return context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
    }
    async function autoScroll (page) {
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
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    console.log('IN GOTO');
    const timeout = parameters.timeout ? parameters.timeout : 60000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setFirstRequestTimeout(60000);
    await context.setUseRelayProxy(false);
    await context.setJavaScriptEnabled(true);
    await context.setBypassCSP(true);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
