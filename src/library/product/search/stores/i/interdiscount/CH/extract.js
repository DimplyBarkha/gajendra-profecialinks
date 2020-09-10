const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.evaluate(async function () {
    // @ts-ignore
    const productInfo = window.__INITIAL_STATE__.products;
    function addEleToDoc (key, value, code) {
      const productCode = new RegExp(`--p${code}`, 'g');
      const productsDiv = document.querySelectorAll('div._3oe9VX');
      const productDiv = Array.from(productsDiv, ele => ele.innerHTML);
      console.log('proddiv', productDiv);
      const filteredDiv = productDiv.filter(element => element.match(productCode));
      console.log('filter', filteredDiv);
      const prodEle = document.createElement('div');
      prodEle.id = key;
      prodEle.textContent = value;
      if (filteredDiv && filteredDiv.length) {
        const doc = new DOMParser().parseFromString(filteredDiv[0], 'text/xml');
        if (!doc.getElementById('rating')) {
          // @ts-ignore
          const href = doc.querySelector('a.Q_opE0').getAttribute('href');
          if (href) {
            document.querySelector(`a[href='${href}']`).appendChild(prodEle);
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
        if (item) {
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
    store: 'interdiscount',
    transform,
    domain: 'interdiscount.ch',
    zipcode: '',
  },
  implementation,
};
