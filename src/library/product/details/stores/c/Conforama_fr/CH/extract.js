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
        var iframeApiResUrl = document.querySelectorAll('div.loadbee-inpage div.loadbeeTabContent iframe')[0].getAttribute('src');
        return iframeApiResUrl;
      });


      if (iframeObj) {
        console.log('iframe: ', iframeObj);
        await context.goto(iframeObj, { timeout: 60000 });
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

          const getAllXpath = (xpath, prop) => {
            const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            const result = [];
            for (let index = 0; index < nodeSet.snapshotLength; index++) {
              const element = nodeSet.snapshotItem(index);
              if (element) result.push(prop ? element[prop] : element.nodeValue);
            }
            return result;
          };
          function getDataFromBGURL(data) {
            var returnURLs = [];
            var temp;
            for (let i = 0; i < data.length; i++) {
              temp = data[i].replace(/background-image: url\("/g,'').replace(/"\).*$/g,'').replace(/background-image:url\('/g,'').replace(/'\).*$/g,'').replace(/background-image: url\('/g,'').replace(/'\).*$/g,'')
              returnURLs.push(temp);
            }
            return returnURLs;
          }
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
          let BGUrls = getAllXpath('//*[contains(@style,"background-image")]/@style', 'nodeValue');
          let updatedBGUrls = getDataFromBGURL(BGUrls);
          updatedBGUrls.forEach(element => {
            img1.push(element);
          });
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
        await context.evaluate(async () => {
          function addHiddenDiv(id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
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
          try {
            // XPATH Data Extraction For Additional Description Bullet
            const addDescBulletInfo = getAllXpath("//div[@id='tabs-1']/ul/li/text()", 'nodeValue');
            pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);
          } catch (error) {

          }
          try {
            const addDescInfo = getAllXpath("//div[@id='tabs-1']/*[not(contains(@class,'inpage'))]//text()", 'nodeValue');
            var addDescInfoFinal = [];
            for (let i = 0; i < addDescInfo.length; i++) {
              if (addDescInfo[i].length > 2) {
                addDescInfoFinal.push(addDescInfo[i]);
              }
            }
            pipeSeparatorDouble('addDescInfo', addDescInfoFinal);
          } catch (error) {

          }
          try {
            const variants = getAllXpath("//div[@class='tab-content subList']/div/@data-color", 'nodeValue');
            pipeSeparatorSingle('variants', variants);

          } catch (error) {

          }
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
            const availability = getAllXpath('//script[@type="application/ld+json" and (contains(text(),"PreOrder"))]/text()|//script[@type="application/ld+json" and contains(text(),"InStock")]/text()', 'nodeValue');
            addHiddenDiv('availability', 'In Stock')
          } catch (error) {
            addHiddenDiv('availability', 'Out Of Stock')
          }
          try {
            var brandName = "";
            var temp;
            let dataScript = document.querySelectorAll('script[type="application/ld+json"]');
            for (let i = 0; i < dataScript.length; i++) {
              // @ts-ignore
              temp = dataScript[i].innerText;
              if (temp.includes('availability')) {
                try {
                  temp = JSON.parse(temp);
                } catch (error) {
                  temp = temp.split('"brand": {');
                  temp = temp[1].split('},')
                  temp = temp[0];
                  temp = "{\"brand\": {" + temp + "}}"
                  temp = JSON.parse(temp);
                }
                // addHiddenDiv('availabilty', temp.offers.availability);
                brandName = temp.brand.name;
              }
            }
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
        })
        return await context.extract(productDetails, { transform }, { type: 'APPEND' });
      }
    } catch (e) {
      console.log('error')
      console.log(e);
    }
    await context.evaluate(async () => {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
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
      try {
        // XPATH Data Extraction For Additional Description Bullet
        const addDescBulletInfo = getAllXpath("//div[@id='tabs-1']/ul/li/text()", 'nodeValue');
        pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);
      } catch (error) {

      }
      try {
        const addDescInfo = getAllXpath("//div[@id='tabs-1']/*[not(contains(@class,'inpage'))]//text()", 'nodeValue');
        var addDescInfoFinal = [];
        for (let i = 0; i < addDescInfo.length; i++) {
          if (addDescInfo[i].length > 2) {
            addDescInfoFinal.push(addDescInfo[i]);
          }
        }
        pipeSeparatorDouble('addDescInfo', addDescInfoFinal);
      } catch (error) {

      }
      try {
        const variants = getAllXpath("//div[@class='tab-content subList']/div/@data-color", 'nodeValue');
        pipeSeparatorSingle('variants', variants);

      } catch (error) {

      }
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
        const availability = getAllXpath('//script[@type="application/ld+json" and (contains(text(),"PreOrder"))]/text()|//script[@type="application/ld+json" and contains(text(),"InStock")]/text()', 'nodeValue');
        addHiddenDiv('availability', 'In Stock')
      } catch (error) {
        addHiddenDiv('availability', 'Out Of Stock')
      }
      try {
        var brandName = "";
        var temp;
        let dataScript = document.querySelectorAll('script[type="application/ld+json"]');
        for (let i = 0; i < dataScript.length; i++) {
          // @ts-ignore
          temp = dataScript[i].innerText;
          if (temp.includes('availability')) {
            try {
              temp = JSON.parse(temp);
            } catch (error) {
              temp = temp.split('"brand": {');
              temp = temp[1].split('},')
              temp = temp[0];
              temp = "{\"brand\": {" + temp + "}}"
              temp = JSON.parse(temp);
            }
            // addHiddenDiv('availabilty', temp.offers.availability);
            brandName = temp.brand.name;
          }
        }
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
    })
    return await context.extract(productDetails, { transform });
  },
};
