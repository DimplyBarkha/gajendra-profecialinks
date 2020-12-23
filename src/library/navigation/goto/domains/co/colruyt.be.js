
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'colruyt.be',
    timeout: 150000,
    country: 'BE',
    store: 'colruyt',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 150000;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
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
