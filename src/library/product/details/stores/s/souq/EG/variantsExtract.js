const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
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
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  let list = await context.evaluate(() => !document.querySelector('div[class="tpl-results"]'))
  if (!list) {
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
}
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
       const xpath = `//script[contains(.,'"url":')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let jsonStr = element.textContent;
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);
      } catch (error) {
        console.log(error.message);
      }
    }
   let JSONObj = await findJsonObj();
   console.log('JSONObj: ', JSONObj);
   let url = JSONObj ? JSONObj.url : '';
   console.log('url: ', url);
   addElementToDocument('bb_url',url);
    });
  return await context.extract(variants, { transform });
  }
