const { transform } = require('./format');

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

    
    const html = await context.evaluate(async function getEnhancedContent(videoIdForUrl) {
      let srcArray = [];
      async function fetchRetry(url, n) {
        function handleErrors(response) {
          if (response.status === 200){
            return response;
          } else {
            console.log("FETCH FAILED")
            if (n === 1) return "Nothing Found";
            return fetchRetry(url, n - 1);
          }
        }
        let fetched = fetch(url, {
          "headers": {
            "accept": "application/json;pk=BCpkADawqM2Q0u_EMhwh6sG-XavxnNSGgRmPVZqaQsilEjLYeUK24ofKhllzQeA8owqhzPCRuGbPh9FkCBxnD8mYW4RHulG2uVuwr363jOYU8lRht0dPdw7n31iz7t3LvGdQWkUrxdxrXrqk"
          }
        }).then(handleErrors).then(response => response.text()).catch(error => {
            console.log("FETCH FAILED")
            if (n === 1) return "Nothing Found";
            return fetchRetry(url, n - 1);
        });
        return fetched;
      }
      for(let i = 0; i < videoIdForUrl.length; i++){
        let fetchTry = await fetchRetry(`https://edge.api.brightcove.com/playback/v1/accounts/6072792324001/videos/${videoIdForUrl[i]}`, 10);
        srcArray.push(JSON.parse(fetchTry));
      }
      return srcArray;
    }, videoIdArray);


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

      html.forEach(obj => {
        if(obj.sources){
          let videoSrc = obj.sources[2]
          if(videoSrc){
            addHiddenDiv(`ii_video`, videoSrc.src);
          }
        }
      })

      let sizeInfo = '//div[contains(@data-comp,"SizeAndItemNumber")]'
      var sInfo = document.evaluate( sizeInfo, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if( sInfo.snapshotLength > 0 ) {
        let info = sInfo.snapshotItem(0).textContent;
        if(info.includes("•ITEM") || info.includes("• ITEM")){
          let splits = info.split("•");
          if(!splits[0].includes("ITEM")){
            let removeSize = splits[0].replace(/SIZE /g, "");
            addHiddenDiv(`ii_quantity`, removeSize);
          }
        }
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
            if(info.includes("SIZE") || info.includes("oz/") || info.includes(" mL")){
              addHiddenDiv(`ii_quantity`, splits[1]);
            }
            addHiddenDiv(`ii_variantInfo`, splits[1]);
          } else {
            if(splits[0].includes("oz/") || splits[0].includes(" mL")){
              addHiddenDiv(`ii_quantity`, splits[0]);
            }
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
        let fullName = nameArray.join(" - ")
        addHiddenDiv(`ii_nameExtended`, fullName);
      }

    }, parentInput, html);

      await new Promise(resolve => setTimeout(resolve, 5000));


      return await context.extract(productDetails, { transform: transformParam });
    },
};
