async function implementation (
  inputs, parameters, context, dependencies,
) {
  const { url, zipcode } = inputs;

  const findClosestStore = async () => {
    const indexToClick = await context.evaluate(async function () {
      const sections = document.querySelectorAll('div.ModalitySelector--StoreSearchResult');
      let smallestDistance = null;
      let indexToClosestStore = null;
      sections.forEach((sectionItem, i) => {
        const section = sectionItem.querySelector('div.ModalitySelector-StoreSearchResultVanityNameWrapper');

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

  const findSpecificStore = async (storeName) => {
    const indexToClick = await context.evaluate(async function (storeName) {
      const sections = document.querySelectorAll('div.ModalitySelector--StoreSearchResult');
      let indexToClosestStore = null;

      sections.forEach((sectionItem, i) => {
        const section = sectionItem.querySelector('div.ModalitySelector-StoreSearchResultVanityNameWrapper');

        if (section && section.textContent) {
          if (section.textContent.includes(storeName)) {
            indexToClosestStore = i + 1;
          }
        }
        console.log(section.textContent);
      });
      console.log(`indexToClosestStore - ${indexToClosestStore}`);
      return indexToClosestStore;
    }, storeName);
    !indexToClick ? console.log('ALERT!!, The store name is probably changed') : console.log('Store found, clicking it');
    await context.click(`div.ModalitySelector--StoreSearchResult:nth-of-type(${indexToClick}) div.StoreSearchResults-StartButton`);
  };

  const changeZip = async (wantedZip) => {
    await context.click('button.CurrentModality-button');
    console.log('clicked on the pickup at button');
    await context.waitForSelector('input[data-testid="PostalCodeSearchBox-input"]', { timeout: 6000 });

    const refreshRequested = await context.evaluate(() => {
      return Boolean(document.querySelector('p.kds-Paragraph.kds-Paragraph--m.kds-GlobalMessage-body.max-w-full.mb-0 span'));
    });

    const hasZipBtn = await context.evaluate(() => {
      return Boolean(document.querySelector('input[data-testid="PostalCodeSearchBox-input"]'));
    });

    console.log(`hasZipBtn - ${hasZipBtn}`);
    console.log(`Refresh needed? ${refreshRequested}`);
    if (!hasZipBtn || refreshRequested) {
      await context.goto('about:blank');
      await context.goto(url, {
        timeout: 20000,
        block_ads: false,
        anti_fingerprint: false,
        load_all_resources: true,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
      // await context.goto(url, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
      await context.click('button.CurrentModality-button');
      await context.waitForSelector('input[data-testid="PostalCodeSearchBox-input"]', { timeout: 6000 });
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.setInputValue('input[data-testid="PostalCodeSearchBox-input"]', wantedZip)
      .catch(async function () {
        await context.click('button.CurrentModality-button');
        await context.waitForSelector('input[data-testid="PostalCodeSearchBox-input"]', { timeout: 6000 });
        await context.setInputValue('input[data-testid="PostalCodeSearchBox-input"]', wantedZip);
      });
    await context.waitForSelector('button.kds-SolitarySearch-button', { timeout: 30000 });
    console.log('set the zipcode, and waiting for the search button');

    await context.click('button.kds-SolitarySearch-button');
    await context.waitForSelector('button[aria-label*="In-Store"]', { timeout: 30000 });
    console.log('clicked the search button and waiting for the button for "instore"');

    await context.click('button[aria-label*="In-Store"]');
    await context.waitForSelector('div.ModalitySelector--StoreSearchResult', { timeout: 30000 });
    console.log('clicked for the instore button and waiting for the search results to load');

    const desiredLocations = {
      45209: 'Hyde Park',
      45255: 'Cherry Grove',
      48315: 'Shelby Marketplace',
      45044: 'Middletown428 Oxford State Rd',
      45232: 'St. Bernard',
      41071: 'I-471 Memorial Pkwy', // I-471 @ Memorial Pkwy/Carothers Rd
    };

    if (desiredLocations[wantedZip]) {
      console.log('this zipcode is in the desiredLocations');
      const store = desiredLocations[wantedZip];
      await findSpecificStore(store);
    } else {
      await findClosestStore();
    }

    await context.waitForSelector('div.ProductCard a', { timeout: 6000 })
      .catch(() => {
        console.log('could not wait for the product card selector');
      });
  };

  try {
    console.log(`Trying to change zip to ${zipcode}`);
    await changeZip(zipcode);
  } catch (exception) {
    console.log('Retrying zip change');
    await changeZip(zipcode)
      .catch(() => {
        throw new Error('Failed to change zip with retry');
      });
  }
  await context.evaluate(() => {
    const overlay = document.querySelector('.ReactModal__Overlay ReactModal__Overlay--after-open ModalitySelectorDynamicTooltip--Overlay page-popovers');
    if (overlay) {
      console.log('we got and clicked overlay - ' + overlay);
      overlay.click();
    } else {
      console.log('we do not have overlay');
    }
  });
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
