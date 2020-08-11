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

    const html = await context.evaluate(async function getEnhancedContent() {

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
      let videoClick = '(//div[@data-comp="Carousel "])[1]//img[contains(@src, "Video")]'
      var videoLinks = document.evaluate( videoClick, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if( videoLinks.snapshotLength > 0 ) {
        for(let i = 0; i < videoLinks.snapshotLength; i++) {
          let info = videoLinks.snapshotItem(i).textContent;
          if(info.includes("COLOR")){
    
        }
      }

      async function fetchRetry(url, n) {
        function handleErrors(response) {
          if (response.status === 200){
            return response;
          } else {
            debugger
            console.log("FETCH FAILED")
            if (n === 1) return "Nothing Found";
            return fetchRetry(url, n - 1);
          }
        }
        let fetched = fetch(url, {

          "credentials": "same-origin"
        }).then(handleErrors).then(response => response.text()).catch(error => {
          debugger
            console.log("FETCH FAILED")
            if (n === 1) return "Nothing Found";
            return fetchRetry(url, n - 1);

        });
        return fetched;
      }
      return fetchRetry(`https://edge.api.brightcove.com/playback/v1/accounts/6072792324001/videos/${videoIdForUrl[0]}`, 10)
    })

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

      let scrollTop = 0;
      while (scrollTop !== 10000) {
        scrollTop += 1000;
        window.scroll(0, scrollTop);
  
        console.log("SCROLLING")
        if (scrollTop === 10000) {
          break;
        }
      }
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
      if( vInfo.snapshotLength > 0 ) {
        for(let i = 0; i < vInfo.snapshotLength; i++) {
          let info = vInfo.snapshotItem(i).textContent;
          let splits = info.split(":");
          if(info.includes("COLOR")){
            addHiddenDiv(`ii_color`, splits[1]);
          }
          addHiddenDiv(`ii_variantInfo`, splits[1]);
        }
      }

    }, parentInput, html);

      await new Promise(resolve => setTimeout(resolve, 5000));


      return await context.extract(productDetails, { transform: transformParam });
    },
};
