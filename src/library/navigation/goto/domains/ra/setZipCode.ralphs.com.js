async function implementation (
  inputs, parameters, context, dependencies,
) {
  const { zipcode } = inputs;

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
      const mystore = document.querySelector('button[data-testid="ModalityOption-Button-PICKUP"]'); //Change Store
      if (mystore) mystore.click();
    });
  };

  const findButtonWithShip = async () => {
    await context.evaluate(function () {
      const mystore = document.querySelector('button[aria-label*="Ship"]');
      if (mystore) mystore.click();
    });
  };

  const findClosestStore = async () => {
    await context.evaluate(function () {
      const mystore = document.querySelector('div.ModalitySelector--StoreSearchResult:nth-of-type(1) div.StoreSearchResults-StartButton button');
      if (mystore) mystore.click();
    });

    // const indexToClick = await context.evaluate(async function () {
      // const sections = document.querySelectorAll('div.ModalitySelector--StoreSearchResult');
      // let smallestDistance = null;
      //let indexToClosestStore = null;
      // let indexToClosestStore = 1;
      // sections.forEach((sectionItem, i) => {
      //   const section = sectionItem.querySelector('div.StoreSearchResults-StoreButtonWrapper div div');

      //   if (section && section.textContent) {
      //     const distance = parseFloat(section.textContent);
      //     if (!smallestDistance || distance < smallestDistance) {
      //       smallestDistance = distance;
      //       indexToClosestStore = i + 1;
      //     }
      //   }
      //   console.log(section.textContent);
      // });
      // console.log('Closest store: ' + smallestDistance);
      // return indexToClosestStore;
    // });
    try {
      const indexToClick = 1;
      // await context.click(`div.ModalitySelector--StoreSearchResult:nth-of-type(${indexToClick}) div.StoreSearchResults-StartButton`);
      // await context.click(`div.ModalitySelector--StoreSearchResult:nth-of-type(1) div.StoreSearchResults-StartButton`);
    } catch (err) {}
  };

  const changeZip = async (wantedZip) => {
    await context.click('button.CurrentModality-button');
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));

    await context.setInputValue('input[data-testid="PostalCodeSearchBox-input"]', wantedZip);
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));

    await context.click('button.kds-SolitarySearch-button');
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));
    // await findButtonWithShip();
    await findButtonWithStoreSelect();
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));
    await findClosestStore();
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  };

  await context.evaluate(() => {
    const overlay = document.querySelector('#kds-Modal-kh3pr23t > button');
    if (overlay) {
      overlay.click();
    }
  });

  const currentZip = await getCurrentZip();
  console.log(`Want zip: ${zipcode}, got zip: ${currentZip}`);
  
  if (currentZip !== "Citrus Plaza") {
  // if (currentZip !== zipcode) {
    console.log('Trying to change zip');
    await changeZip(zipcode);
  }
  // await changeZip(zipcode);
  await context.evaluate(() => {
    const overlay = document.querySelector('#kds-Modal-kh3pr23t > button');
    if (overlay) {
      overlay.click();
    }
  });
  
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'ralphs.com',
    store: 'ralphs_92201',
    zipcode: '92201',
  },
  implementation,
};
