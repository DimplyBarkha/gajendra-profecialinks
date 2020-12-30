const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));

  const invalidUrl = await context.evaluate(() => {
    return (window.location.href.indexOf('https://www.amicafarmacia.com/search?query=') < 0);
  });

  if (invalidUrl) {
    console.log('Invalid URL');
    return [];
  }

  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    addHiddenDiv('ii_searchUrl', window.location.href);

    const images = document.querySelectorAll('img[class="product-image-photo"]');
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i].getAttribute('src');
        const pattern = /\/([0-9]+)_[0-9]+./;
        const results = imageUrl.match(pattern);
        if (results && results.length > 0) {
          images[i].setAttribute('ii_sku', results[1]);
        } else {
          const refURL = window.location.href;
          const productLink = images[i].parentNode.parentElement;
          const fetchURL = productLink.getAttribute('href');
          console.log('fetchURL: ', fetchURL);

          const response = await fetch(fetchURL, {
            headers: {
              accept: '*/*',
              'accept-language': 'it',
              'sec-fetch-dest': 'document',
              'sec-fetch-mode': 'no-cors',
              'sec-fetch-site': 'cross-site',
            },
            referrer: refURL,
            referrerPolicy: 'no-referrer-when-downgrade',
            body: null,
            method: 'GET',
            mode: 'cors',
          });

          if (response && response.status === 400) {
            throw new Error('Error when calling API');
          }

          if (response && response.status === 404) {
            console.log('Product Not Found!!!!');
          }

          if (response && response.status === 200) {
            console.log('Product Found!!!!');
            const data = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const skuDiv = doc.querySelector('div[itemprop="sku"]');
            if (skuDiv) {
              images[i].setAttribute('ii_sku', skuDiv.textContent);
            }
          }
        }
      }
    }
  });

  await applyScroll(context);
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'amicafarmacia',
    transform,
    domain: 'amicafarmacia.com',
    zipcode: "''",
  },
  implementation,
};
