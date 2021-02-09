
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'fressnapf',
    transform: null,
    domain: 'fressnapf.de',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv2 (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('body[class="nuxt-ready"]>script:first-of-type')[0];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    // const getAllXpath = (xpath, prop) => {
    //   const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //   const result = [];
    //   for (let index = 0; index < nodeSet.snapshotLength; index++) {
    //     const element = nodeSet.snapshotItem(index);
    //     if (element) result.push(prop ? element[prop] : element.nodeValue);
    //   }
    //   return result;
    // };
    // var getXpath = (xpath, prop) => {
    //   var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
    //   let result;
    //   if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
    //   else result = elem ? elem.singleNodeValue : '';
    //   return result && result.trim ? result.trim() : result;
    // };

    // Variant URL
    // @ts-ignore
    var length1 = window.__NUXT__.data[0].product.baseOptions[0].options.length;
    var variant1 = '';
    for (var j = 0; j < length1; j++) {
      // @ts-ignore
      variant1 = 'https://www.fressnapf.de' + window.__NUXT__.data[0].product.baseOptions[0].options[j].url;
      addHiddenDiv2('variant1', variant1, 0);
    }
  });
  return await context.extract(variants, { transform });
}
