const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const storeId = inputs.storeId;
  const zipcode = inputs.zipcode;
  async function setStoreInteraction ({ zipcode, storeId }) {
    await context.click('button[label="Change store"]');
    await context.waitForSelector('input[name="postalCode"]');
    // await context.setInputValue('input[name="postalCode"]', zipcode);
    await context.evaluate((zipcode) => { document.querySelector('input[name="postalCode"]').value = zipcode; }, zipcode);
    await context.click('button[data-automation-id="zipSearchBtn"]');
    await context.waitForSelector('[data-automation-id="selectFlyoutItem"]');
    const retry = await context.evaluate((storeId) => {
      const store = Array.from(document.querySelectorAll('[data-automation-id="selectFlyoutItemBtn"]'))
        .find((store) =>
          store.nextElementSibling
            .querySelector('[data-automation-id="label"]')
            .innerText.includes(storeId),
        );

      if (store.checked) {
        const nextStore = [...document.querySelectorAll('[data-automation-id="selectFlyoutItemBtn"]')].find(elm => !elm.checked);
        nextStore.click();
        return true;
      }
      store.click();
      return false;
    }, storeId);
    await context.click('[data-automation-id="locationFlyout-continueBtn"]');
    await context.waitForSelector('[data-automation-id="confirmFulfillmentBtn"]');
    await context.click('[data-automation-id="confirmFulfillmentBtn"]');
    await context.waitForSelector('[data-automation-id="fulfillmentBannerAddress"]');
    return retry;
  }
  const noAddress = await context.evaluate(() => !!document.querySelector('[data-automation-id="fulfillmentBannerAddress"]'));
  try {
    if (!noAddress) {
      const retry = await setStoreInteraction({ zipcode, storeId });
      if (retry) {
        await setStoreInteraction({ zipcode, storeId });
      }
    }
  } catch (err) {
    console.log('Error: ', err);
    throw new Error('Could not set store.');
  }

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/geo/geoExtract',
  parameterValues: {
    country: 'US',
    store: 'walmartToGo',
    transform,
    domain: 'walmart.com',
  },
  implementation,
};
