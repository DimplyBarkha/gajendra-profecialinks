async function implementation (
  inputs, parameters, context, dependencies,
) {
  const { url, zipcode } = inputs;

  async function getCurrentZip () {
    return await context.evaluate(async function () {
      const element = document.querySelector('span[data-testid="CurrentModality-vanityName"]');
      if (element != null) {
        return element.textContent;
      }
      return null;
    });
  }

  async function findButtonWithStoreSelect () {
    await context.evaluate(function () {
      const buttons = document.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        if (button.textContent === 'Select Store') {
          console.log('Found Button');
          button.click();
          return;
        }
      }
    });
  }

  async function findClosestStore () {
    const ixToClick = await context.evaluate(async function () {
      const sections = document.querySelectorAll('div.ModalitySelector--StoreSearchResult');
      let smallestDistance = 999;
      let smallestIx = null;
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i].children[1].children[0].children[0];

        if (section !== null) {
          const distance = parseFloat(section.textContent);
          if (distance < smallestDistance) {
            smallestDistance = distance;
            smallestIx = i + 1;
          }
        }
        console.log(section.textContent);
      }
      console.log('Closest store: ' + smallestDistance);
      return smallestIx;
    });
    await context.click(`div.ModalitySelector--StoreSearchResult:nth-of-type(${ixToClick}) div.StoreSearchResults-StartButton`);
  }

  async function changeZip (wantedZip) {
    await context.click('button.CurrentModality-button');
    await new Promise((resolve, reject) => setTimeout(resolve, 6e3));

    await context.setInputValue('input[data-testid="PostalCodeSearchBox-input"]', wantedZip);
    await new Promise((resolve, reject) => setTimeout(resolve, 6e3));

    await context.click('button.kds-SolitarySearch-button');
    await new Promise((resolve, reject) => setTimeout(resolve, 6e3));
    await findButtonWithStoreSelect();
    await new Promise((resolve, reject) => setTimeout(resolve, 6e3));
    await findClosestStore();
    await new Promise((resolve, reject) => setTimeout(resolve, 6e3));
  }

  await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });

  const wantedZip = zipcode;

  const currentZip = await getCurrentZip();
  console.log('Want zip: ' + wantedZip + ' got zip: ' + currentZip);

  if (currentZip !== wantedZip) {
    console.log('Trying to change zip');
    await changeZip(wantedZip);
  }

  await context.evaluate(() => {
    const overlay = document.getElementsByClassName('ReactModal__Overlay ReactModal__Overlay--after-open ModalitySelectorDynamicTooltip--Overlay page-popovers')[0];

    if (overlay !== undefined) {
      overlay.click();
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 2e3));
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
