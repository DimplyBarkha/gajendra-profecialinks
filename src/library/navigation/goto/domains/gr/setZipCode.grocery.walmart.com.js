
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'grocery.walmart.com',
    store: 'walmartOG',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { timeout = 60000, waitUntil = 'load', checkBlocked = true } = {};
    const mainUrl = 'https://grocery.walmart.com';
    await context.goto(mainUrl, { timeout, waitUntil, checkBlocked });
    const { zipcode } = inputs;
    let locationStreetAddress = '';
    let disabledContinueButton = false;

    let zipcodeStreetAddress = '';

    if (zipcode === '72758') {
      zipcodeStreetAddress = '4208 Pleasant Crossing Blvd';
    } else if (zipcode === '75204') {
      zipcodeStreetAddress = '2305 N Central Expy';
    }

    async function hasDisabledContinuedButton () {
      const hasIt = await context.evaluate(async function () {
        return document.querySelector('button[data-automation-id="locationFlyout-continueBtn"]').hasAttribute('disabled');
      });
      return hasIt;
    }

    async function changeLocation (zipcode) {
      await context.evaluate(async function () {
        if (document.querySelector('div.ReactModalPortal')) {
          document.querySelector('div.ReactModalPortal').remove();
        }
      });
      async function clickButton() {
        await context.waitForSelector('button[label="Change store"]');
        // Using context.click for selector button[label="Change store"] is not working. Won't click on the button
        await context.evaluate(async function () {
          const button = document.querySelector('button[label="Change store"]');
          if (button) {
            button.click();
          }
        });
      }
      clickButton();
      try {
        await context.waitForSelector('input[data-automation-id="zipSearchField"]', { timeout: 45000 });
      } catch (error) {
        await context.click('button[data-automation-id="zipSearchBtn"]');
        if (document.querySelector('section[data-automation-id="closeableOverlay"]')) {
          document.querySelector('section[data-automation-id="closeableOverlay"]').click();
        }
        clickButton();
        // throw new Error('Fail to click on confirm button');
      }

      await context.waitForSelector('input[data-automation-id="zipSearchField"]', { timeout: 45000 });
      await context.setInputValue('input[data-automation-id="zipSearchField"]', zipcode);
      await context.click('button[data-automation-id="zipSearchBtn"]');

      await context.waitForSelector('li[data-automation-id="selectFlyoutItem"]');
      await context.waitForSelector('li[data-automation-id="selectFlyoutItem"]:first-child input');
      await context.evaluate(async function () {
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        const searchZipCode = document.querySelector('input[data-automation-id="selectFlyoutItemBtn"]:first-child');
        if (searchZipCode) {
          searchZipCode.click();
        }
      });
      await context.waitForSelector('li[data-automation-id="selectFlyoutItem"] span[class^="AddressPanel__addressLine"]');
      await context.evaluate(async function () {
        locationStreetAddress = (document.querySelector('li[data-automation-id="selectFlyoutItem"] span[class^="AddressPanel__addressLine"]')) ? document.querySelector('li[data-automation-id="selectFlyoutItem"] span[class^="AddressPanel__addressLine"]').textContent : '';
      });

      await context.waitForSelector('button[data-automation-id="locationFlyout-continueBtn"]');

      disabledContinueButton = await hasDisabledContinuedButton();

      if (disabledContinueButton === false) {
        await context.click('button[data-automation-id="locationFlyout-continueBtn"]');
        await context.waitForSelector('button[data-automation-id="confirmFulfillmentBtn"]');
        await context.click('button[data-automation-id="confirmFulfillmentBtn"]');
        // Seems like the timeout for waitForFunction is not working
        await new Promise((resolve) => setTimeout(resolve, 10000));
        await context.waitForSelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]', { timeout: 45000 });
        try {
          await context.waitForFunction(function (sel, zipcodeStreetAddress) {
            return Boolean(document.querySelector(sel).textContent === zipcodeStreetAddress);
          }, { timeout: 55000 }, 'div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]', zipcodeStreetAddress);
        } catch (error) {
          throw new Error('Fail to click on confirm button');
        }

        // await context.waitForXPath('//div[contains(@data-automation-id,"changeStoreFulfillmentBannerBtn")]//span[contains(@class,"AddressPanel__addressLine")]/text()[contains(., "' + zipcodeStreetAddress + '")]', { timeout: 55000 });
      }
    }

    const changedLocationStreetAddress = await context.evaluate(function () {
      return document.querySelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]') ? document.querySelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]').textContent : '';
    });

    console.log('locationStreetAddress value');
    console.log(locationStreetAddress);
    console.log(changedLocationStreetAddress);

    if (!(changedLocationStreetAddress.includes(zipcodeStreetAddress) && disabledContinueButton === false)) {
      await changeLocation(zipcode);
      if (locationStreetAddress !== changedLocationStreetAddress) {
        await changeLocation(zipcode);
      }
      if (locationStreetAddress !== changedLocationStreetAddress) {
        console.log(locationStreetAddress);
        console.log(changedLocationStreetAddress);
        throw new Error('Fail to change zipcode');
      }
    }
  },
};
