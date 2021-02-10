
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'k-ruoka.fi',
    timeout: 20000,
    country: 'FI',
    store: 'k-ruoka',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { timeout = 60000, waitUntil = 'load', checkBlocked = true } = {};
    // const mainUrl = 'https://www.k-ruoka.fi/';
    await context.goto(inputs.url, { timeout, waitUntil, checkBlocked });
    const { zipcode } = inputs;
    let locationStreetAddress = '';
    let disabledContinueButton = false;

    console.log(zipcode, 'ZIP CODE');

    async function hasDisabledContinuedButton () {
      const hasIt = await context.evaluate(async function () {
        return document.querySelector('button[data-automation-id="locationFlyout-continueBtn"]').hasAttribute('disabled');
      });
      return hasIt;
    }

    async function changeLocation (zipcode) {
      await context.evaluate(async function () {
        if (document.querySelector('#kconsent')) {
          document.querySelector('#kconsent').remove();
        }
      });
      await context.waitForSelector('a.store-and-chain .switch-icon');
      await context.evaluate(async function () {
        const button = document.querySelector('a.store-and-chain .switch-icon');
        if (button) {
          button.click();
        }
      });
      await context.waitForSelector('.store-selector__search input');
      await context.setInputValue('.store-selector__search input', zipcode);
      await context.click('.store-list a');

      await context.waitForSelector('li[data-automation-id="selectFlyoutItem"]');
      await context.waitForSelector('li[data-automation-id="selectFlyoutItem"]:first-child input');
      await context.evaluate(async function () {
        const searchZipCode = document.querySelector('input[data-automation-id="selectFlyoutItemBtn"]:first-child');
        if (searchZipCode !== undefined) {
          searchZipCode.click();
        }
        locationStreetAddress = (document.querySelector('li[data-automation-id="selectFlyoutItem"] span[class^="AddressPanel__addressLine"]')) ? document.querySelector('li[data-automation-id="selectFlyoutItem"] span[class^="AddressPanel__addressLine"]').textContent : '';
      });

      await context.waitForSelector('button[data-automation-id="locationFlyout-continueBtn"]');

      disabledContinueButton = await hasDisabledContinuedButton();

      if (disabledContinueButton === false) {
        await context.click('button[data-automation-id="locationFlyout-continueBtn"]');
        await context.waitForSelector('button[data-automation-id="confirmFulfillmentBtn"]');
        await context.click('button[data-automation-id="confirmFulfillmentBtn"]');
        await new Promise((resolve, reject) => setTimeout(resolve, 15000));
        await context.waitForSelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]');
        // context.waitForMutuation('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]', { timeout: 20000 });
      }
    }

    const changedLocationStreetAddress = await context.evaluate(function () {
      return document.querySelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]') ? document.querySelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]').textContent : '';
    });

    // TODO: need to set this as input
    if (!(changedLocationStreetAddress === '4208 Pleasant Crossing Blvd') && disabledContinueButton === false) {
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
