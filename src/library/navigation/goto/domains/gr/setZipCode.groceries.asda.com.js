async function implementation(inputs, { country, domain, timeout }, context, dependencies) {

  const url2 = `https://groceries.asda.com/search/${inputs.URL}`;
  await context.goto(url2, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  await context.evaluate(async function () {
    if (document.querySelector('div.no-result')) {
      throw Error('We cant find any results for "Product Code", sorry about that.');
    }
  });
  await context.waitForSelector('div.search-page-content__products-tab-content ul li a[data-auto-id="linkProductTitle"]');
  const newUrl = await context.evaluate(function () {
    const tempUrl = document.querySelector('div.search-page-content__products-tab-content ul li a[data-auto-id="linkProductTitle"]');
    if (tempUrl) {
      return `https://groceries.asda.com${tempUrl.getAttribute('href')}`;
    }
  });
  console.log(`mamatha storeId${inputs.StoreID}`);
  console.log(`mamatha postcode${inputs.Postcode}`);
  const url = newUrl;
  //const url = `${newUrl}#[!opt!]{"cookie_jar":[{"name":"STORE_ID","value":${inputs.StoreID}]}[/!opt!]`;
  console.log('MAmatha1' + url);
  // await context.waitForSelector('a[data-auto-id="btnSign"]');
  // await context.click('a[data-auto-id="btnSign"]');
  // await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  // await context.setInputValue('div[class="input-box"] input.email-phone-input', 'randomstring@randomstring.com');
  // //await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  // await context.waitForSelector('div[class="input-box"] input#password');
  // await context.setInputValue('div[class="input-box"] input#password', 'Change123');
  // //await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  // await context.waitForSelector('button[type="submit"]');
  // await context.click('button[type="submit"]');
  // // await context.waitForSelector('');
  // await context.evaluate(async function () {
  //   if (document.querySelector('#px-captcha > div.g-recaptcha')) {
  //     await context.solveCaptcha({
  //       type: 'RECAPTCHA',
  //       inputElement: '#px-captcha > div.g-recaptcha',
  //       autoSubmit: true,
  //     });
  //     console.log('solved captcha, waiting for page change');
  //     console.log('Captcha vanished');
  //   } else {
  //     console.log("Captcha not found");
  //   }
  // });
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  // await context.evaluate(async function () {
  //   if (document.querySelector('div.mini-trolley__slot-expiry-messge')) {
  //     document.querySelector('button[data-auto-id=btnBookSlot]').click();
  //   } else {
  //     //await context.waitForSelector('a[data-auto-id="linkChangeSlot"]');
  //     document.querySelector('a[data-auto-id="linkChangeSlot"]').click();
  //   }
  // });
  const url1 = `https://groceries.asda.com/checkout/book-slot/collect?origin=/search/${inputs.URL}`;
  await context.goto(url1, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  await new Promise((resolve, reject) => setTimeout(resolve, 20000));
  await context.evaluate(async function () {
    if (document.querySelector('button[data-auto-id=btnContinue]')) {
      document.querySelector('button[data-auto-id=btnContinue]').click();
    }
  });
  await context.waitForSelector('button[data-auto-id="linkChange"]');
  await context.click('button[data-auto-id="linkChange"]');
  await new Promise((resolve, reject) => setTimeout(resolve, 20000));
  await context.waitForSelector('input[data-auto-id="textFieldPostcode"]');
  await context.setInputValue('input[data-auto-id="textFieldPostcode"]', `${inputs.Postcode}`);
  await context.waitForSelector('button[data-auto-id="btnCheckPostCode"]');
  await context.click('button[data-auto-id="btnCheckPostCode"]');
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  // await context.evaluate(async function () {
  //   if (!document.querySelector(`input[value="${storeId}"]`)) {
  //     console.log(storeId);
  //     throw Error('Sorry selected store id not present');
  //   }
  // });
  //await context.waitForXPath(`//*[@id="${storeId}"]`);
  try { await context.waitForXPath(`//*[@id="${inputs.StoreID}"]`, { timeout: 10000 }); } catch (error) { console.log('Sorry selected store id not present'); }
  //document.querySelector("#\\34 220")
  //await context.waitForSelector(`input[id='${storeId}']`);
  await context.click(`input[value="${inputs.StoreID}"]`);
  // await context.waitForSelector('button[data-auto-id="cncAvailableSlot"]');
  // await context.click('button[data-auto-id="cncAvailableSlot"]');
  // await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  // await context.waitForSelector('button[data-auto-id="btnChangeSlot"]');
  // await context.click('button[data-auto-id="btnChangeSlot"]');
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'UK',
    domain: 'groceries.asda.com',
    store: 'asda',
    zipcode: '',
  },
  implementation,
};
