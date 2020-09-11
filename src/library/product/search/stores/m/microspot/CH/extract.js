const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
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
        const image = productInfo[code].customImageData ? productInfo[code].customImageData[0].sizes.pop() : '';
        image && addEleToDoc('pd_image', `https://www.microspot.ch/${image.url}`, `${item}`);
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
