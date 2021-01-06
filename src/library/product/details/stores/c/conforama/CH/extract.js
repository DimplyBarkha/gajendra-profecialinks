const { transform } = require('../shared');

async function implementation(
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

  await context.evaluate(async (parentInput) => {
    let descriptionTab = document.querySelector('h2[id="description"]');
    // @ts-ignore
    descriptionTab = descriptionTab ? descriptionTab.click() : '';
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    let description = document.querySelector("div[id='tabs-1']");
    // @ts-ignore
    description = description ? description.innerHTML : '';
    const descArr = [];
    // @ts-ignore
    if (description !== '') {
      // @ts-ignore
      description = description ? description.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/\n/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').replace('Description du produit', '').replace(/La marque vous parle/g, '').trim() : '';
    }
    addElementToDocument('description', description);
    function findJsonData(scriptSelector, startString, endString) {
      const xpath = `//script[contains(.,'${scriptSelector}')]`;
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // @ts-ignore
      const elementTxt = (element !== null) ? element.textContent : '';
      return elementTxt;
    };
    let brandJson = findJsonData('"brand": {', '{ "@context":', '}');
    // @ts-ignore
    brandJson = brandJson ? JSON.parse(brandJson).brand : '';
    // @ts-ignore
    const brandText = brandJson ? brandJson.name : '';
    addElementToDocument('brandText', brandText);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'conforama',
    transform,
    domain: 'conforama.ch',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    try {
      const locationUrl = await context.evaluate(async () => {
        return window.location.href;
      });
      var iframe = await context.evaluate(async () => {
        const element = document.querySelector('div.loadbee-inpage div.loadbeeTabContent');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
        iframe = document.querySelector('div.loadbee-inpage div.loadbeeTabContent iframe') ? document.querySelector('div.loadbee-inpage div.loadbeeTabContent iframe').getAttribute('src') : null;
        // iframe = iframe && 'https:' + iframe;
        return iframe;
      });
      if (iframe) {
        console.log('iframe: ', iframe);
        await context.goto(iframe);
        await new Promise((resolve) => setTimeout(resolve, 10000));
        const manufactDes = await context.evaluate(async () => {
          let descArr = [];
          let desc1 = document.querySelector("div.lb-introtext") ? document.querySelector("div.lb-introtext") : '';
          if (desc1) {
            console.log('desc1: ', desc1);
            // @ts-ignore
            desc1 = desc1.innerHTML ? desc1.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
            descArr.push(desc1);
          }
          let desc2 = document.querySelector("div.panel.descriptions.productdescriptionComplete") ? document.querySelector("div.panel.descriptions.productdescriptionComplete") : '';
          if (desc2) {
            console.log('desc2: ', desc2);
            // @ts-ignore
            desc2 = desc2.innerHTML ? desc2.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
            descArr.push(desc2);
            console.log('descArr: ', descArr);
          }
          const desc = descArr.join(' | ');
          // @ts-ignore
          console.log('desc: ', desc);
          const iframeFooter = document.querySelector('div.panel');
          if (iframeFooter) {
            iframeFooter.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            await new Promise((resolve) => setTimeout(resolve, 10000));
          }
          if (desc) {
            // @ts-ignore
            return desc;
          }
        });
        const manufactImg = await context.evaluate(() => {
          const arrImgSel = document.querySelectorAll("div[class*='container-fluid main-container'] img[src]") ? Array.from(document.querySelectorAll("div[class*='container-fluid main-container'] img[src]")) : '';
          // @ts-ignore
          const img = arrImgSel.map((imgSelector) => imgSelector && imgSelector.src ? imgSelector.src : '');
          const imgURL = img.join(' | ');
          return imgURL;
        });
        await context.goto(locationUrl, { timeout: 60000 });
        await context.evaluate((manufactDes, manufactImg) => {
          addHiddenDiv('ii_manu', manufactDes);
          addHiddenDiv('ii_img', manufactImg);
          function addHiddenDiv(id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }
        // }, manufactDes);
        }, manufactDes, manufactImg);
        return await context.extract(productDetails, { transform }, { type: 'APPEND' });
      }
    } catch (e) {
      console.log(e);
    }
    return await context.extract(productDetails, { transform });
  },
};

