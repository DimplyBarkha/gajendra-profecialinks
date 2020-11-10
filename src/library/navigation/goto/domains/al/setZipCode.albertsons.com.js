async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode } = inputs;
  const addOptionalWait = async (selector) => {
    try {
      await context.waitForSelector(selector, { timeout: 30000 });
      console.log(`${selector} loaded successfully`);
    } catch (e) {
      console.log(`${selector} did not load at all`);
    }
  };
  addOptionalWait('button[id="onboardingCloseButton"]');
  await context.evaluate(() => {
    const closeButton = document.querySelector('button[id="onboardingCloseButton"]');
    if (closeButton) {
      closeButton.click();
    }
  });
  await context.evaluate(async (context) => {
    const changeButton = document.querySelector('button[id="openFulfillmentModalButton"][class*="button"]');
    if (changeButton) {
      console.log('entered if block');
      changeButton.click();
      console.log('button clicked sucessfully');
      // await new Promise(resolve => { setTimeout(resolve, 30000); });
    }
    console.log('sucessfully clicked the change button');
  });
  addOptionalWait('input[aria-labelledby="zipcode"]');
  await context.setInputValue('input[aria-labelledby="zipcode"]', `${zipcode}`);
  await context.evaluate(async () => {
    const searchButton = document.querySelector('span[aria-label*="Zipcode"]');
    if (searchButton) {
      searchButton.click();
      console.log('able to click the button');
      // await new Promise(resolve => { setTimeout(resolve, 30000); });
      // await context.waitForSelector('div[class="card-wrapper"]>div[class="card-store"]:nth-child(1) a[role="button"]', { timeout: 30000 })
    }
  });
  addOptionalWait('div[class="card-wrapper"]>div[class="card-store"]:nth-child(1) a[role="button"]');
  await context.evaluate(async () => {
    console.log('entered for clicking select button');
    const selectButton = document.querySelector('div[class="card-wrapper"]>div[class="card-store"]:nth-child(1) a[role="button"]');
    if (selectButton) {
      selectButton.click();
      console.log('button clicked successfully');
    } else {
      console.log('not able to click button');
    }
  });
  // await new Promise(resolve => { setTimeout(resolve, 30000); });
  await context.waitForNavigation({ timeout: 30000 });
}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'albertsons.com',
    store: 'albertsons',
    zipcode: '83642',
  },
  implementation,
};
