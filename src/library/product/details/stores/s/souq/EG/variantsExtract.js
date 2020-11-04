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
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true , actionTimeout: 10000});
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
    function findJsonObj1 () {
      try {
       const xpath = `//script[contains(.,'"item_id":')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let jsonStr = element.textContent;
        jsonStr = jsonStr.trim();
        return jsonStr;
      } catch (error) {
        console.log(error.message);
      }
    }
   let JSONObj = await findJsonObj();
   console.log('JSONObj: ', JSONObj);
   let url = JSONObj ? JSONObj.url : '';
   console.log('url: ', url);
   addElementToDocument('bb_url',url);
   let defaultSize = document.querySelectorAll('div#defaultSize div.item-connection');
   console.log('defaultSize: ', defaultSize);
   let size_en = document.querySelectorAll('div#size_en div.item-connection');
   console.log('size_en: ', size_en);
   let colorsblock = document.querySelectorAll('div.colors-block span.has-tip');
   console.log('colorsblock: ', colorsblock);
   let colors_en = document.querySelectorAll('div#colors_en div.item-connection');
   console.log('colors_en: ', colors_en);
   let display_diagonal_en = document.querySelectorAll('div#display_diagonal_en div.item-connection');
   console.log('display_diagonal_en: ', display_diagonal_en);
   let promotionSlider = document.querySelectorAll('div#promotionSlider div.slick-track div.preSlickSlider');
   console.log('promotionSlider: ', promotionSlider);
   if((defaultSize.length == 0) && (size_en.length == 0) && (colorsblock.length == 0) &&(colors_en.length == 0) && (display_diagonal_en.length == 0) && (promotionSlider.length == 0)){
    // let bodyId = document.querySelector('body.product-page');
    let bodyId = document.querySelector('html');
    if(bodyId){
      bodyId.setAttribute("id", "customId");
      // let idJosn = await findJsonObj1();
      // let id = idJosn ? idJosn.replace(/\"item\_id\"\:(.*)\,\"offer\_id/g, '$1') : '';
      // addElementToDocument('pd_variantId', id);
      let JSONObj = await findJsonObj();
      console.log('JSONObj: ', JSONObj);
      let url = JSONObj ? JSONObj.url : '';
      console.log('url: ', url);
      addElementToDocument('pd_variantId',url);
    }
    
  }
    });
  return await context.extract(variants, { transform });
  }
