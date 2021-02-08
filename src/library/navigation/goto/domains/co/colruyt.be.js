
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'colruyt.be',
    timeout: 90000,
    country: 'BE',
    store: 'colruyt_nl',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 90000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    const lastResponseData = await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    try {
      console.log('lastResponseData.status', lastResponseData.status);
      if (lastResponseData.status === 400) {
        console.log('Blocked: ' + lastResponseData.status);
        return context.reportBlocked(lastResponseData.status, 'Blocked: ' + lastResponseData.status);
      }
    } catch (error) {
      console.log('ResponseData status is not available');
    }
    // await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    try {
      await context.waitForSelector('button#onetrust-accept-btn-handler');
      await context.evaluate(async function (inputs) {
        const cookieButton = document.querySelector('button#onetrust-accept-btn-handler');
        cookieButton && cookieButton.click();
      });
    } catch (error) {
      console.log('Cookie button click fail');
    }
    try {
      await context.waitForSelector('#features-modal  div.overlay__continue > button');
      await context.evaluate(async function (inputs) {
        const cookieButton = document.querySelector('#features-modal  div.overlay__continue > button');
        cookieButton && cookieButton.click();
      });
    } catch (error) {
      console.log('Next Cookie button click fail');
    }
    try {
      await context.waitForXPath('//div[contains(@class,"product-detail__wrapper")]');
    } catch (error) {
      console.log('Wrapper xpath failed');
    }

    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
