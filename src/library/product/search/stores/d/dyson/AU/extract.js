async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const { results } = inputs;

  const allResults = [];

  await context.evaluate(async function (results) {
    function stall (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    function addHiddenDiv (el, id, text) {
      const div = document.createElement('div');
      div.innerHTML = text;
      div.classList.add(id);
      el.appendChild(div);
    }

    let scrollTop = 0;
    while (scrollTop < 5000) {
      scrollTop += 500;
      window.scroll(0, 500);
      await stall(250);
    }

    const getPageDOM = async (url) => {
      const domParser = new DOMParser();
      try {
        const response = await fetch(url);
        const text = await response.text();
        return { dom: domParser.parseFromString(text, 'text/html'), text };
      } catch (error) {
        console.log(error);
      }
    };

    const notAValidId = (str) => {
      // id should only contains numbers and dashes
      // and be of 5 or more length
      return /[^\d-]/.test(str) || str.length <= 4;
    };

    const prepareData = async (dataArr) => {
      let count = 0;
      let itemIndex = 0;

      while (count < results) {
        const el = dataArr[itemIndex];
        itemIndex += 1;
        if (el.querySelector('div[itemprop="name"], h3')) {
          el.classList.add('productInfo');
          const name = el.querySelector('h3').innerText;
          const thumbnail = el.querySelector('img').getAttribute('src');
          const url = el.querySelector('a').getAttribute('href');
          const idFromUrl = url.split('-').slice(-2).join('-');
          let idFromDom;
          if (notAValidId(idFromUrl)) {
            const { dom: detailPage, text } = await getPageDOM(url);
            idFromDom = (detailPage.querySelector('meta[itemprop = "productID sku"]') &&
            detailPage.querySelector('meta[itemprop = "productID sku"]').content) ||
            (detailPage.querySelector('div[data-bv-show="inline_rating"]') &&
              detailPage.querySelector('div[data-bv-show="inline_rating"]').dataset.bvProductId);
            if (!idFromDom) {
              const reg = /data-bv-product-id=\\"([^"]*)\\"/;
              const match = reg.exec(text);
              idFromDom = match[1];
              if (!idFromDom || notAValidId(idFromDom)) continue; // does not populate if it failed to load the id
            }
          }
          const id = idFromDom || idFromUrl;
          addHiddenDiv(el, 'count', count);
          addHiddenDiv(el, 'name', name);
          addHiddenDiv(el, 'id', id);
          addHiddenDiv(el, 'thumbnail', thumbnail);
          addHiddenDiv(el, 'url', url);
          count++;
        } else {
          addHiddenDiv(el, 'notValid', 'NotValid');
        }
      }
    };

    const cssInnerCardType = '.card__inner';
    const cssGWrap = '.g-wrap';
    const allProducts = document.querySelectorAll(cssInnerCardType).length ? document.querySelectorAll(cssInnerCardType) : document.querySelectorAll(cssGWrap);
    if (allProducts.length) {
      await prepareData([...allProducts]);
    } else {
      console.log(`No products found, css: ${cssInnerCardType} and ${cssGWrap} both returned 0 products`);
    }
  }, results);
  const extract = await context.extract(productDetails, { transform });
  allResults.push(extract);
  return allResults;
}

const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'dyson',
    transform: transform,
    domain: 'dyson.com.au',
  },
  implementation,
};
