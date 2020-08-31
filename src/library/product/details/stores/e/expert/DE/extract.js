const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'expert',
    transform: transform,
    domain: 'expert.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    // await context.click('i.widget-Popup--close')
    // const s = await context.evaluate(async function (selector) {
    //   // const response = await fetch('https://service.loadbee.com/ean/5025155028155/de_DE?css=default&template=default&button=default', {
    //   //   headers: {
    //   //     accept: 'text/html,/',
    //   //     'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    //   //     'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    //   //     'x-requested-with': 'XMLHttpRequest',
    //   //   },
    //   //   method: 'GET',
    //   //   mode: 'cors',
    //   //   // credentials: 'include',
    //   // });
    //   // if (response.status !== 200) {
    //   //   throw new Error('Zipcode change failed');
    //   // } else {
    //   //   window.location.reload();
    //   // }
    //   return document.querySelector(selector).innerText;
    // }, 'h1.content');

    // console.log(s);
    // const iframe = await context.evaluate(async function (selector) {
    //   return document.querySelector(selector);
    // }, 'iframe#loadbeeTabContent');

    // console.log(iframe);

    // await context.evaluate(async function () {
    //   const response = await fetch('https://service.loadbee.com/ean/5025155028155/de_DE?css=default&template=default&button=default', {
    //     headers: {
    //       accept: 'text/html,/',
    //       'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    //       'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    //       'x-requested-with': 'XMLHttpRequest',
    //       'Access-Control-Allow-Origin': '*',
    //     },
    //     method: 'GET',
    //     mode: 'no-cors',
    //     // credentials: 'include',
    //   });
    //   console.log(response);
    //   // if (response.status !== 200) {
    //   //   throw new Error('Zipcode change failed');
    //   // } else {
    //   //   window.location.reload();
    //   // }
    // });

    let content = null;
    let elementID = null;
    let image = null;
    let element2ndID = null;

    async function addHiddenInfo (elementID, content) {
      await context.evaluate(async function (elementID, content) {
        const newDiv = document.createElement('div');
        newDiv.id = elementID;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }, elementID, content);
    }

    const link = await context.evaluate(async function () {
      return window.location.href;
    });

    await context.goto('https://service.loadbee.com/ean/5025155028155/de_DE?css=default&template=default&button=default');
    // The code snippet below will be executed in the website's scope.
    await context.evaluate(async function () {
      console.log('hiiii');
      console.log(document.querySelector('h1.next-chapter'));
    });
    const text = await context.evaluate(async function () {
      return document.querySelector('body').innerText;
    });
    elementID = 'manuf';
    content = text;
    const images = await context.evaluate(async function () {
      const images = document.querySelectorAll('body img');
      const imagesSrc = [];
      [...images].forEach((element) => {
        imagesSrc.push(element.getAttribute('src'));
      });
      return imagesSrc.join(' || ');
    });
    element2ndID = 'manufImg';
    image = images;
    await context.goto(link);
    addHiddenInfo(elementID, content);
    addHiddenInfo(element2ndID, image);
    // await context.waitForPage();

    // await context.evaluate(async function () {
    //   if (document.querySelector('.widget-Popup--container-outer---view-popup')) {
    //     document.querySelector('.widget-Popup--container-outer---view-popup').click();
    //   }
    //   if (document.querySelector('i.widget-Popup--close')) {
    //     document.querySelector('i.widget-Popup--close').click();
    //   }
    //   // console.log(document.querySelector('iframe#loadbeeTabContent').contentWindow.document);

    //   function addHiddenDiv (elementID, content) {
    //     const newDiv = document.createElement('div');
    //     newDiv.id = elementID;
    //     newDiv.textContent = content;
    //     newDiv.style.display = 'none';
    //     document.body.appendChild(newDiv);
    //   }
    //   addHiddenDiv('iio_product_url', window.location.href);

    //   var refURL = window.location.href;

    //   // const url = "https://service.loadbee.com/ean/5025155028155/de_DE?css=default&template=default&button=default";

    //   // const response = await fetch(url, {
    //   //   accept: 'application/json, text/plain, */*',
    //   //   referrer: refURL,
    //   //   referrerPolicy: 'no-referrer-when-downgrade',
    //   //   body: null,
    //   //   method: 'GET',
    //   //   mode: 'no-cors',
    //   // });

    //   // console.log(response)

    //   // const url = "https://service.loadbee.com/ean/5025155028155/de_DE?css=default&template=default&button=default";

    //   // await fetch(url, {
    //   //   "headers": {
    //   //     // "accept": "*/*",
    //   //     // "accept-language": "en-US,en;q=0.9",
    //   //     // "sec-fetch-dest": "empty",
    //   //     // "sec-fetch-mode": "no-cors",
    //   //     'set-mode': 'cors',
    //   //     // "sec-fetch-site": "same-origin",
    //   //     // "x-requested-with": "XMLHttpRequest"
    //   //   },
    //   //   "referrer": refURL,
    //   //   // "referrerPolicy": "no-referrer-when-downgrade",
    //   //   "body": null,
    //   //   "method": "GET",
    //   //   "mode": "no-cors"
    //   // }).then(response => {
    //   //   console.log(response)
    //   //   return response.text()
    //   // })
    //   //   .then(result => {
    //   //     console.log('result');
    //   //     console.log(result.length);
    //   //     console.log(result);
    //   //   })
    //   //   .catch(error => console.log('error', error));

    //   // console.log(document.querySelector('div.loadbeeTabContent').querySelector('iframe').contentWindow.document);
    // });

    return await context.extract(productDetails, { transform: transformParam });
  },
};
