const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CZ',
    store: 'alza',
    transform,
    domain: 'alza.cz',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop <= 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(8000);
            break;
          }
        }
        function stall (ms) {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
      let rpc = await context.evaluate(() => {
        return window.location.href.split('=')[1];
      });
      rpc = rpc.split('&')[0];
      await context.waitForSelector(`div[data-code="${rpc}"] a`, { timeout: 40000 });
      let url = await context.evaluate((rpc) => {
        return (document.querySelector(`div[data-code="${rpc}"] a`).getAttribute('href'));
      }, rpc);
      url = 'https://www.alza.cz/' + url;
      const timeout = 50000;
      await context.goto(url, {
        firstRequestTimeout: 60000,
        timeout: timeout,
        waitUntil: 'load',
        checkBlocked: true,
        antiCaptchaOptions: {
          type: 'RECAPTCHA',
        },
      });
      try {
        await context.waitForSelector('.g-recaptcha');
        const maxRetries = 3;
        let isCaptcha = '';
        for (let i = 0; i < maxRetries; i++) {
          isCaptcha = await context.evaluate(() => {
            return Boolean(document.querySelector('.g-recaptcha'));
          });
          if (isCaptcha) {
            await context.waitForNavigation({ timeout });
            await context.solveCaptcha({
              type: 'RECAPTCHA',
              inputElement: '.captcha-handler',
              autoSubmit: true,
            });
            console.log('solved captcha, waiting for page change');
            await context.click('#form #button');
            await context.waitForNavigation({ timeout });
          }
        }
        if (isCaptcha) {
          const status = await context.evaluate(() => {
            return document.querySelector('.captcha-handler').getAttribute('captchastatus');
          });
          if (status === 'fail') {
            await context.evaluate(() => {
              window.location.reload();
            });
            await context.waitForNavigation({ timeout });
            await context.solveCaptcha({
              type: 'RECAPTCHA',
              inputElement: '.captcha-handler',
              autoSubmit: true,
            });
            console.log('solved captcha, waiting for page change');
            await context.click('#form #button');
            await context.waitForNavigation({ timeout });
          }
        }
      } catch (e) {
        console.log(e.message);
      }

      try {
        await context.evaluate(async function () {
          document.querySelector('.lazyDescription').scrollIntoView({ behavior: 'smooth' });
        });
        await context.waitForSelector('#celek img', { timeout: 60000 });
      } catch (e) {
        console.log(e.message);
      }
    } catch (e) {
      console.log('No such product exists');
    }

    await context.evaluate(async() => {
      console.log('Fetching and appending MPC to DOM');
      const itemEl = document.evaluate(`//div[@class='detail-page articleLab']/script[1]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      let itemID;

      if (itemEl.snapshotLength) {
        itemID = itemEl.snapshotItem(0).innerText;
        itemID = itemID.split('"itemID":"');
        itemID = itemID.length > 1 ? itemID[1].split('"')[0] : '';
        document.body.setAttribute('import-mpc', itemID);
      }

      const prodUrl = document.querySelector(`meta[property='og:url']`) ? document.querySelector(`meta[property='og:url']`).content : null;
      console.log('Fetched URL');
      if (prodUrl && itemID) {
        const request = await fetch("https://www.alza.cz/Services/EShopService.svc/GetCommodityDetailLegend", {
          "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "cs-CZ",
            "cache-control": "no-cache",
            "content-type": "application/json; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
          },
          "referrer": prodUrl,
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": `{\"code\":\"${itemID}\",\"id\":-1,\"showParentLegend\":false}`,
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        });
        
        if (request.status === 200) {
          console.log('Request success for fetching enhanced content');
          const descData = await request.json();
          console.log(JSON.stringify(descData));
          const newEl = document.createElement('import-enhanced');
          newEl.innerHTML = descData.d.Value;
          document.body.appendChild(newEl);
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
