async function implementation (
  inputs, parameters, context, dependencies,
) {
  const { zipcode } = inputs;
  /*
  const getCurrentZip = async () => {
    return await context.evaluate(async function () {
      const element = document.querySelector('span[data-testid="CurrentModality-vanityName"]');
      if (element) {
        return element.textContent;
      }
      return null;
    });
  };

  const findButtonWithStoreSelect = async () => {
    await context.evaluate(function () {
      const mystore = document.querySelector('button[aria-label*="Select Store"]');
      if (mystore) mystore.click();
    });
  };

  const findClosestStore = async () => {
    const indexToClick = await context.evaluate(async function () {
      const sections = document.querySelectorAll('div.ModalitySelector--StoreSearchResult');
      let smallestDistance = null;
      let indexToClosestStore = null;
      sections.forEach((sectionItem, i) => {
        const section = sectionItem.querySelector('div.StoreSearchResults-StoreButtonWrapper div div');

        if (section && section.textContent) {
          const distance = parseFloat(section.textContent);
          if (!smallestDistance || distance < smallestDistance) {
            smallestDistance = distance;
            indexToClosestStore = i + 1;
          }
        }
        console.log(section.textContent);
      });
      console.log('Closest store: ' + smallestDistance);
      return indexToClosestStore;
    });
    await context.click(`div.ModalitySelector--StoreSearchResult:nth-of-type(${indexToClick}) div.StoreSearchResults-StartButton`);
  };

  const changeZip = async (wantedZip) => {
    await context.click('button.CurrentModality-button');
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    await context.setInputValue('input[data-testid="PostalCodeSearchBox-input"]', wantedZip);
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    await context.click('button.kds-SolitarySearch-button');
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await findButtonWithStoreSelect();
    await new Promise((resolve, reject) => setTimeout(resolve, 8000));
    await findClosestStore();
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  };

  const currentZip = await getCurrentZip();
  console.log(`Want zip: ${zipcode}, got zip: ${currentZip}`);

  if (currentZip !== zipcode) {
    console.log('Trying to change zip');
    await changeZip(zipcode);
  }

  await context.evaluate(() => {
    const overlay = document.querySelector('.ReactModal__Overlay ReactModal__Overlay--after-open ModalitySelectorDynamicTooltip--Overlay page-popovers');

    if (overlay) {
      overlay.click();
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 2000)); */

  async function getStoreDetails (zipcode) {
    const API = 'https://www.kroger.com/atlas/v1/modality/options';
    const body = {
      address: {
        postalCode: zipcode.toString(),
      },
    };
    const response = await fetch(API, {
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    const json = await response.json();
    const modalities = json.data.modalityOptions.PICKUP.slice(0, 1);
    const primaryModality = { PICKUP: modalities[0].id };
    const preferencesBody = {
      modalities,
      primaryModality,
      activeModality: 'PICKUP',
    };
    await fetch('https://www.kroger.com/atlas/v1/modality/preferences', {
      headers: {
        'content-type': 'application/json',
      },
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(preferencesBody),

    });
  }
  await context.evaluate(getStoreDetails, zipcode);
  await context.reload();
  await context.waitForNavigation({ waitUntil: 'load', timeout: 30000 });
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'kroger.com',
    store: 'kroger',
  },
  implementation,
};
