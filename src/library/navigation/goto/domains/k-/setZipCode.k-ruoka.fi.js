
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'FI',
    domain: 'k-ruoka.fi',
    store: 'k-ruoka',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { timeout = 60000, waitUntil = 'load', checkBlocked = true } = {};
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);
    // const mainUrl = 'https://www.k-ruoka.fi/';
    await context.goto(inputs.url, { timeout, waitUntil, checkBlocked });
    const { zipcode } = inputs;
    let locationStreetAddress = '';
    let disabledContinueButton = false;
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);

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
      await context.setInputValue('input[type="search"][value]', zipcode);
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
