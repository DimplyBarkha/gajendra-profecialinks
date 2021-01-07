const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    transform,
    domain: 'allegro.pl',
    zipcode: '',
  },
  implementation: async (inputs, { country, domain, transform: transformParam }, context, { productDetails }) => {
    console.log(inputs.id + ' is input url');
    if (inputs.url && inputs.url.includes('null')) {
      const newurl = `https://allegro.pl/listing?string=${inputs.id}`;
      await context.goto(newurl, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    }
    const isProdPage = await context.evaluate(async function () {
      let prodPage = true;
      if (document.querySelector('div[data-box-name="items-v3"] div.opbox-listing')) {
        if (document.querySelector('div[data-box-name="items-v3"] div.opbox-listing').innerText.includes('Czy na pewno szukasz')) {
          prodPage = false;
        }
      }
      return prodPage;
    });
    if (isProdPage === true) {
      const applyScroll = async function (context) {
        await context.evaluate(async function () {
          function addHiddenDiv (id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }
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
          // if(document.URL.includes('archiwum.allegro'))
          function stall (ms) {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, ms);
            });
          }
          addHiddenDiv('prodUrl', document.URL);
        });
      };
      await applyScroll(context);
    }
    const stopExtraction = await context.evaluate(async function () {
      if (document.querySelector('div.opbox-listing p')) {
      // @ts-ignore
        if (document.querySelector('div.opbox-listing p').innerText.includes('Czy na pewno szukasz')) {
          return true;
        }
      }
      return false;
    });
    if (stopExtraction !== true) {
      return await context.extract(productDetails, { transform: transformParam });
    } else {
      throw new Error('Not a product page');
    }
  },
};
