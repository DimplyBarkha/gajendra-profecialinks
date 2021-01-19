const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'Conforama_fr',
    transform: cleanUp,
    domain: 'conforama.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
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
      if (iframeObj) {
        console.log('iframeObj:---------------------------------- ', iframeObj);
        var iframeApiResUrl = await context.evaluate(async function (iframeObj1) {
          console.log('iframeObj1: ', iframeObj1);
          let apiKey = iframeObj1.apikey;
          console.log('apiKey: ', apiKey);
          let gtin = iframeObj1.gtin;
          console.log('gtin: ', gtin);
          async function getData(url = '') {
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

      if (iframeApiResUrl) {
        console.log('iframe: ', iframeApiResUrl);
        await context.goto(iframeApiResUrl, { timeout: 60000 });
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
          try {
            let listPrice, price;
            // @ts-ignore
            listPrice = document.querySelectorAll('span[class="old-infos oldPrice"]')[0].innerText;
            var listpriceUpdated = listPrice.replace("€", ".");
            addHiddenDiv('listpriceUpdated', '€ ' + listpriceUpdated);
          } catch (error) {

          }

          // Method to Retrieve Xpath content of a Multiple Nodes
          const getAllXpath = (xpath, prop) => {
            const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            const result = [];
            for (let index = 0; index < nodeSet.snapshotLength; index++) {
              const element = nodeSet.snapshotItem(index);
              if (element) result.push(prop ? element[prop] : element.nodeValue);
            }
            return result;
          };
          // Double Pipe Concatenation
          const pipeSeparatorDouble = (id, data) => {
            var doubleSeparatorText = data.join(' || ');
            addHiddenDiv(id, doubleSeparatorText);
          };
          // Single Pipe Concatenation
          const pipeSeparatorSingle = (id, data) => {
            var SingleSeparatorText = data.join(' | ');
            addHiddenDiv(id, SingleSeparatorText);
          };

          // XPATH Data Extraction For Additional Description Bullet
          const addDescBulletInfo = getAllXpath("//div[@id='tabs-1']/ul/li/text()", 'nodeValue');
          pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);

          const addDescInfo = getAllXpath("//div[@id='tabs-1']//text()", 'nodeValue');
          var addDescInfoFinal = [];
          for (let i = 0; i < addDescInfo.length; i++) {
            if (addDescInfo[i].length > 2) {
              addDescInfoFinal.push(addDescInfo[i]);
            }
          }
          pipeSeparatorDouble('addDescInfo', addDescInfoFinal);
          const variants = getAllXpath("//div[@class='tab-content subList']/div/@data-color", 'nodeValue');
          pipeSeparatorSingle('variants', variants);

          try {
            let specificationsFinal = "";
            let specifications = document.querySelectorAll('table[class="productSpecifications"]');
            for (let i = 0; i < specifications.length; i++) {
              // @ts-ignore
              specificationsFinal += specifications[i].innerText;
            }
            specificationsFinal = specificationsFinal.replace(/\s/g, ' ');
            addHiddenDiv('specifications', specificationsFinal);
          } catch (error) {

          }
          try {
            const availability = getAllXpath('//script[@type="application/ld+json" and contains(text(),"InStock")]/text()', 'nodeValue');
            if (availability[0].includes('InStock')) {
              addHiddenDiv('availability', 'In Stock')
            }
            else {
              addHiddenDiv('availability', 'Out Of Stock')
            }
          } catch (error) {

          }
          try {
            let price;
            // @ts-ignore
            price = document.querySelectorAll('div[class="currentPrice"]')[0].innerText;
            var priceUpdated = price.replace("€", ".");
            addHiddenDiv('priceUpdated', '€ ' + priceUpdated);
          } catch (error) {
          }
          var brandName = "";
          try {
            var temp;
            let dataScript = document.querySelectorAll('script[type="application/ld+json"]');
            for (let i = 0; i < dataScript.length; i++) {
              // @ts-ignore
              temp = dataScript[i].innerText;
              if (temp.includes('availability')) {
                temp = JSON.parse(temp);
                // addHiddenDiv('availabilty', temp.offers.availability);
                brandName = temp.brand.name;
              }
            }
          } catch (error) {

          }
          try {
            if (brandName.length == 0 || brandName == 'Conforama') {
              // @ts-ignore
              brandName = document.querySelector('div[class="productTitle"]>div>h1>a').innerText;
              brandName = brandName.split(' ')[0];
              addHiddenDiv('brand', brandName);
            }
            else {
              addHiddenDiv('brand', brandName);
            }
          } catch (error) {

          }
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
