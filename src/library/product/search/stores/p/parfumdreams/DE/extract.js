const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'parfumdreams',
    transform: transform,
    domain: 'parfumdreams.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {

      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class*="product-image"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      //const ean = getXpath('//*[@id="content-wrapper"]/div[1]/div[2]/script[2]/text()', 'nodeValue');
      //let ean=''
      //let jsonData=null
      //var urlchkr=(//meta[@property='og:url']/@content)[1]
      //if 
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      // const urlchkr = getXpath("(//meta[@property='og:url']/@content)[1]", 'nodeValue')
      // if (urlchkr.includes('Aftershave')) {
      //   const ean = document.querySelectorAll("div.cw.full > div.page-category.main-content > div.chanel.clearfix > script:nth-child(6)");
      //   // @ts-ignore
      //   try {
      //     // @ts-ignore
      //     let jsonData = ean[0].innerText
      //     if (jsonData != null) {
      //       //let jsonData=ean[0].innerText;
      //       let splitJsonData = jsonData.split('"impressions":')[1];
      //       var a = splitJsonData.match(/position/g).length; console.log(a)
      //       let splitJsonData2 = splitJsonData.split('"position":' + a)[0];
      //       splitJsonData2 = splitJsonData2 + '"position":' + a + '}]';
      //       splitJsonData2 = JSON.parse(splitJsonData2);
      //       for (var i = 0; i < splitJsonData2.length; i++) {
      //         addHiddenDiv('ean', splitJsonData2[i].ean, i);
      //         addHiddenDiv('id', splitJsonData2[i].simpleId, i);
      //       }
      //     }
      //   }
      //   catch (error) { }
      // }
      const URL = window.location.href
      if (URL.includes('Aftershave')) {

        // @ts-ignore
        let ean = document.querySelectorAll("#content-wrapper > div.cw.full > div.main-content > script:nth-child(6)");
        
        try {
          // @ts-ignore
          let jsonData = ean[0].innerText
          if (jsonData != null) {
            //let jsonData=ean[0].innerText;
            let splitJsonData = jsonData.split('"impressions":')[1];
            var a = splitJsonData.match(/position/g).length; console.log(a)
            let splitJsonData2 = splitJsonData.split('"position":' + a)[0];
            splitJsonData2 = splitJsonData2 + '"position":' + a + '}]';
            splitJsonData2 = JSON.parse(splitJsonData2);
            for (var i = 0; i < splitJsonData2.length; i++) {
              addHiddenDiv('ean', splitJsonData2[i].ean, i);
              addHiddenDiv('id', splitJsonData2[i].simpleId, i);
            }
          }
        }
        catch (error) { }
      }
      else if (URL.includes('Shu-Uemura')) {

        // @ts-ignore
        let ean = document.querySelectorAll("#content-wrapper > div > div.page-category.main-content > strong > script:nth-child(2)");
        
        
        try {
          // @ts-ignore
          let jsonData = ean[0].innerText
          if (jsonData != null) {
            //let jsonData=ean[0].innerText;
            let splitJsonData = jsonData.split('"impressions":')[1];
            var a = splitJsonData.match(/position/g).length; console.log(a)
            let splitJsonData2 = splitJsonData.split('"position":' + a)[0];
            splitJsonData2 = splitJsonData2 + '"position":' + a + '}]';
            splitJsonData2 = JSON.parse(splitJsonData2);
            for (var i = 0; i < splitJsonData2.length; i++) {
              addHiddenDiv('ean', splitJsonData2[i].ean, i);
              addHiddenDiv('id', splitJsonData2[i].simpleId, i);
            }
          }
        }
        catch (error) { }
      }
      else if (URL.includes('sonnenöl')){
        try {
          let ean = document.querySelectorAll("#content-wrapper > div > div.main-content > strong > strong > script:nth-child(2)");
          // @ts-ignore
          let jsonData = ean[0].innerText
          if (jsonData != null) {
            //let jsonData=ean[0].innerText;
            let splitJsonData = jsonData.split('"impressions":')[1];
            var a = splitJsonData.match(/position/g).length; console.log(a)
            let splitJsonData2 = splitJsonData.split('"position":' + a)[0];
            splitJsonData2 = splitJsonData2 + '"position":' + a + '}]';
            splitJsonData2 = JSON.parse(splitJsonData2);
            for (var i = 0; i < splitJsonData2.length; i++) {
              addHiddenDiv('ean', splitJsonData2[i].ean, i);
              addHiddenDiv('id', splitJsonData2[i].simpleId, i);
            }
          }
        }
        catch (error) { }
      }
      else if (URL.includes('haar%u00f6l')) {

        // @ts-ignore
        let ean = document.querySelectorAll("#content-wrapper > div.cw.full > div.page-category.main-content > div.chanel.clearfix > script:nth-child(6)");
        
        try {
          // @ts-ignore
          let jsonData = ean[0].innerText
          if (jsonData != null) {
            //let jsonData=ean[0].innerText;
            let splitJsonData = jsonData.split('"impressions":')[1];
            var a = splitJsonData.match(/position/g).length; console.log(a)
            let splitJsonData2 = splitJsonData.split('"position":' + a)[0];
            splitJsonData2 = splitJsonData2 + '"position":' + a + '}]';
            splitJsonData2 = JSON.parse(splitJsonData2);
            for (var i = 0; i < splitJsonData2.length; i++) {
              addHiddenDiv('ean', splitJsonData2[i].ean, i);
              addHiddenDiv('id', splitJsonData2[i].simpleId, i);
            }
          }
        }
        catch (error) { }
      }
      else if (URL.includes('redken')) {

        // @ts-ignore
        let ean = document.querySelectorAll("#content-wrapper > div > div.page-category.main-content > b > script:nth-child(2)");
        
        try {
          // @ts-ignore
          let jsonData = ean[0].innerText
          if (jsonData != null) {
            //let jsonData=ean[0].innerText;
            let splitJsonData = jsonData.split('"impressions":')[1];
            var a = splitJsonData.match(/position/g).length; console.log(a)
            let splitJsonData2 = splitJsonData.split('"position":' + a)[0];
            splitJsonData2 = splitJsonData2 + '"position":' + a + '}]';
            splitJsonData2 = JSON.parse(splitJsonData2);
            for (var i = 0; i < splitJsonData2.length; i++) {
              addHiddenDiv('ean', splitJsonData2[i].ean, i);
              addHiddenDiv('id', splitJsonData2[i].simpleId, i);
            }
          }
        }
        catch (error) { }
      }
      else {
        try {
          // @ts-ignore
          let ean = document.querySelectorAll("div.main-content > script:nth-child(6)");
          // @ts-ignore
          let jsonData = ean[0].innerText
          try {
            if (jsonData != null) {
              //let jsonData=ean[0].innerText;
              let splitJsonData = jsonData.split('"impressions":')[1];
              var a = splitJsonData.match(/position/g).length; console.log(a)
              let splitJsonData2 = splitJsonData.split('"position":' + a)[0];
              splitJsonData2 = splitJsonData2 + '"position":' + a + '}]';
              splitJsonData2 = JSON.parse(splitJsonData2);
              for (var i = 0; i < splitJsonData2.length; i++) {
                addHiddenDiv('ean', splitJsonData2[i].ean, i);
                addHiddenDiv('id', splitJsonData2[i].simpleId, i);
              }
            }
          }
          catch (error) { }

        }
        catch (error) {
          if (error instanceof TypeError) {
            let ean = document.querySelectorAll("#right-column > script:nth-child(4)");
            // @ts-ignore
            let jsonData = ean[0].innerText
            try {
              if (jsonData != null) {
                //Gesichtsreiniger
                //let jsonData=ean[0].innerText;
                let splitJsonData = jsonData.split('"impressions":')[1];
                var a = splitJsonData.match(/position/g).length; console.log(a)
                let splitJsonData2 = splitJsonData.split('"position":' + a)[0];
                splitJsonData2 = splitJsonData2 + '"position":' + a + '}]';
                splitJsonData2 = JSON.parse(splitJsonData2);
                for (var i = 0; i < splitJsonData2.length; i++) {
                  addHiddenDiv('ean', splitJsonData2[i].ean, i);
                  addHiddenDiv('id', splitJsonData2[i].simpleId, i);
                }
              }

            }

            catch (error) { }
          }


        }
      }


    });
    return await context.extract(productDetails, { transform });
  },
};
