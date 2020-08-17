const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    transform,
    domain: 'sephora.com',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {

    const itemUrl = await context.evaluate(function() {
      let resultsCheck = '(//h1//text()[not(parent::b)])[1]'
      var checkResults = document.evaluate( resultsCheck, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if(checkResults.snapshotLength > 0){
        let checkNone = checkResults.snapshotItem(0).textContent;
        if(checkNone === "0 Product results:"){
          throw new Error("notFound");
        }
      }

      let itemCheck = '//div[@data-comp="ProductGrid "]//a'
      var checkElement = document.evaluate( itemCheck, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if( checkElement.snapshotLength > 0 ) {
        let url = checkElement.snapshotItem(0).href
        let splits = url.split("&")
        return splits[0]
      } else {
        return null
      }
    })
    if(itemUrl){
      await context.goto(itemUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    }
    context.captureRequests();

    const scrollFunc = await context.evaluate(function(){
      let scrollTop = 0;
      while (scrollTop !== 10000) {
        scrollTop += 1000;
        window.scroll(0, scrollTop);
  
        console.log("SCROLLING")
        if (scrollTop === 10000) {
          break;
        }
      }
    })

    const videoIdArray = await context.evaluate(function(){
      let videoEle = document.querySelector('#linkJSON');
      let videoIdForUrl = [];
      if(videoEle){
        let videoObj = JSON.parse(videoEle.innerText);
        let videoIds = videoObj[4].props.currentProduct.productVideos
        if(videoIds){
          videoIds.forEach(obj => {
            videoIdForUrl.push(obj.videoUrl)
          })
        }
      }
      return videoIdForUrl
    })

    // await context.evaluate(function() {
    //   let videoClicks = document.querySelectorAll('div[data-comp="BccVideo BccBase BccStyleWrapper "] img');
    //   let offClick = document.querySelector('div#ratings-reviews-container')
    //   for(let i = 0; i < videoClicks.length; i++){
    //     let link = videoClicks[i].src;
    //     if(link.includes("video.jpg")){
    //       videoClicks[i].click();
    //     }
    //   }
    // })
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // context.searchForRequest(`https://edge.api.brightcove.com/playback/v1/accounts/6072792324001/videos/${videoIdArray[0]}`);
    // context.click('div#ratings-reviews-container')

    
    // const html = await context.evaluate(async function getEnhancedContent(videoIdForUrl) {
    
    //   async function fetchRetry(url, n) {
    //     function handleErrors(response) {
    //       if (response.status === 200){
    //         return response;
    //       } else {
    //         console.log("FETCH FAILED")
    //         if (n === 1) return "Nothing Found";
    //         return fetchRetry(url, n - 1);
    //       }
    //     }
    //     let fetched = fetch(url, {
    //       "headers": {
    //         "accept": "*/*",
    //         "accept-language": "en-US,en;q=0.9",
    //         "accept-encoding": "gzip, deflate, br",
    //         "cache-control": "no-cache",
    //         "origin": "https://www.sephora.com",
    //         "authority": "manifest.prod.boltdns.net",
    //         "pragma": "no-cache",
    //         "sec-fetch-dest": "empty",
    //         "sec-fetch-mode": "cors",
    //         "sec-fetch-site": "cross-site"
    //       },
    //       "referrer": "https://www.sephora.com/ca/en/product/highliner-gel-crayon-P379434?icid2=products%20grid:p379434:product&skuId=1880079",
    //       "referrerPolicy": "no-referrer-when-downgrade",
    //       "body": null,
    //       "method": "GET",
    //       "mode": "cors",
    //       "credentials": "same-origin"
    //     }).then(handleErrors).then(response => response.text()).catch(error => {
    //         console.log("FETCH FAILED")
    //         if (n === 1) return "Nothing Found";
    //         return fetchRetry(url, n - 1);

    //     });
    //     return fetched;
    //   }
    //   return fetchRetry(`https://edge.api.brightcove.com/playback/v1/accounts/6072792324001/videos/${videoIdForUrl[0]}`, 10)
    // }, videoIdArray);


    const variantArray = await context.evaluate(function (parentInput, html) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      addHiddenDiv(`ii_url`, window.location.href);
      addHiddenDiv(`ii_parentInput`, parentInput);


      const element = document.querySelectorAll("script[type='application/ld+json']");
      let variantObj;
      let variantSkuArray = [];
      if(element.length > 0) {
        for(let i = 0; i < element.length; i++){
          let variantText = element[i].innerText;
          if(variantText.includes("sku")){
            let varObj = JSON.parse(variantText);
            if(varObj){
              variantObj = varObj;
            }
          }
        }
      }
      if(variantObj){
        if(variantObj.offers){
          for(let j = 0; j < variantObj.offers.length; j++){
            if(variantObj.offers[j].sku){
              variantSkuArray.push(variantObj.offers[j].sku)
            }
          }
        }
      }
      if(variantSkuArray.length){
        let variantsStr = variantSkuArray.join(" | ")
        addHiddenDiv(`ii_variants`, variantsStr);
      }


      let flag = true;
      let i = 0;
      while(flag){
        let tab = document.querySelector(`button#tab${i}`);
        let pannel = document.querySelector(`div[aria-labelledby="tab${i}"]`);
        if(tab && pannel) {
          addHiddenDiv(`ii_${tab.innerText}`, pannel.innerText);
        } else {
          flag = false;
          break;
        }
        i++
      }

      let variantInfo = '//span[contains(@data-at,"item_variation_type")]'
      var vInfo = document.evaluate( variantInfo, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      let variantArr = [];
      if( vInfo.snapshotLength > 0 ) {
          let info = vInfo.snapshotItem(0).textContent;
          let splits = info.split(":");
          if(splits[1]){
            variantArr.push(splits[1]);
  
            if(info.includes("COLOR")){
              addHiddenDiv(`ii_color`, splits[1]);
            }
            addHiddenDiv(`ii_variantInfo`, splits[1]);
          } else {
            variantArr.push(splits[0]);
            addHiddenDiv(`ii_variantInfo`, splits[0]);
          }
      }

      let nameExtended = '//h1[contains(@data-comp,"DisplayName")]//text()'
      var eName = document.evaluate( nameExtended, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      let nameArray = [];
      if( eName.snapshotLength > 0 ) {
        for(let i = 0; i < eName.snapshotLength; i++) {
          let name = eName.snapshotItem(i).textContent;
          nameArray.push(name);
        }
        variantArr.forEach(info => {
          nameArray.push(info);
        })
        let fullName = nameArray.join(" ")
        addHiddenDiv(`ii_nameExtended`, fullName);
      }

    }, parentInput);

      await new Promise(resolve => setTimeout(resolve, 5000));


      return await context.extract(productDetails, { transform: transformParam });
    },
};
