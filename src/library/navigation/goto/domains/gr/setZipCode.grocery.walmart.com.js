
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'grocery.walmart.com',
    store: 'walmartOG',
  },
  implementation: async ({ zipcode }, parameters, context, dependencies) => {
    // this setzip code needs to be activated when on the home page
    let locationStreetAddress = '';
    const zipcodeStreetAddress = {
      72758: '4208 Pleasant Crossing Blvd',
      75204: '2305 N Central Expy',
    }[zipcode] || '';

    const changeStoreSelector = 'button[label="Change store"]';
    const streetAddressSelector = 'div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]';
    const disableContinueSelector = 'button[data-automation-id="locationFlyout-continueBtn"]';
    const modalPortalSelector = 'div.ReactModalPortal';
    const zipFieldSelector = 'input[data-automation-id="zipSearchField"]';
    const zipSearchButton = 'button[data-automation-id="zipSearchBtn"]';

    const hasDisabledContinuedButton = async () => {
      try {
        await context.waitForSelector(disableContinueSelector);
      } catch (error) {
        return false;
      }
      return context.evaluate((disableContinueSelector) => {
        return document.querySelector(disableContinueSelector).hasAttribute('disabled');
      }, disableContinueSelector);
    };

    const changedLocationStreetAddress = await context.evaluate((selector) => {
      return document.querySelector(selector) ? document.querySelector(selector).textContent : '';
    }, streetAddressSelector);

    const ifThereClickOnIt = async (selector) => {
      try {
        await context.waitForSelector(selector, { timeout: 5000 });
      } catch (error) {
        console.log(`The following selector was not found: ${selector}`);
        return false;
      }
      const hasItem = await context.evaluate((selector) => {
        return document.querySelector(selector) !== null;
      }, selector);
      if (hasItem) {
        // try both click
        try {
          await context.click(selector, { timeout: 2000 });
        } catch (error) {
          // context click did not work and that is ok
        }
        await context.evaluate((selector) => {
          const elem = document.querySelector(selector);
          if (elem) elem.click();
        }, selector);
        return true;
      }
      return false;
    };

    async function changeLocation (zipcode) {
      await ifThereClickOnIt('button[aria-label="close modal"]');

      await context.evaluate((modalPortalSelector) => {
        if (document.querySelector(modalPortalSelector)) {
          document.querySelector(modalPortalSelector).remove();
        }
      }, modalPortalSelector);

      await ifThereClickOnIt(changeStoreSelector);

      await context.waitForSelector(zipFieldSelector, { timeout: 45000 })
        .catch(async () => {
          await ifThereClickOnIt('section[data-automation-id="closeableOverlay"]');
          await ifThereClickOnIt(changeStoreSelector);
          await context.waitForSelector(zipFieldSelector, { timeout: 45000 });
        });

      try {
        await context.setInputValue(zipFieldSelector, zipcode);
      } catch (error) { // try a second time
        await ifThereClickOnIt('section[data-automation-id="closeableOverlay"]');
        await ifThereClickOnIt(changeStoreSelector);
        await context.waitForSelector(zipFieldSelector, { timeout: 45000 });
        await context.setInputValue(zipFieldSelector, zipcode);
      }
      await ifThereClickOnIt(zipSearchButton);

      await context.waitForSelector('li[data-automation-id="selectFlyoutItem"]', { timeout: 45000 });
      await context.waitForSelector('li[data-automation-id="selectFlyoutItem"]:first-child input');

      await ifThereClickOnIt('input[data-automation-id="selectFlyoutItemBtn"]:first-child');

      const selector = 'li[data-automation-id="selectFlyoutItem"] span[class^="AddressPanel__addressLine"]';
      await context.waitForSelector(selector);
      locationStreetAddress = await context.evaluate((selector) => {
        return document.querySelector(selector) ? document.querySelector(selector).textContent : '';
      }, selector);

      if (!await hasDisabledContinuedButton()) {
        await ifThereClickOnIt(disableContinueSelector);
        await ifThereClickOnIt('button[data-automation-id="confirmFulfillmentBtn"]');
        try {
          await context.waitForSelector('div[data-automation-id="changeStoreFulfillmentBannerBtn"] span[class^="AddressPanel__addressLine"]', { timeout: 45000 });
        } catch (error) {
          console.log('goto product page !!!');
          return false;
        }
        const xpath = `//div[@data-automation-id="changeStoreFulfillmentBannerBtn"]//span[contains(@class,"AddressPanel__addressLine") and contains(text(), ${zipcodeStreetAddress}")]`;
        await context.waitForXPath(xpath, { timeout: 55000 })
          .catch(e => {
            throw new Error('Fail to click on confirm button');
          });
      }
      return true;
    }

    console.log(`locationStreetAddress value: ${locationStreetAddress}, ${changedLocationStreetAddress}`);

    let result;
    if (!changedLocationStreetAddress.includes(zipcodeStreetAddress)) {
      result = await changeLocation(zipcode);
      if (result === true && locationStreetAddress !== changedLocationStreetAddress) {
        console.log(`Second attempt, selected : "${locationStreetAddress}" and current : "${changedLocationStreetAddress}"`);
        result = await changeLocation(zipcode);
      }
      if (result === true && locationStreetAddress !== changedLocationStreetAddress) {
        // change to a different zipcode
        await changeLocation(zipcode === '90262' ? '10001' : '90262');
        // then to the proper zipcode
        await changeLocation(zipcode);
        console.log(`After second attempt attempt, selected : "${locationStreetAddress}" and current : "${changedLocationStreetAddress}"`);
        if (result === true && locationStreetAddress !== changedLocationStreetAddress) {
          console.log('Failed to change zipcode');
        }
      }
    }
  },
};
