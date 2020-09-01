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
      return indexToClosestStore;
    }, storeName);
    await context.click(`div.ModalitySelector--StoreSearchResult:nth-of-type(${indexToClick}) div.StoreSearchResults-StartButton`);
  };

  const changeZip = async (wantedZip) => {
    await context.click('button.CurrentModality-button');
    await context.waitForSelector('input[data-testid="PostalCodeSearchBox-input"]', { timeout: 6000 });

    const refreshRequested = await context.evaluate(() => {
      return Boolean(document.querySelector('p.kds-Paragraph.kds-Paragraph--m.kds-GlobalMessage-body.max-w-full.mb-0 span'));
    });

    const hasZipBtn = await context.evaluate(() => {
      return Boolean(document.querySelector('input[data-testid="PostalCodeSearchBox-input"]'));
    });

    console.log(hasZipBtn);
    console.log(`Refresh needed? ${refreshRequested}`);
    if (!hasZipBtn || refreshRequested) {
      await context.goto('about:blank');
      await context.goto(url, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
      await context.click('button.CurrentModality-button');
      await context.waitForSelector('input[data-testid="PostalCodeSearchBox-input"]', { timeout: 6000 });
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.setInputValue('input[data-testid="PostalCodeSearchBox-input"]', wantedZip)
      .catch(async function () {
        await context.click('button.CurrentModality-button');
        await context.setInputValue('input[data-testid="PostalCodeSearchBox-input"]', wantedZip);
      });
    await context.waitForSelector('button.kds-SolitarySearch-button', { timeout: 30000 });

    await context.click('button.kds-SolitarySearch-button');
    await context.waitForSelector('button[aria-label*="In-Store"]', { timeout: 30000 });

    await context.click('button[aria-label*="In-Store"]');
    await context.waitForSelector('div.ModalitySelector--StoreSearchResult', { timeout: 30000 });

    const desiredLocations = {
      45209: 'Hyde Park',
      45255: 'Cherry Grove',
      48315: 'Shelby Marketplace',
      45044: 'Middletown428 Oxford State Rd',
      45232: 'St. Bernard',
      41071: 'I-471 @ Memorial Pkwy/Carothers Rd',
    };

    if (desiredLocations[wantedZip]) {
      const store = desiredLocations[wantedZip];
      await findSpecificStore(store);
    } else {
      await findClosestStore();
    }

    await context.waitForSelector('div.ProductCard a', { timeout: 6000 })
      .catch(() => {
        console.log('');
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
      overlay.click();
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
