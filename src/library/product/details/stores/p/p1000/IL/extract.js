
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'p1000',
    transform: cleanUp,
    domain: 'p1000.co.il',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    
    async function setprices() {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      // Get Single Value XPATH Extraction

      // xpath for variantCount
      addElementToDocument('added_variantCount', 0);

      // xpath for availabilityText
      const availabilityStatusUrl = getXpath("//meta[@itemprop='availability']/@content", 'nodeValue');
      var availabilityStatusValue;
      if (availabilityStatusUrl.includes('InStock')) {
        availabilityStatusValue = 'In stock';
      }
      if (availabilityStatusUrl.includes('OutOfStock')) {
        availabilityStatusValue = 'Out of Stock';
      }
      addElementToDocument('added_availabilityText', availabilityStatusValue);

      // xpath for Description
      const descriptionInfoXpath = "//meta[@id='head_description']/@content";
      const descriptionInfo = getXpath(descriptionInfoXpath, 'nodeValue');
      const tabDescriptionInfoXpath = "//li[contains(@id,'MainContent_Properties_productDetails')]/text()";
      const tabDescriptionInfo = getAllXpath(tabDescriptionInfoXpath, 'nodeValue');
      const bulletPointsXpath = "//ul[@class='productFrame_chkList']//li";
      const bulletPointInfo = getAllXpath(bulletPointsXpath, 'innerText');
      let finalDescriptionInfo;
      if (tabDescriptionInfo !== null && tabDescriptionInfo.length > 0) {
        addElementToDocument('added_bulletInfo', bulletPointInfo.join(' || '));
        finalDescriptionInfo = descriptionInfo + ' || ' + bulletPointInfo + ' || ' + tabDescriptionInfo.join(' || ');
        addElementToDocument('added_descriptionText', finalDescriptionInfo);
      }

      // xpath weightNet for weightNet
      const weightNet = getAllXpath("//li[contains(@id,'MainContent_Properties_pFreeText')]", 'innerText');
      weightNet.forEach(function (data) {
        if (data.includes('משקל כולל') || data.includes('משקל')) {
          const indx = data.indexOf('משקל כולל') > 0 ? data.indexOf('משקל כולל') : data.indexOf('משקל');
          let weightStr = data.substring(indx, data.indexOf('\n', data.indexOf('משקל כולל:')));
          weightStr = weightStr.replace('משקל כולל', '');
          weightStr = weightStr.replace('משקל', '');
          weightStr = weightStr.replace(':', '');
          addElementToDocument('added_weightNet', weightStr);
        }

        if (data.includes('צבע')) {
          const colorStr = data.substring(data.indexOf('צבע'), data.indexOf('\n', data.indexOf('צבע')));
          let colorValue;
          colorValue = colorStr.replace('צבע', '');
          colorValue = colorValue.replace(':', '');
          addElementToDocument('added_color', colorValue);
        }

        const specification1 = data.split('\n').join(' || ');
        const spec1 = getXpath("//div[contains(@class,'product_techInfo product_generalInfo_column')]", 'innerText');
        const specification2 = spec1.split('\n').join(' || ');
        let finalSpecification;
        if (specification2 != null && specification2.length > 0) {
          finalSpecification = specification1 + '||' + specification2;
        } else {
          finalSpecification = specification1;
        }
        addElementToDocument('added_specificationText', finalSpecification);
      });

      // xpath for price
      const priceValue = getXpath("//div[contains(@class,'productFrame_price')]//strong/@data-groupprice", 'nodeValue');
      const currencyValue = getXpath("//div[contains(@class,'productFrame_price')]//strong/b", 'innerText');
      let bidpriceValue = getXpath("//div[contains(@class,'productFrame_bid')]//strong", 'innerText');
      const bidCurrencyValue = getXpath("//div[contains(@class,'productFrame_bid')]//strong/b", 'innerText');
      let finalPriceValue;
      if (priceValue != null && currencyValue != null) {
        console.log('My priceValue', priceValue);
        console.log('My currencyValue', currencyValue);
        finalPriceValue = currencyValue + priceValue;
      }
      if (bidpriceValue != null && bidCurrencyValue != null) {
        bidpriceValue = bidpriceValue.replace('₪', '');
        finalPriceValue = bidCurrencyValue + bidpriceValue;
      }
      addElementToDocument('priceValue', finalPriceValue);

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }

        const getInTheBox = document.querySelector('#MainContent_Properties_productDetails').childNodes;
        if (getInTheBox) {
	          const getAllProducts = Array.from(getInTheBox).filter(elem=>elem.nodeType===3 || elem.nodeType===1)
            let takeTextFlag=false;
            for (let i = 0; i < getAllProducts.length; i++) {
                if(getAllProducts[i].textContent.includes("מה בקופסא") || getAllProducts[i].textContent.includes("אביזר לפינות ומסילות") || getAllProducts[i].textContent.includes("מה מגיע בערכה")){
                  takeTextFlag=true;
                  console.log("Match found111.............");
                }else if(takeTextFlag){
                  if(getAllProducts[i].textContent!="")
                  addElementToDocument(`inTheBoxText-${i}`, getAllProducts[i].textContent);
                }
                
            }
            if(!takeTextFlag){
              const getInTheBox2 = document.querySelector('#MainContent_Properties_pFreeText').childNodes;
              if(getInTheBox2){
                let brCountFlag=0;
                let tempArray=[];
                const getAllProducts2 = Array.from(getInTheBox2).filter(elem=>elem.nodeType===3 || elem.nodeType===1)
                for (let i = 0; i < getAllProducts2.length; i++) {
                  if(getAllProducts2[i].textContent.includes("אביזרים נלווים:") || getAllProducts2[i].textContent.includes("אביזרי העיצוב של ™Dyson AirWrap") || getAllProducts2[i].textContent.includes("הערכה כוללת:") || (getAllProducts2[i].textContent.includes("אביזרים") && getAllProducts2[i].textContent.trim()=="אביזרים")){
                    takeTextFlag=true;
                    console.log("Match found22222222.............");
                  }else if(takeTextFlag){
                    if(getAllProducts2[i].textContent.trim().endsWith(":")){
                      takeTextFlag=false;
                    }else{
                      //Here we have to check if two continue text Content are blank then false the flag
                      if(brCountFlag===2){
                        takeTextFlag=false;
                      }else if(getAllProducts2[i].textContent!=""){
                        brCountFlag=0;
                        tempArray=getAllProducts2[i].textContent.split(":");
                        addElementToDocument(`inTheBoxText-${i}`, tempArray[0]);
                      }else{
                        brCountFlag++;
                      }
                      
                    }
                    
                  }
                }
              }
            }
        }


    });
  }
    //Nar Code Start

    const link = await context.evaluate(function () {
      return window.location.href;
    });

    try{
      //await context.waitForSelector('div[id^="ws_widget_video"] > .ws_widget_iframe');
      await context.waitForSelector('div[id^="ws_widget_video"] > .ws_widget_iframe');
    }catch(e){
      console.log("Catch section:",e);
    }
    

    /*const src = await context.evaluate(async function () {
      //const iframe = document.querySelector('div[id^="ws_widget_video"] > .ws_widget_iframe');
      const iframe = document.querySelector('iframe[id="__ws0"]');
      // const src = iframe ? (iframe.src||iframe._src) : '';
      let src = '';
      if (iframe) {
          if (iframe.hasAttribute('src')) {
              src = iframe.getAttribute('src');
          } else if (iframe.hasAttribute('_src')) {
              src = iframe.getAttribute('_src');
          } else {
              console.log('we do not have any src in iframe');
          }
      } else {
          console.log('we do not have the iframe');
      }
      console.log('iframe src to go to - ' + src);
      
      return src;
    });*/

    //New function to get valid iframe
    const src = await context.evaluate(async function () {
      const iframeAll = document.querySelectorAll('div[id^="ws_widget_video"] > .ws_widget_iframe');
      let iframe=iframeAll[iframeAll.length-1];
      let src = '';
      if (iframe) {
          if (iframe.hasAttribute('src')) {
              src = iframe.getAttribute('src');
          } else if (iframe.hasAttribute('_src')) {
              src = iframe.getAttribute('_src');
          } else {
              console.log('we do not have any src in iframe');
          }
      } else {
          console.log('we do not have the iframe');
      }
      console.log('iframe src to go to - ' + src);
      
      return src;
    });

    if (src) {
      try {

          await context.goto(src, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
          await context.waitForSelector('div.container-fluid', { timeout: 5000 });
          const witbData = await context.evaluate(async () => {
              const getunInterruptedPDP = document.querySelector('#news-container div.descr p:first-child');
              var unInterruptedPDPText = [];
              console.log("getunInterruptedPDP:", !!getunInterruptedPDP);
              if (getunInterruptedPDP) {
                  const getAllProducts = document.querySelectorAll('#news-container div.descr');
                  console.log("getAllProducts length:",getAllProducts.length);
                  for (let i = 0; i < getAllProducts.length; i++) {
                    unInterruptedPDPText.push(getAllProducts[i].querySelector('p:first-child').innerText);
                  }
              }
              return { unInterruptedPDPText };
          });
          await new Promise(resolve => setTimeout(resolve, 30000));
          await context.goto(link, { timeout: 5000 });

          await context.waitForSelector('div.pageContent', { timeout: 5000 });
          await context.evaluate(async (witbData) => {
            function addHiddenDiv (id, content) {
              const newDiv = document.createElement('div');
              newDiv.id = id;
              newDiv.textContent = content;
              newDiv.style.display = 'none';
              document.body.appendChild(newDiv);
            }

            const {unInterruptedPDPText=[]} = witbData;
            for(let i=0;i<unInterruptedPDPText.length;i++){
              addHiddenDiv(`unInterruptedPDP-${i}`, unInterruptedPDPText[i]);
            }
          },witbData);
          //await context.waitForSelector('div#main-section', { timeout: 45000 });


      } catch (error) {
          try {

              console.log("try block.....................");
              await setprices();
              await context.extract(productDetails, { transform });
              await context.evaluate(async function (src) {
                  window.location.assign(src);
              }, src);
              await context.waitForSelector('div.container-fluid');
              return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
          } catch (err) {
              console.log(err);
          }
      }
      // return await context.extract(productDetails, { transform });
    } else {
        console.log('we do not have the src for iframe');
    }
    //Nar Code end
    
    await new Promise(resolve => setTimeout(resolve, 10000));
    await setprices();
    await context.extract(productDetails, { transform });
  },

};
