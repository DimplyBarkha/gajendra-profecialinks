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
      // function addElementToDocument(key, value) {
      //   const catElement = document.createElement('div');
      //   catElement.id = key;
      //   catElement.textContent = value;
      //   catElement.style.display = 'none';
      //   document.body.appendChild(catElement);
      //   }
      // const getXpath = (xpath, prop) => {
      //   const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      //   let result;
      //   if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      //   else result = elem ? elem.singleNodeValue : '';
      //   return result && result.trim ? result.trim() : result;
      // };
      // try {
      //   // @ts-ignore
      //   document.querySelector('a[class="product-card_c-product-card__link__3NDUX"]').click()
      //   await new Promise(r => setTimeout(r, 6000));
      //   var image = getXpath("//div[@id='store-stock-app']/@data-product-code", 'nodeValue');
      //   addElementToDocument('id', image);
      
      //   } catch (error) {
      //   }
    });
  };
  await applyScroll(context);
  return await context.extract(productDetails, { transform });
};
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    transform: transform,
    domain: 'johnlewis.com',
  },
  implementation,
};