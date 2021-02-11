const { transform } = require('../format');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const sizeOfDiv = await context.evaluate(function () {
    function addHiddenDiv (id, content, availability, itemNo, rpc, quantity) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.setAttribute('availability', availability);
      newDiv.setAttribute('itemNo', itemNo);
      newDiv.setAttribute('rpc', rpc);
      newDiv.setAttribute('quantity', quantity);
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let sku = document.URL.substring(document.URL.lastIndexOf('-'), document.URL.length);
    sku = sku.replace(/(-)(.+)(.html)/g, '$2');
    addHiddenDiv('skuDiv', sku);
    const brandName = document.querySelector('h2.product__brandname').innerText;
    const prodName = document.querySelector('h1.product__name').innerText;
    const serverData = document.querySelector('script#__serverData');
    const serverObj = JSON.parse(serverData.innerText.trim());
    const rpcArray = serverObj.simples;
    for (let i = 0; i < rpcArray.length; i++) {
      let prodFullName = brandName + ' ' + prodName;
      prodFullName += ' ' + rpcArray[i].size;
      const rpc = rpcArray[i].sku;
      if (rpcArray[i].quantity !== 0) addHiddenDiv('descDiv', prodFullName, 'In Stock', i, rpc);
      else addHiddenDiv('descDiv', prodFullName, 'Out Of Stock', i, rpc);
    }
    return rpcArray.length;
  });
  if (sizeOfDiv !== 0) {
    for (let i = 0; i < sizeOfDiv; i++) {
      await context.evaluate(function (i) {
        function addHiddenDiv (id, content, availability, rpc, quantity) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.setAttribute('availability', availability);
          newDiv.setAttribute('retailerProdCode', rpc);
          newDiv.setAttribute('quantity', quantity);
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const currentDiv = `div[itemNo="${i}"]`;
        const currentDivSelector = document.querySelector(currentDiv);
        const content = currentDivSelector.innerText;
        const availability = currentDivSelector.getAttribute('availability');
        const rpc = currentDivSelector.getAttribute('rpc');
        const quantity = content.split(' ').slice(-1);
        addHiddenDiv('currentDiv', content, availability, rpc, quantity);
        addHiddenDiv(`currentDiv_${i}`, content, availability, rpc, quantity);
      }, i);
      await context.extract(productDetails, { transform });
      await context.evaluate(function () {
        document.querySelector('div#currentDiv').remove();
      });
    }
  } else {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  }
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'namshi',
    transform,
    domain: 'namshi.com',
    zipcode: "''",
  },
  implementation,
};
