
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'grocery.walmart.com',
    store: 'walmartOG',
    zipcode: '72758',
  },
  implementation: async (inputs, { zipcode }, context, dependencies) => {
    const { timeout = 20000, waitUntil = 'load', checkBlocked = true } = {};
    const mainUrl = 'https://grocery.walmart.com';
    await context.goto(mainUrl, { timeout, waitUntil, checkBlocked });

    let locationStreetAddress = '';

    async function changeLocation (zipcode) {
      await context.evaluate(async function () {
        if (document.querySelector('div.ReactModalPortal')) {
          document.querySelector('div.ReactModalPortal').remove();
        }
      });
      await context.waitForSelector('button[label="Change store"]');
      await context.evaluate(async function () {
        const button = document.querySelector('button[label="Change store"]');
        if (button) {
          button.click();
        }
      });
      await context.waitForSelector('input[data-automation-id="zipSearchField"]');
      await context.setInputValue('input[data-automation-id="zipSearchField"]', zipcode);
      await context.click('button[data-automation-id="zipSearchBtn"]');

      await context.waitForSelector('li[data-automation-id="selectFlyoutItem"]');
      await context.waitForSelector('li[data-automation-id="selectFlyoutItem"]:first-child input');
      await context.evaluate(async function () {
        const searchZipCode = document.querySelector('input[data-automation-id="selectFlyoutItemBtn"]:first-child');
        if (searchZipCode !== undefined) {
          searchZipCode.click();
        }
        locationStreetAddress = (document.querySelector('li[data-automation-id="selectFlyoutItem"] span[class^="AddressPanel__addressLine"]')) ? document.querySelector('li[data-automation-id="selectFlyoutItem"] span[class^="AddressPanel__addressLine"]').textContent : '';
      });

      await context.click('button[data-automation-id="locationFlyout-continueBtn"]');
      await context.waitForSelector('button[data-automation-id="confirmFulfillmentBtn"]');
      await context.click('button[data-automation-id="confirmFulfillmentBtn"]');
      await new Promise((resolve, reject) => setTimeout(resolve, 3e3));
    }

    const changedLocationStreetAddress = await context.evaluate(function () {
      return document.querySelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]') ? document.querySelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]').textContent : '';
    });

    if (!(zipcode === '72758' && changedLocationStreetAddress === '4208 Pleasant Crossing Blvd')) {
      await changeLocation(zipcode);

      if (locationStreetAddress !== changedLocationStreetAddress) {
        await changeLocation(zipcode);
      }
    }
  },
};
