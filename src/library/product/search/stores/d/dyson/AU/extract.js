async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const allResults = [];

  await context.evaluate(async function () {
    function stall(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    function addHiddenDiv(el, id, text) {
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

    const getPageDOM = async (url, domParser) => {
      try {
        const response = await fetch(url);
        const text = await response.text;
        debugger
        return domParser.parseFromString(text, 'text/html');
      } catch (error) {
        console.log(error);
      }
    }

    const extractData = (dataArr) => {
      const domParser = new DOMParser();
      let count = 0;

      dataArr.forEach(async el => {
        if (count >= 150) {
          return;
        }
        if (el.querySelector('div[itemprop="name"]')) {
          el.classList.add('productInfo');
          const name = el.querySelector('h3').innerText;
          const thumbnail = el.querySelector('img').getAttribute('src');
          const url = el.querySelector('a').getAttribute('href');
          const detailPage = await getPageDOM(url, domParser);
          const id = detailPage.querySelector(`meta[itemprop = "productID sku"]`)
            && detailPage.querySelector(`meta[itemprop = "productID sku"]`).content
            || (detailPage.querySelector(`div[data-bv-show="inline_rating"]`)
              && detailPage.querySelector(`div[data-bv-show="inline_rating"]`).dataset.bvProductId);

          const splitURL = url.split('-');
          addHiddenDiv(el, 'name', name);
          addHiddenDiv(el, 'id', id);
          addHiddenDiv(el, 'thumbnail', thumbnail);
          addHiddenDiv(el, 'url', url);
          count++;
        }
      });
    }


    const cssInnerCardType = '.card__inner';
    const cssGWrap = '.g-wrap';
    let allProducts = document.querySelectorAll(cssInnerCardType);
    if (allProducts.length) {
    } else {
      allProducts = document.querySelectorAll(cssGWrap);
    }

    allProducts.length ? extractData(allProducts) : console.log(`No products found, css: ${cssInnerCardType} and ${cssGWrap} both returned 0 products`);
  });
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
