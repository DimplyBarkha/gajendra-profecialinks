
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'k-ruoka',
    transform,
    domain: 'k-ruoka.fi',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
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
    // await context.setJavaScriptEnabled(true);
    // await context.setCssEnabled(true);
    await context.evaluate(async function () {
      var NutritionInfo = document.querySelector('div.shopping-list-product-details-container section.collapsible-container.product-nutritional-detail a');
      var table = document.querySelector('div.nutritional-contents');
      if (table) {
        document.body.append(table);
      } else if (!table && NutritionInfo) {
        console.log('clicking...');
        NutritionInfo.click();
        var table = document.querySelector('div.nutritional-contents');
        document.body.append(table);
      }
      const sellerInfo = document.querySelector('div.shopping-list-product-details-container > section > section.collapsible-container.product-availability > a');
      if (sellerInfo) {
        sellerInfo.click();
      }
      //clicking the show more option in the description
      const descriptionText = document.querySelector('.product-details-description>a');
      if (descriptionText) {
        descriptionText.click();
      }
      //clicking the anchor to load more details
      const navButton = document.querySelector('section.collapsible-container.collapsible-basic-details img');
      if (navButton) {
        navButton.click();
        console.log('navButton clicked');
      }
      //clicking the anchor to load more stores
      const navButton1 = document.querySelector('.collapsible-container.product-availability img');
      if (navButton1) {
        navButton1.click();
        console.log('navButton1 clicked');
      }
      //clicking the anchor to load nutrition
      const navButton2 = document.querySelector('.collapsible-container.product-nutritional-detail img');
      if (navButton2) {
        navButton2.click();
        console.log('navButton2 clicked');
      }
      //clicking the anchor to load allergy advices
      const algButton = document.querySelector('.allergens__group a');
      if (algButton) {
        algButton.click();
        console.log('algbutton clicked');
      }
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
