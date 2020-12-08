const { transform } = require('../../../../shared');
const implementation = async function (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        await stall(1000);
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      function addHiddenDiv1(id, content, index) {
        // @ts-ignore
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('li[bindonce="product"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      };
      let description, brand;
      var abc = document.querySelectorAll('div[class="productImagesBox"]');
      // const arr = []
      for (let i = 0; i < abc.length; i++) {
        // @ts-ignore
        description = document.querySelectorAll('div[class="description"]')[i].innerText;
        // @ts-ignore
        brand = document.querySelectorAll('div[class="brandDetail"]')[i].innerText;
        addHiddenDiv1('name', description + ' ' + brand, i);
      }

    });
  };
  await applyScroll(context);

  // const getAllXpath = (xpath, prop) => {
  //   const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  //   const result = [];
  //   for (let index = 0; index < nodeSet.snapshotLength; index++) {
  //   const element = nodeSet.snapshotItem(index);
  //   if (element) result.push(prop ? element[prop] : element.nodeValue);
  //   }
  //   return result;
  //   };

  return await context.extract(productDetails, { transform });
};
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'mat',
    transform: transform,
    domain: 'mat.se',
    zipcode: '',
  },
  implementation,
};
