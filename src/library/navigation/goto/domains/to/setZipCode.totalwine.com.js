
async function implementation (
  inputs, parameters, context, dependencies,
) {
  let url = inputs.url;
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
      // const mystore = document.querySelector('button[data-at^="location_slideout_pickup"]');
      const mystore = document.querySelector('button.setMyStoreBtn__1HCHxCQ8');
      if (mystore) {
        mystore.click();
      } 
    });
  };

  async function setURlandNavigate() {
    await context.evaluate(function (url) {
      try {
        let storeInfo = document.querySelector('a[href*="store-info"]');
        if (!storeInfo) {
          throw new Error('STORE NOT FOUND');
        } 
        console.log(`Store info - ${storeInfo}`);
        let storeId = storeInfo ? storeInfo.getAttribute('href').split('/').pop() : null;
        console.log(`Store ID ${storeId}`)
        if (storeId) {
          // modifying input URL to redirect to the selected store.
          url = url.replace(/(.*?)s=(.*?)&(.*)/g, `$1s=${storeId}&$3`);
          console.log('Modified URL' + url);
          window.location.href = url;
        }
      } catch (error) {
        console.log('store not found for the current zipcode extracting the data from given URL' + error);
        window.location.href = url;
      }
    }, url);
  };

  const changeZip = async (wantedZip) => {
    // await context.click('button.CurrentModality-button');
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await context.goto(`https://www.totalwine.com/store-finder/search?q=${wantedZip}&radius=20`, { timeout: 60000, waitUntil: 'networkidle0', checkBlocked: true});
    // await context.waitForSelector('div[class^="FieldContainer"] input[aria-labelledby^="TextInput"]', { timeout: 65000 });
    // await context.setInputValue('div[class^="FieldContainer"] input[aria-labelledby^="TextInput"]', wantedZip);
    // await context.click('div[class^="FieldContainer"] button[data-at="at_submitSearch"]');
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await selectStoreButton();
    await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await setURlandNavigate();
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  };

  const currentZip = await getCurrentZip();
  console.log(`Want zip: ${zipcode}, got zip: ${currentZip}`);

  if (currentZip !== zipcode) {
    console.log('Trying to change zip');
    await changeZip(zipcode);
  }

  // await context.evaluate(() => {
  //   const backToProductPageButton = document.querySelector('button[class^="backButton"]');

  //   if (backToProductPageButton) {
  //     backToProductPageButton.click();
  //   }
  // });

  // await context.goto(url, { timeout: 60000, waitUntil: 'networkidle0', checkBlocked: false });
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'totalwine.com',
    store: 'totalwine',
  },
  implementation,
};
