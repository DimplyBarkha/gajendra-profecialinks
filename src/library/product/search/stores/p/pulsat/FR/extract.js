const { transform } = require('./transform');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    function addHiddenDivInProduct (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("article[class='row product-list']")[index];
      originalDiv.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv('added-searchurl', url);
    const priceEle = document.querySelectorAll("div[class*='product-list-col'] article meta[itemprop='price']");
    const priceArray = [];
    for (let i = 0; i < priceEle.length; i++) {
      const priceItem = priceEle[i].getAttribute('content');
      addHiddenDivInProduct('ii_price', priceItem, i);
      console.log(priceItem);
      priceArray.push(priceItem, priceItem, i);
    }
    console.log(priceArray);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'pulsat',
    transform,
    domain: 'pulsat.fr',
    zipcode: '',
  },
  implementation,
};
