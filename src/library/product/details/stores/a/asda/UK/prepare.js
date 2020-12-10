// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   function stall (ms) {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve();
//       }, ms);
//     });
//   }

//   await context.evaluate(async function (inputs) {
//     const tempUrl = document.querySelector('div.search-page-content__products-tab-content ul li a[data-auto-id="linkProductTitle"]');
//     if (tempUrl) {
//       var newUrl = `https://groceries.asda.com${tempUrl.getAttribute('href')}`;
//       console.log('MAmatha' + newUrl);
//     }
//   }, inputs);
//   var url = newUrl || inputs.url;
//   console.log('MAmatha1' + url);

//   await context.click('a[data-auto-id="btnSign"]');
//   await context.setInputValue('div[class="input-box"] input.email-phone-input', 'randomstring@randomstring.com');
//   await stall(60000);
//   await context.setInputValue('div[class="input-box"] input#password', 'Change123');
//   await stall(60000);
//   await context.click('button[type="submit"]');
//   await stall(60000);

//   await context.evaluate(async function () {
//     if (document.querySelector('div.g-recaptcha')) {
//       await context.solveCaptcha({
//         type: 'RECAPTCHA',
//         inputElement: 'div.g-recaptcha',
//         autoSubmit: true,
//       });
//       console.log('solved captcha, waiting for page change');
//       console.log('Captcha vanished');
//     }
//   });

//   await context.click('a[data-auto-id="linkChangeSlot"]');
//   await stall(60000);
//   await context.click('button[data-auto-id="linkChange"]');
//   await stall(60000);
//   await context.setInputValue('input[data-auto-id="textFieldPostcode"]', inputs.postcode);
//   await stall(60000);
//   await context.click('button[data-auto-id="btnCheckPostCode"]');
//   await stall(60000);
//   await context.click(`input[id='${inputs.storeId}']`);
//   await stall(60000);
//   await context.click('button[data-auto-id="cncAvailableSlot"]');
//   await stall(60000);
//   await context.click('button[data-auto-id="btnChangeSlot"]');
//   await stall(60000);

//   // await context.evaluate(async function (inputs) {
//   //   // const url = `${inputs.url}`;
//   //   // await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
//   //   function stall (ms) {
//   //     return new Promise(resolve => {
//   //       setTimeout(() => {
//   //         resolve();
//   //       }, ms);
//   //     });
//   //   }
//   //   // signin using the below code
//   //   const isSignSelector = document.querySelector('a[data-auto-id="btnSign"]');
//   //   if (isSignSelector) {
//   //     isSignSelector.click();
//   //     document.querySelector('div[class="input-box"] input.email-phone-input').value = 'randomstring@randomstring.com';
//   //     await stall(100);
//   //     document.querySelector('div[class="input-box"] input#password').value = 'Change123';
//   //     await stall(100);
//   //     document.querySelector('button[type="submit"]').click();
//   //     await stall(5000);
//   //   }
//   //   // Change the slot
//   //   const isChangeSlot = document.querySelector('a[data-auto-id="linkChangeSlot"]');
//   //   if (isChangeSlot) {
//   //     isChangeSlot.click();
//   //     await stall(5000);
//   //   }

//   //   const isChange = document.querySelector('button[data-auto-id="linkChange"]');
//   //   if (isChange) {
//   //     isChange.click();
//   //     document.querySelector('input[data-auto-id="textFieldPostcode"]').value = inputs.postcode;
//   //     await stall(5000);
//   //     document.querySelector('button[data-auto-id="btnCheckPostCode"]').click();
//   //     await stall(5000);
//   //     document.querySelector(`input[id='${inputs.storeId}']`).click();
//   //     await stall(5000);
//   //     document.querySelector('button[data-auto-id="cncAvailableSlot"]').click();
//   //     await stall(5000);
//   //     document.querySelector('button[data-auto-id="btnChangeSlot"]').click();
//   //   }
//   // }, inputs);
//   await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
// }

module.exports = {
  implements: 'product/details/geo/prepare',
  parameterValues: {
    country: 'UK',
    domain: 'groceries.asda.com',
    store: 'asda',
    zipcode: '',
  },
  implementation: async ({ URL, RPC, SKU, zipcode, storeId, postcode }, { country, domain, timeout }, context, dependencies) => {
    await context.evaluate(async function () {
      if (document.querySelector('We cant find any results for "Product Code", sorry about that.')) {
        throw Error('');
      }
    });
    await context.waitForSelector('div.search-page-content__products-tab-content ul li a[data-auto-id="linkProductTitle"]');
    const newUrl = await context.evaluate(function () {
      const tempUrl = document.querySelector('div.search-page-content__products-tab-content ul li a[data-auto-id="linkProductTitle"]');
      if (tempUrl) {
        return `https://groceries.asda.com${tempUrl.getAttribute('href')}`;
      }
    });
    console.log(`mamatha storeId${storeId}`);
    console.log(`mamatha postcode${zipcode}`);
    const url = newUrl;
    console.log('MAmatha1' + url);
    await context.waitForSelector('a[data-auto-id="btnSign"]');
    await context.click('a[data-auto-id="btnSign"]');
    await context.setInputValue('div[class="input-box"] input.email-phone-input', 'randomstring@randomstring.com');
    await context.waitForSelector('div[class="input-box"] input#password');
    await context.setInputValue('div[class="input-box"] input#password', 'Change123');
    await context.waitForSelector('button[type="submit"]');
    await context.click('button[type="submit"]');
    // await context.waitForSelector('');
    await context.evaluate(async function () {
      if (document.querySelector('div.g-recaptcha iframe')) {
        await context.solveCaptcha({
          type: 'RECAPTCHA',
          inputElement: 'div.g-recaptcha',
          autoSubmit: true,
        });
        console.log('solved captcha, waiting for page change');
        console.log('Captcha vanished');
      }
    });
    // await context.evaluate(async function () {
    //   if (document.querySelector('div.mini-trolley__slot-expiry-messge')) {
    //     throw Error('Sorry your slot has expired.');
    //   }
    // });
    await context.waitForSelector('a[data-auto-id="linkChangeSlot"]');
    await context.click('a[data-auto-id="linkChangeSlot"]');
    await context.waitForSelector('button[data-auto-id="linkChange"]');
    await context.click('button[data-auto-id="linkChange"]');
    await context.waitForSelector('input[data-auto-id="textFieldPostcode"]');
    await context.setInputValue('input[data-auto-id="textFieldPostcode"]', `${zipcode}`);
    await context.waitForSelector('button[data-auto-id="btnCheckPostCode"]');
    await context.click('button[data-auto-id="btnCheckPostCode"]');
    await context.waitForSelector(`input[id='${storeId}']`);
    await context.click(`input[id='${storeId}']`);
    await context.waitForSelector('button[data-auto-id="cncAvailableSlot"]');
    await context.click('button[data-auto-id="cncAvailableSlot"]');
    await context.waitForSelector('button[data-auto-id="btnChangeSlot"]');
    await context.click('button[data-auto-id="btnChangeSlot"]');
    await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  },
};
