const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'EG',
    store: 'souq',
    transform,
    domain: 'egypt.souq.com',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;
  async function firstItemLink () {
    return await context.evaluate(function () {
      let firstItem = document.querySelector('a.itemLink.block.sPrimaryLink')
      // @ts-ignore
      firstItem = firstItem ? firstItem.href : '';
      return firstItem;
    });
  }
  const url = await firstItemLink();
  console.log('url: ', url);

  if ((url !== null) && (url !== '')) {
    await context.goto(url, { timeout: 100000, waitUntil: 'load', checkBlocked: true });
  }
  await context.waitForNavigation();
  await new Promise((resolve, reject) => setTimeout(resolve, 8000));
  //-------------------------
  await context.evaluate(async (parentInput) => {
  
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    function findJsonObj (scriptSelector) {
      try {
        const xpath = `//script[contains(.,'"@context":"http')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let jsonStr = element.textContent;
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);
      } catch (error) {
        console.log(error.message);
      }
    }
   let JSONObj = await findJsonObj();

    });
    return await context.extract(productDetails, { transform });
    }