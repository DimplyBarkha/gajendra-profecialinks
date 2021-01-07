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
    await new Promise((resolve) => setTimeout(resolve, 10000));
    try {
      const locationUrl = await context.evaluate(async () => {
        return window.location.href;
      });
      var iframeObj = await context.evaluate(async () => {
        const element = document.querySelector('div.loadbee-inpage div.loadbeeTabContent');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
       let apikey = document.querySelector('div.loadbee-inpage div.loadbeeTabContent') ? document.querySelector('div.loadbee-inpage div.loadbeeTabContent').getAttribute('data-loadbee-apikey') : null;
       let gtin = document.querySelector('div.loadbee-inpage div.loadbeeTabContent') ? document.querySelector('div.loadbee-inpage div.loadbeeTabContent').getAttribute('data-loadbee-gtin') : null;
       let iframeObj = {};
       iframeObj.apikey = apikey;
       iframeObj.gtin = gtin;
      return iframeObj;
      });
      if(iframeObj){
        console.log('iframeObj:---------------------------------- ', iframeObj);
        var iframeApiResUrl = await context.evaluate(async function (iframeObj1) {
          console.log('iframeObj1: ', iframeObj1);
         let apiKey = iframeObj1.apikey;
         console.log('apiKey: ', apiKey);
        let gtin = iframeObj1.gtin;
        console.log('gtin: ', gtin);
        async function getData (url = '') {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log('response.json:------------------------------- ', response.json);
          return response.json();
          
        };
        let url = `https://availability.loadbee.com/v3/EAN/${gtin}/de_CH?template=default&apiKey=${apiKey}`
        console.log('url: ', url);
        const iframeApiRes = await getData(url);
        console.log('iframeApiRes: ', iframeApiRes);
        let urlIframe = iframeApiRes ? iframeApiRes.url : null;
        console.log('urlIframe: ', urlIframe);
        return urlIframe;
      }, iframeObj);
      }
      // var iframe = await context.evaluate(async () => {
      //   const element = document.querySelector('div.loadbee-inpage div.loadbeeTabContent');
      //   if (element) {
      //     element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      //     await new Promise((resolve) => setTimeout(resolve, 10000));
      //   }
      //  let iframe = document.querySelector('div.loadbee-inpage div.loadbeeTabContent iframe') ? document.querySelector('div.loadbee-inpage div.loadbeeTabContent iframe').getAttribute('src') : null;
      //   return iframe;
      // });
     
      if (iframeApiResUrl) {
        console.log('iframe: ', iframeApiResUrl);
        await context.goto(iframeApiResUrl,{ timeout: 60000 });
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
          let desc3 = document.querySelector('div#mainWrapper') ? document.querySelector('div#mainWrapper') : '';
          if (desc3) {
            // @ts-ignore
            console.log('desc3: ', desc3.innerText);
            // @ts-ignore
            desc3 = desc3.innerHTML ? desc3.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
            descArr.push(desc3);
            console.log('descArr: ', descArr);
          }
          const desc = descArr.join(' | ').trim();
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
          const arrImgSel1 = document.querySelectorAll("div[class*='container-fluid main-container'] img[src]") ? Array.from(document.querySelectorAll("div[class*='container-fluid main-container'] img[src]")) : '';
          console.log('arrImgSel1: ', arrImgSel1);
          // @ts-ignore
          const img1 = arrImgSel1.map((imgSelector) => imgSelector && imgSelector.src ? imgSelector.src : '');
          console.log('img1: ', img1);
          const arrImgSel2 = document.querySelectorAll("div[id='mainWrapper'] img[src]") ? Array.from(document.querySelectorAll("div[id='mainWrapper'] img[src]")) : '';
          console.log('arrImgSel2: ', arrImgSel2);
          // @ts-ignore
          const img2 = arrImgSel2.map((imgSelector) => imgSelector && imgSelector.src ? imgSelector.src : '');
          console.log('img2: ', img2);
          let imgUrlArr = img2.concat(img1)
          let arr = imgUrlArr.join(' | ')
          return arr;
        });
        await context.goto(locationUrl, { timeout: 90000 });
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

