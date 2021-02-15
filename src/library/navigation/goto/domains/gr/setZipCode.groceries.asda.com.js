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
  console.log(`mamatha storeId${inputs.storeID}`);
  console.log(`mamatha postcode${inputs.zipcode}`);
  const url = newUrl;
  //const url = `${newUrl}#[!opt!]{"cookie_jar":[{"name":"STORE_ID","value":${inputs.storeID}]}[/!opt!]`;
  console.log('MAmatha1' + url);
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
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
  await context.setInputValue('input[data-auto-id="textFieldPostcode"]', `${inputs.zipcode}`);
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

  const storeid = inputs.storeID;
  console.log(storeid)
  const isStore = async () => {
    return await context.evaluate(async (storeid) => {
      return !document.querySelector(`input[value="${storeid}"]`);
    }, storeid);
  };

  if (await isStore()) {
    await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  } else {
    try { await context.waitForXPath(`//*[@id="${inputs.storeID}"]`, { timeout: 10000 }); } catch (error) { console.log('Sorry selected store id not present'); };
    try { await context.click(`input[value="${inputs.storeID}"]`, { timeout: 10000 }); } catch (error) { console.log('Sorry selected store id not present'); };
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    const retailerName = await context.evaluate(function () {
      const temp = document.querySelector("div.collection-point__container strong");
      if (temp) {
        return temp.textContent;
      }
    });

    // await context.waitForSelector('button[data-auto-id="cncAvailableSlot"]');
    // await context.click('button[data-auto-id="cncAvailableSlot"]');
    // await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    // await context.waitForSelector('button[data-auto-id="btnChangeSlot"]');
    // await context.click('button[data-auto-id="btnChangeSlot"]');
    // await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
    async function addHtml(html, id) {
      const div = document.createElement('div');
      div.setAttribute('id', id);
      div.innerHTML = html;
      document.body.append(div);
    };
    await context.evaluate(addHtml, retailerName, 'retailername');
  }
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
