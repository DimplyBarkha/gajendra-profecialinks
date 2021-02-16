
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { url, zipcode } = inputs;
  // const { country, domain, store } = parameters;
  const zipSelector = 'button[data-tl-id="nd-zip"]';
  const currentZip = await context.waitForFunction((selector) => {
    return document.querySelector(selector);
  }, { timeout: 10000 }, zipSelector);

  if (currentZip !== zipcode) {
    await context.click(zipSelector);
    await context.waitForSelector('div[next-day-location-modal="location-form"]', { timeout: 15000 });
    await context.setInputValue('div#next-day-location-modal input[data-tl-id="zipcode-form-input"]', zipcode);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await context.waitForSelector('div#next-day-location-modal button[location-input="submit-button"]', { timeout: 15000 });
    await context.click('div#next-day-location-modal button[location-input="submit-button"]');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await context.goto(url, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
    console.log(`Selected zip code: ${zipcode}`);
  }
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'walmart.com',
    store: 'walmart',
  },
  implementation,
};
