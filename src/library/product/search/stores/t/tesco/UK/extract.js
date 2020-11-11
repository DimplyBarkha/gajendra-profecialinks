const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    transform,
    domain: 'tesco.com',
  },
  dependencies: {
    productDetails: 'extraction:product/search/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async ({ inputString }, { country, store, transform }, context, dependencies) => {
    const getAPIData = async function () {
      const page = window.location.href.match(/page=([^&]+)/) ? window.location.href.match(/page=([^&]+)/)[1] : 1;
      const query = decodeURI(window.location.href.match(/query=([^&]+)/) && window.location.href.match(/query=([^&]+)/)[1]);
      const body = {
        acceptWaitingRoom: true,
        resources: [{ type: 'search', params: { query: { page, query } } }],
      };
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
      console.log('this is our body');
      console.log(JSON.stringify(body));
      const csrf = document.querySelector('[data-csrf-token]').getAttribute('data-csrf-token');
      const response = await fetch('https://www.tesco.com/groceries/en-GB/resources', {
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrf,
        },
        body: JSON.stringify(body),
        method: 'POST',
        mode: 'cors',
      });
      const optionalWait = async (sel) => {
        try {
          await context.waitForSelector(sel, { timeout: 60000 });
        } catch (err) {
          console.log(`Couldn't load selector => ${sel}`);
        }
      };
      optionalWait('div[data-test-id="ProductName"]');
      const data = await response.json();
      return data;
    };
    try {
      const data = await context.evaluate(getAPIData);
      await context.evaluate((data) => {
        const imageArray = [];
        data.search.data.results.productItems.forEach(elm => {
          console.log('we have entered the foreach Function');
          // const id = elm.product.id;
          // console.log(`we are getting the id =>${id}`);
          // document.querySelector(`ul[class="product-list grid"] > li > div div[id*="tile"]`).setAttribute('thumbnail', elm.product.defaultImageUrl);
          imageArray.push(elm.product.defaultImageUrl);
        });
        const appendElement = document.querySelectorAll('ul[class="product-list grid"] > li > div div[id*="tile"]');
        [...appendElement].forEach(async (element, i) => {
          element.setAttribute('thumbnail', imageArray[i]);
        })
      }, data);
      return await context.extract(dependencies.productDetails, { transform });
    } catch (err) {
      console.log({ err });
      throw new Error('Error when calling API');
    }

  },
};