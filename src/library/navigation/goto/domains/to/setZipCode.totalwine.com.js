
async function implementation (
  inputs, parameters, context, dependencies,
) {
  const { zipcode } = inputs;

  const getCurrentZip = async () => {
    await context.evaluate(async function () {
      const locationDiv = document.querySelector('div#at_myLocation_Primary a');

      if (locationDiv) {
        locationDiv.click();
      }
    });
    await context.waitForSelector('div[class*="currentStoreCard"]', { timeout: 65000 });
    return await context.evaluate(async function () {
      const element = document.querySelector('div[class*="currentStoreCard"] p:nth-child(2)');
      if (element) {
        return element.textContent;
      }
      return null;
    });
  };

  const selectStoreButton = async () => {
    await context.evaluate(function () {
      const mystore = document.querySelector('button[data-at^="location_slideout_pickup"]');
      if (mystore) mystore.click();
    });
  };

  const changeZip = async (wantedZip) => {
    // await context.click('button.CurrentModality-button');
    // await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    await context.setInputValue('div[class^="FieldContainer"] input[aria-labelledby^="TextInput"]', wantedZip);
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    await context.click('div[class^="FieldContainer"] button[data-at="at_submitSearch"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await selectStoreButton();
    await new Promise((resolve, reject) => setTimeout(resolve, 8000));
  };

  const currentZip = await getCurrentZip();
  console.log(`Want zip: ${zipcode}, got zip: ${currentZip}`);

  if (currentZip !== zipcode) {
    console.log('Trying to change zip');
    await changeZip(zipcode);
  }

  await context.evaluate(() => {
    const backToProductPageButton = document.querySelector('button[class^="backButton"]');

    if (backToProductPageButton) {
      backToProductPageButton.click();
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'totalwine.com',
    store: 'totalwine',
  },
  // implementation,
};
