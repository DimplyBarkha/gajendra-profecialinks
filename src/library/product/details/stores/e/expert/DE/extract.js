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
    await context.evaluate(async function () {
      if (document.querySelector('.widget-Popup--container-outer---view-popup')) {
        document.querySelector('.widget-Popup--container-outer---view-popup').click();
      }
      if (document.querySelector('i.widget-Popup--close')) {
        document.querySelector('i.widget-Popup--close').click();
      }

      function addHiddenDiv (elementID, content) {
        const newDiv = document.createElement('div');
        newDiv.id = elementID;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv('iio_product_url', window.location.href);


      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      var refURL = window.location.href;

      // const url = "https://service.loadbee.com/ean/5025155028155/de_DE?css=default&template=default&button=default";

      // const response = await fetch(url, {
      //   accept: 'application/json, text/plain, */*',
      //   referrer: refURL,
      //   referrerPolicy: 'no-referrer-when-downgrade',
      //   body: null,
      //   method: 'GET',
      //   mode: 'no-cors',
      // });

      // console.log(response)

      const url = "https://service.loadbee.com/ean/5025155028155/de_DE?css=default&template=default&button=default";

      await fetch(url, {
        "headers": {
          // "accept": "*/*",
          // "accept-language": "en-US,en;q=0.9",
          // "sec-fetch-dest": "empty",
          // "sec-fetch-mode": "no-cors",
          'set-mode': 'cors',
          // "sec-fetch-site": "same-origin",
          // "x-requested-with": "XMLHttpRequest"
        },
        "referrer": refURL,
        // "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "no-cors"
      }).then(response => {
        console.log(response)
        return response.text()
      })
        .then(result => {
          console.log('result');
          console.log(result.length);
          console.log(result);
        })
        .catch(error => console.log('error', error));

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
          if(this.readyState === 4) {
            console.log(this.responseText);
          }
        });

        xhr.open("GET", "https://service.loadbee.com/ean/5025155028155/de_DE?css=default&template=default&button=default");

        xhr.send();
      // console.log(document.querySelector('div.loadbeeTabContent').querySelector('iframe').contentWindow.document);
    });

    return await context.extract(productDetails, { transform: transformParam });
  },
};
