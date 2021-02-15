
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode, storeId, url } = inputs;
  await context.evaluate(async () => {
    const closePopupButton = document.querySelector('div.sc-block-modal button.sc-modal-close-button');
    if (closePopupButton) {
      // didn't work with context.click() outside context.evaluate()
      // @ts-ignore
      closePopupButton.click();
    }
    console.log(`storeid${storeId}`);
    console.log(`inputs storeid${inputs}`);
    const storeChangeUrl = `https://www.samsclub.com/club/springfield-mo-sams-club/${storeId}`;
    // await context.goto(storeChangeUrl, { timeout: 60000, waitUntil: 'networkidle0', checkBlocked: true });
    window.location.href = storeChangeUrl;
    await new Promise(resolve => { setTimeout(resolve, 60000); });
    const makeClub = document.querySelector('div.sc-club-summary-action button');
    if (makeClub) {
      makeClub.click();
    }
    // const changeButton = document.querySelector('div[class="club-container"]>button[class="sc-btn fake-link"]>span');
    // if (changeButton) {
    //   changeButton.click();
    //   await new Promise(resolve => { setTimeout(resolve, 15000); });
    // }
    // console.log('sucessfully clicked the change button');
  });
  // await context.evaluate(async () => {
  //   const closePopupButton = document.querySelector('div.sc-block-modal button.sc-modal-close-button');
  //   if (closePopupButton) {
  //     closePopupButton.click();
  //     await new Promise(resolve => { setTimeout(resolve, 5000); });
  //   }
  // });
  // await context.setInputValue('div[class="sc-find-clubs-input"] div[class="sc-input-box"] input', `${zipcode}`);
  // await context.evaluate(async () => {
  //   const closePopupButton = document.querySelector('div.sc-block-modal button.sc-modal-close-button');
  //   if (closePopupButton) {
  //     closePopupButton.click();
  //     await new Promise(resolve => { setTimeout(resolve, 5000); });
  //   }
  // });
  // await context.evaluate(async () => {
  //   const closePopupButton = document.querySelector('div.sc-block-modal button.sc-modal-close-button');
  //   if (closePopupButton) {
  //     closePopupButton.click();
  //     await new Promise(resolve => { setTimeout(resolve, 5000); });
  //   }
  //   const findButton = document.querySelector('div.sc-find-clubs-input button.sc-btn.sc-btn-primary');
  //   if (findButton) {
  //     findButton.click();
  //     await new Promise(resolve => { setTimeout(resolve, 15000); });
  //     console.log('able to click the button');
  //   }
  //   if (closePopupButton) {
  //     closePopupButton.click();
  //     await new Promise(resolve => { setTimeout(resolve, 5000); });
  //   }
  //   try {
  //     const selectButton = document.querySelector('div.sc-club-results div.sc-club-result.result-chevron a');
  //     selectButton.click();
  //   } catch (e) {
  //     console.log('Store id' + e);
  //   }
  //   if (closePopupButton) {
  //     closePopupButton.click();
  //     await new Promise(resolve => { setTimeout(resolve, 5000); });
  //   }
  //   const makeClub = document.querySelector('div.sc-club-summary-action button');
  //   if (makeClub) {
  //     makeClub.click();
  //   }
  //   if (closePopupButton) {
  //     closePopupButton.click();
  //     await new Promise(resolve => { setTimeout(resolve, 5000); });
  //   }
  //   await new Promise(resolve => { setTimeout(resolve, 15000); });
  //   if (closePopupButton) {
  //     closePopupButton.click();
  //     await new Promise(resolve => { setTimeout(resolve, 5000); });
  //   }
  // });
  await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  // await context.evaluate(async () => {
  //   const closePopupButton = document.querySelector('div.sc-block-modal button.sc-modal-close-button');
  //   if (closePopupButton) {
  //     closePopupButton.click();
  //     await new Promise(resolve => { setTimeout(resolve, 5000); });
  //   }
  // });
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'samsclub.com',
    store: 'samsclub',
    zipcode: '',
  },
  // implementation,
  implementation: async ({ url, RPC, SKU, zipcode, storeId, postcode }, { country, domain, timeout }, context, dependencies) => {
    await context.evaluate(async () => {
      const closePopupButton = document.querySelector('div.sc-block-modal button.sc-modal-close-button');
      if (closePopupButton) {
        // @ts-ignore
        closePopupButton.click();
      }
    });
    // console.log(`storeid${storeId}`);
    const storeChangeUrl = `https://www.samsclub.com/club/springfield-mo-sams-club/${storeId}`;
    await context.goto(storeChangeUrl, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
    // window.location.href = storeChangeUrl;
    await new Promise(resolve => { setTimeout(resolve, 30000); });
    await context.click('div.sc-club-summary-action button');
    await context.evaluate(async () => {
      const makeClub = document.querySelector('div.sc-club-summary-action button');
      if (makeClub) {
        // @ts-ignore
        makeClub.click();
        await new Promise(resolve => { setTimeout(resolve, 60000); });
      }
      const closePopupButton = document.querySelector('div.sc-block-modal button.sc-modal-close-button');
      if (closePopupButton) {
        // @ts-ignore
        closePopupButton.click();
      }
    });
    await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  },
};
