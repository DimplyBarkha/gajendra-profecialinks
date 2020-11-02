
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode } = inputs;
  // const { country, domain, store } = parameters;
  const menuSelector = 'button[data-tl-id="header-Header-sparkButton"]';
  const hasMenuLink = await context.evaluate((selector) => !!document.querySelector(selector), menuSelector);
  if (hasMenuLink) {
    await context.click(menuSelector);
  }

  const zipSelector = 'button[data-tl-id="header-GlobalHeaderSparkMenu-locationButton"]';
  const hasZipLink = await context.evaluate((selector) => !!document.querySelector(selector), zipSelector);
  if (!hasZipLink) {
    return;
  }

  const currentZip = await context.evaluate((selector) => document.querySelector(selector) ? document.querySelector(selector).innerText : '', zipSelector);

  console.log(`Current Location : ${currentZip}`);
  if (currentZip && !currentZip.includes(zipcode)) {
    await context.click(zipSelector);
    await context.waitForSelector('div#vh-location-form', { timeout: 10000 });
    await context.setInputValue('div#vh-location-form input[data-tl-id="zipcode-form-input"]', zipcode);
    const updateLocationSelector = 'div#vh-location-form button[data-tl-id="zipcode-form-submit-button"]';
    await context.waitForSelector(updateLocationSelector, { timeout: 10000 });
    await context.clickAndWaitForNavigation(updateLocationSelector, {}, { timeout: 20000 });
  }
  await context.click('body');
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    domain: 'walmart.com',
    country: 'US',
    store: 'walmart',
  },
  implementation,
};
