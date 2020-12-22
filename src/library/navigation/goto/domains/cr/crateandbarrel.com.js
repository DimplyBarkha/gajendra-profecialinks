
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'crateandbarrel.com',
    timeout: 100000,
    store: 'crateandbarrel',
    country: 'US',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const { url, zipcode, storeId } = inputs;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    try {
      await context.waitForSelector('a#closeButton');
      await context.click('a#closeButton');
    } catch (error) {
      console.log('Failed to close pop up');
    }
    try {
      const isUS = await context.evaluate(async function () {
        const element = document.querySelector('li#header-country-flag button img');
        if (element && element.alt && element.alt.includes('United States')) {
          return true;
        } else {
          return false;
        }
      });
      console.log('Country is US :  ', isUS);
      try {
        if (!isUS) {
          await context.waitForSelector('li#header-country-flag button');
          await context.click('li#header-country-flag button');
          await context.waitForSelector('#shipping-select-container label[for="us-select"]');
          await context.click('#shipping-select-container label[for="us-select"]');
          await context.waitForSelector('#btn-ship-to-international');
          await context.click('#btn-ship-to-international');
          await context.waitForNavigation();
        }
      } catch (error) {
        try {
          if (!isUS) {
            await context.evaluate(async function () {
              const flagButton = document.querySelector('li#header-country-flag button');
              // @ts-ignore
              flagButton && flagButton.click();
              await new Promise((resolve, reject) => setTimeout(resolve, 6000));
              const usSelect = document.querySelector('#shipping-select-container label[for="us-select"]');
              // @ts-ignore
              usSelect && usSelect.click();
              await new Promise((resolve, reject) => setTimeout(resolve, 3000));
              const submit = document.querySelector('#btn-ship-to-international');
              // @ts-ignore
              submit && submit.click();
            });
            await context.waitForNavigation();
          }
        } catch (error) {
          console.log('Failed to change country attempt two');
        }
      }
    } catch (error) {
      console.log('Failed to change country');
    }

    try {
      await context.waitForXPath('//div[@class="gallery-main-image"]//img/@src | (//div[contains(@class,"showcase-item")]//img[contains(@class,"showcase-item")]/@src)[1]');
    } catch (error) {
      console.log('Failed to load images');
    }

    try {
      const policyAcceptPopup = await context.evaluate(function () {
        return !!document.evaluate('//div[@id="tinycontent"]//a[@id="closeButton"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      });
      if (policyAcceptPopup) {
        await context.click('div#tinycontent a#closeButton');
      }
    } catch (error) {
      console.log('Failed to close seconf pop up');
    }

    try {
      await context.waitForSelector('h1#fieldcaptureheader1');
      await context.click('h1[fclass*="shop-bar-product-title"]');
    } catch (error) {
      console.log('third pop up');
    }

    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  },
};
