const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.evaluate(async function () {
    let scrollSelector = document.querySelector('#container-productlist > div:last-child');
    // @ts-ignore
    let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
    let yPos = 0;
    while (scrollLimit && yPos < scrollLimit) {
      yPos = yPos + 350;
      window.scrollTo(0, yPos);
      scrollSelector = document.querySelector('#container-productlist > div:last-child');
      // @ts-ignore
      scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      await new Promise(resolve => setTimeout(resolve, 3500));
    }
  });
  try {
    await context.waitForSelector('#container-productlist > div:last-child img');
  } catch (error) {
    console.log('img content not loaded');
  }
  await context.evaluate(async function () {
    // @ts-ignore
    const productInfo = JSON.parse(document.querySelector('script#INITIAL_STATE').innerText.trim()).products;
    function addEleToDoc (key, value, code) {
      const productCode = new RegExp(code);
      const productsDiv = document.querySelectorAll('div.wQ1zdx._14LFJJ._1ryioq');
      const productDiv = Array.from(productsDiv, ele => ele.innerHTML);
      const filteredDiv = productDiv.filter(element => element.match(productCode));
      const prodEle = document.createElement('div');
      prodEle.id = key;
      prodEle.textContent = value;
      if (filteredDiv && filteredDiv.length) {
        const doc = new DOMParser().parseFromString(filteredDiv[0], 'text/xml');
        if (!doc.getElementById('rating')) {
          const id = doc.querySelector('._2FaHUU').id;
          if (id) {
            document.getElementById(id).appendChild(prodEle);
          }
        }
      }
    }
    if (productInfo) {
      const info = Object.keys(productInfo);
      for (var i = 0; i < info.length; i++) {
        var code = info[i];
        var item = productInfo[code].code;
        var aggregateRating = productInfo[code].averageRating;
        if (item && aggregateRating !== 0) {
          addEleToDoc('rating', `${aggregateRating}`, `${item}`);
        }
      }
    }
  });
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'microspot',
    transform,
    domain: 'microspot.ch',
    zipcode: '',
  },
  implementation,
};
