
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'grocery.walmart.com',
    store: 'walmartOG',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { timeout = 60000, waitUntil = 'load', checkBlocked = true } = {};
    const mainUrl = 'https://www.walmart.com/grocery';
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

    const changedLocationStreetAddress = await context.evaluate(function () {
      return document.querySelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]') ? document.querySelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]').textContent : '';
    });

    async function hasDisabledContinuedButton () {
      const hasIt = await context.evaluate(async function () {
        return document.querySelector('button[data-automation-id="locationFlyout-continueBtn"]').hasAttribute('disabled');
      });
      return hasIt;
    }

    async function hasCloseModalButton () {
      const hasIt = await context.evaluate(async function () {
        return document.querySelector('button[aria-label="close modal"]') !== null;
      });
      return hasIt;
    }

    async function changeStoreButton () {
      await context.waitForSelector('button[label="Change store"]');
      // Using context.click for selector button[label="Change store"] is not working. Won't click on the button
      await context.evaluate(async function () {
        const button = document.querySelector('button[label="Change store"]');
        if (button) {
          button.click();
        }
      });
    }

    async function changeLocation (zipcode) {
      const closeModalButton = await hasCloseModalButton();
      if (closeModalButton) {
        await context.click('button[aria-label="close modal"]');
      }

      await context.evaluate(async function () {
        if (document.querySelector('div.ReactModalPortal')) {
          document.querySelector('div.ReactModalPortal').remove();
        }
      });

      await changeStoreButton();

      try {
        await context.waitForSelector('input[data-automation-id="zipSearchField"]', { timeout: 45000 });
      } catch (error) {
        // Using context.click for selector 'section[data-automation-id="closeableOverlay"]'
        if (document.querySelector('section[data-automation-id="closeableOverlay"]')) {
          document.querySelector('section[data-automation-id="closeableOverlay"]').click();
        }
        await changeStoreButton();
      }

      await context.waitForSelector('input[data-automation-id="zipSearchField"]', { timeout: 45000 });

      await context.setInputValue('input[data-automation-id="zipSearchField"]', zipcode);
      await context.click('button[data-automation-id="zipSearchBtn"]');
      await context.evaluate(async function () {
        const buttonSearchZipcode = document.querySelector('button[data-automation-id="zipSearchBtn"]');
        if (buttonSearchZipcode) {
          buttonSearchZipcode.click();
        }
      });

      await context.waitForSelector('li[data-automation-id="selectFlyoutItem"]', { timeout: 45000 });
      await context.waitForSelector('li[data-automation-id="selectFlyoutItem"]:first-child input');
      await context.evaluate(async function () {
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
        await new Promise((resolve, reject) => setTimeout(resolve, 6000));

        try {
          await context.waitForSelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]', { timeout: 45000 });
        } catch (error) {
          console.log('goto product page !!!');
          return false;
        }
        try {
          await context.waitForXPath('//div[@data-automation-id="changeStoreFulfillmentBannerBtn"]//span[contains(@class,"AddressPanel__addressLine") and contains(text(), "' + zipcodeStreetAddress + '")]', { timeout: 55000 });
        } catch (error) {
          throw new Error('Fail to click on confirm button');
        }
      }
      return true;
    }

    console.log('locationStreetAddress value');
    console.log(locationStreetAddress);
    console.log(changedLocationStreetAddress);

    if (!(changedLocationStreetAddress.includes(zipcodeStreetAddress) && disabledContinueButton === false)) {
      const closeModalButton = await hasCloseModalButton();
      if (closeModalButton) {
        await context.click('button[aria-label="close modal"]');
      }
      let result = await changeLocation(zipcode);
      if (result === true && locationStreetAddress !== changedLocationStreetAddress) {
        result = await changeLocation(zipcode);
      }
      if (result === true && locationStreetAddress !== changedLocationStreetAddress) {
        console.log(locationStreetAddress);
        console.log(changedLocationStreetAddress);
        throw new Error('Fail to change zipcode');
      }
    }
  },
};
