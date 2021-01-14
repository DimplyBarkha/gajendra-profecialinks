async function implementation (
  inputs, parameters, context, dependencies,
) {
  const { zipcode, url } = inputs;

  // const getCurrentZip = async () => {
  //   return await context.evaluate(async function () {
  //     const element = document.querySelector('span[data-testid="CurrentModality-vanityName"]');
  //     if (element) {
  //       return element.textContent;
  //     }
  //     return null;
  //   });
  // };

  // const findButtonWithStoreSelect = async () => {
  //   await context.evaluate(function () {
  //     const mystore = document.querySelector('button[aria-label*="Select Store"]');
  //     if (mystore) mystore.click();
  //   });
  // };

  // const findClosestStore = async () => {
  //   const indexToClick = await context.evaluate(async function () {
  //     const sections = document.querySelectorAll('div.ModalitySelector--StoreSearchResult');
  //     let smallestDistance = null;
  //     let indexToClosestStore = null;
  //     sections.forEach((sectionItem, i) => {
  //       const section = sectionItem.querySelector('div.StoreSearchResults-StoreButtonWrapper div div');

  //       if (section && section.textContent) {
  //         const distance = parseFloat(section.textContent);
  //         if (!smallestDistance || distance < smallestDistance) {
  //           smallestDistance = distance;
  //           indexToClosestStore = i + 1;
  //         }
  //       }
  //       console.log(section.textContent);
  //     });
  //     console.log('Closest store: ' + smallestDistance);
  //     return indexToClosestStore;
  //   });
  //   await context.click(`div.ModalitySelector--StoreSearchResult:nth-of-type(${indexToClick}) div.StoreSearchResults-StartButton`);
  // };

  // const changeZip = async (wantedZip) => {
  //   await context.click('button.CurrentModality-button');
  //   await new Promise((resolve, reject) => setTimeout(resolve, 6000));

  //   await context.setInputValue('input[data-testid="PostalCodeSearchBox-input"]', wantedZip);
  //   await new Promise((resolve, reject) => setTimeout(resolve, 6000));

  //   await context.click('button.kds-SolitarySearch-button');
  //   await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  //   await findButtonWithStoreSelect();
  //   await new Promise((resolve, reject) => setTimeout(resolve, 8000));
  //   await findClosestStore();
  //   await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  // };

  // const currentZip = await getCurrentZip();
  // console.log(`Want zip: ${zipcode}, got zip: ${currentZip}`);

  // if (currentZip !== zipcode) {
  //   console.log('Trying to change zip');
  //   await changeZip(zipcode);
  // }

  // await context.evaluate(() => {
  //   const overlay = document.querySelector('.ReactModal__Overlay ReactModal__Overlay--after-open ModalitySelectorDynamicTooltip--Overlay page-popovers');

  //   if (overlay) {
  //     overlay.click();
  //   }
  // });

  await context.stop();
  await context.goto('https://www.auchan.fr/courses', {
    timeout: 10000000,
    waitUntil: 'networkidle0',
    checkBlocked: true,
    js_enabled: true,
    css_enabled: false,
    random_move_mouse: true,
  });
  const chooseDriveSelector = await context.evaluate(async function () {
    var el = document.querySelector('.context-header button.context-header__button');
    try {
      for (var i = 0; i < 10; i++) {
        if (document.querySelector('[autotrack-event-action="tutorial_click_useful"]')) {
          document.querySelector('[autotrack-event-action="tutorial_click_useful"]').click();
        }
      }
    } catch (err) { }

    console.log('nilesh', el.innerText);
    if (el && el.innerText.indexOf('Paris') === -1) {
      return '.context-header button.context-header__button';
    } else { return null; }
  });
  console.log('chooseDriveSelector', chooseDriveSelector);
  if (chooseDriveSelector) {
    await context.waitForSelector(chooseDriveSelector, { timeout: 45000 });
    await context.click(chooseDriveSelector);
    // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    try {
      await context.waitForSelector('.layer__wrapper--journey-locator', { timeout: 7000 });
    } catch (e) {
      await context.evaluate(async function (chooseDriveSelector) {
        if (document.querySelector(chooseDriveSelector)) {
          document.querySelector(chooseDriveSelector).click();
        }
      }, chooseDriveSelector);
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    }
    try {
      await context.waitForSelector('input.journeySearchInput', { timeout: 7000 });
      // zipcode: '75020'
      await context.setInputValue('input.journeySearchInput', zipcode);
      await context.waitForSelector('li.journey__search-suggest');
      await context.click('li.journey__search-suggest');
      await context.waitForSelector('.journey-offering-context__wrapper .journey-offering-context__actions button');
      await context.click('.journey-offering-context__wrapper .journey-offering-context__actions button');
    } catch (error) {
      console.log('Not loading inputs for journey search');
    }
  }
  // await context.goto(`${url}#[!opt!]{"discard_CSP_header":true, "block_ads": false}[/!opt!]`, { timeout: 65000, waitUntil: 'load', js_enabled: true, css_enabled: false, random_move_mouse: true, checkBlocked: false });

  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'FR',
    domain: 'auchan.fr',
    store: 'auchan',
    zipcode: '',
  },
  implementation,
};
