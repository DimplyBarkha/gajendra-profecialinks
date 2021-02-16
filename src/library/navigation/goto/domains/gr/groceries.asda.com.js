
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'groceries.asda.com',
    country: 'UK',
    store: 'asda',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;

    const url = `https://storelocator.asda.com/?cmpid=ahc-_-otc-storeloc-_-asdacom-_-hp-_-header-_-store`;
    const zipcode = inputs.zipcode;
    const storeId = inputs.storeID;
    await context.goto(url, { timeout: 30000, waitUntil: 'load', checkBlocked: true, antiCaptchaOptions: { type: 'RECAPTCHA' } });
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    // await context.click('div.top-nav li:nth-child(2) a');
    await context.setInputValue('input[class="search-input Locator-input js-locator-input"]', `${inputs.zipcode}`);
    await context.waitForSelector('button[type="submit"]');
    await context.click('button[type="submit"] img');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    const storeid = inputs.storeID;
    console.log(storeid)
    const storeName = await context.evaluate(async (storeid) => {
        //return !document.querySelector(`input[value="${storeid}"]`);
        const query = `#js-yl-${storeid} span.LocationName`;
        if(query) {
          return document.querySelector(query) ? document.querySelector(query).textContent : '';
        }
      }, storeid);
    console.log(storeName);
    const url2 = `https://groceries.asda.com/search/${inputs.URL}`;
    await context.goto(url2, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
    await new Promise((resolve, reject) => setTimeout(resolve, 20000));
    await context.evaluate(async function () {
      if (!document.querySelector('div.co-product')) {
        throw Error('We cant find any product for input provided');
      }
    });
    await context.waitForSelector('div.search-page-content__products-tab-content ul li a[data-auto-id="linkProductTitle"]');
    const newUrl = await context.evaluate(function () {
      const tempUrl = document.querySelector('div.search-page-content__products-tab-content ul li a[data-auto-id="linkProductTitle"]');
      if (tempUrl) {
        return `https://groceries.asda.com${tempUrl.getAttribute('href')}`;
      }
    });
    console.log(`storeId${inputs.storeID}`);
    console.log(`postcode${inputs.zipcode}`);
    //const url = newUrl;
    console.log('MAmatha1' + url);
    await context.goto(newUrl, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
    async function addHtml(html, id) {
      const div = document.createElement('div');
      div.setAttribute('id', id);
      div.innerHTML = html;
      document.body.append(div);
    };
    await context.evaluate(addHtml, storeName, 'retailername');
    console.log(zipcode);
    // if (zipcode || storeId) {
    //   await dependencies.setZipCode(inputs);
    // }
  }
};
