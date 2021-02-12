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
    function addHiddenDiv (id, productName, availability, itemNo, rpc, size) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.setAttribute('productName', productName);
      newDiv.setAttribute('availability', availability);
      newDiv.setAttribute('itemNo', itemNo);
      newDiv.setAttribute('rpc', rpc);
      newDiv.setAttribute('size', size);
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let sku = document.URL.substring(document.URL.lastIndexOf('-') + 1, document.URL.length);
    sku = sku.split('.html')[0];
    addHiddenDiv('skuDiv', sku);
    const brandName = document.querySelector('h2.product__brandname').innerText;
    const prodName = document.querySelector('h1.product__name').innerText;
    const serverData = document.querySelector('script#__serverData');
    const serverObj = JSON.parse(serverData.innerText.trim());
    const rpcArray = serverObj.simples;
    for (let i = 0; i < rpcArray.length; i++) {
      const productName = brandName + ' ' + prodName;
      const size = rpcArray[i].size;
      const rpc = rpcArray[i].sku;
      const availability = rpcArray[i].quantity !== 0 ? 'In Stock' : 'Out Of Stock';
      addHiddenDiv('descDiv', productName, availability, i, rpc, size);
    }
    return rpcArray.length;
  });
  if (sizeOfDiv !== 0) {
    for (let i = 0; i < sizeOfDiv; i++) {
      await context.evaluate(function (i) {
        function copyDiv (selectorToCopy, newId) {
          const newDiv = document.createElement('div');
          const oldDiv = document.querySelector(selectorToCopy);
          [...oldDiv.attributes].forEach(attr => newDiv.setAttribute(attr.nodeName, attr.nodeValue));
          newDiv.innerHTML = oldDiv.innerHTML;
          newDiv.id = newId;
          document.body.appendChild(newDiv);
        }
        copyDiv(`div[itemNo="${i}"]`, 'currentDiv');
        copyDiv(`div[itemNo="${i}"]`, `currentDiv_${i}`);
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
