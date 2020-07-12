const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    transform: transform,
    domain: 'cvs.com',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 6000));


    var jsonText = await context.evaluate(function () {
      return document.body.innerText;
    });
    const json = JSON.parse(jsonText);
  
    if (json && json.records && json.totalRecordCount) {
      const currentUrl = await context.evaluate(function() {
        return window.location.href;
      })



      async function collectManuf() {
        // let variants = [302482,302514,302696];
        const variants = await context.evaluate(function(records,cnt) {
          if (records[0].allMeta) {
            const product = records[0].allMeta;
            if (product) {
              if(product.variants.length){
                let skuArray = [];
                product.variants.forEach(variant => {
                  skuArray.push(variant.subVariant[0].p_Sku_ID);
                });
                return skuArray;
              }
            }
          }
        },json.records, json.totalRecordCount,)
        let manufArray = [];
        let i = 0;
        while(i < variants.length) {
          await context.goto(`https://scontent.webcollage.net/cvs/power-page?ird=true&channel-product-id=${variants[i]}`, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
          await new Promise(resolve => setTimeout(resolve, 1000));

          var jsonText = await context.evaluate(function () {
            return document.querySelector('pre').innerText;
          });
          const findStr1 = 'html:';
          const startIdx1 = jsonText.indexOf(findStr1) + findStr1.length;
          const endIdx1 = jsonText.indexOf('var _wcscript');
          let text = (startIdx1 && startIdx1 > -1 && endIdx1 && endIdx1 > -1) ? jsonText.substr(startIdx1, endIdx1 - startIdx1) : 0;
          text = text.substr(1, text.indexOf('div>"')+4);
          manufArray.push(text);
          i++;
        }
        return manufArray;
      }


      const htmlList = await collectManuf();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await context.goto(currentUrl, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
      
      await context.evaluate(function (records, cnt, htmlList) {        
        function addHiddenDiv (id, content, parentDiv = null, html = false) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          if (!content) content = '';
          if(html) {
            newDiv.innerHTML = unescape(content.replace(/\\/g, '')).replace(/"""/g, '');
          } else {
            newDiv.textContent = content;
          }
          // newDiv.style.display = 'none';
          if (parentDiv) {
            parentDiv.appendChild(newDiv);
          } else {
            document.body.appendChild(newDiv);
          }
          return newDiv;
        }

        document.body.innerText = '';
        addHiddenDiv('totalRecordCount', cnt);
        addHiddenDiv('ii_url', window.location.href);

          if (records[0].allMeta) {
            const product = records[0].allMeta;
            if (product) {
              if(product.variants.length){
                let skuArray = [];
                for(let i = 0; i < product.variants.length; i++){
                  
                  const newDiv = addHiddenDiv(`ii_product`, `${i}`);
                  addHiddenDiv(`ii_manufHTML${i}`, htmlList[i], newDiv, true);

                  addHiddenDiv('ii_brand', product.ProductBrand_Brand, newDiv);
                  addHiddenDiv('ii_title', product.title, newDiv);
                  addHiddenDiv('ii_productUrl', product.gbi_ParentProductPageUrl, newDiv);
                  // addHiddenDiv('ii_category', product.categories); 
                  if(product.categories){
                    Object.values(product.categories[0]).forEach(cat => {
                      addHiddenDiv('ii_category', cat); 
                    })
                  } 
                  const manufDesc = `//div[@id="ii_manufHTML${i}"]//div[contains(@id, "wc-power-page")]//div[not (contains(., "Is the information in this section helpful")) and not (contains(., "The information above is")) and not (contains(., ".wc"))]//text()`
                  const variantManufImages = '//div[@id="wc-aplus"]//img/@src[not (contains(., "syndigo.svg"))]'
                  const variantVideo = '//img[contains(@class,"wc-iframe")]/@data-asset-url'
                  const variantVideo2 = '//img[contains(@class, "wc-video")]/@wcobj'
                  const variantVideo3 = '//div[contains(@class, "wc-iframe")]//@data-src'
debugger
                  if(manufDesc) {
                    var element = document.evaluate( manufDesc, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    if( element.snapshotLength > 0 ) {
                      for(let i = 0; i < element.snapshotLength; i++) {
                        addHiddenDiv(`ii_manufDesc`, `${element.snapshotItem(i).textContent}`);
                      }
                    }
                  }

                  if(variantManufImages) {
                    var element = document.evaluate( variantManufImages, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    if( element.snapshotLength > 0 ) {
                      for(let i = 0; i < element.snapshotLength; i++) {
                        addHiddenDiv(`ii_variantManufImages`, `${element.snapshotItem(i).textContent}`);
                      }
                    }
                  }

                  if(variantVideo) {
                    var element = document.evaluate( variantVideo, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    var element2 = document.evaluate( variantVideo2, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    var element3 = document.evaluate( variantVideo3, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            
            
                    if( element.snapshotLength > 0 ) {
                      for(let i = 0; i < element.snapshotLength; i++) {
                        addHiddenDiv(`ii_videoSrc`, `${element.snapshotItem(i).textContent}`);
                      }
                    } 
                    if(element2.snapshotLength > 0){
                      for(let i = 0; i < element2.snapshotLength; i++) {
                        addHiddenDiv(`ii_videoSrc`, `${element2.snapshotItem(i).textContent}`);
                      }
                    }
                    if(element3.snapshotLength > 0){
                      for(let i = 0; i < element3.snapshotLength; i++) {
                        addHiddenDiv(`ii_videoSrc`, `${element3.snapshotItem(i).textContent}`);
                      }
                    }
                  }
              
                  
                  const variant = product.variants[i].subVariant[0];

                      if(variant.upc_image.length){
                        addHiddenDiv('ii_image',`https://www.cvs.com/bizcontent/merchandising/productimages/large/${variant.upc_image[0]}`, newDiv); 
                        if(variant.upc_image.length > 1){
                          addHiddenDiv('ii_imageAlt',`https://www.cvs.com/bizcontent/merchandising/productimages/large/${variant.upc_image[1]}`, newDiv); 
                          addHiddenDiv('ii_secondaryImageTotal',`${variant.upc_image.length - 1}`, newDiv); 
                          for(let j = 1; j < variant.upc_image.length; j++){
                            addHiddenDiv('ii_alternateImages',`https://www.cvs.com/bizcontent/merchandising/productimages/large/${variant.upc_image[j]}`, newDiv); 
                          }
                        }   
                      }

                      if(variant.p_Product_Details){
                        let deets = variant.p_Product_Details;
                        const regex = /<li>(.*?)<\/li>/g
                        let bullets = deets.match(regex)
                        deets = deets.replace(/<li>(.*?)<\/li>/g, ' ')
                        deets = deets.replace(/<.+?>/g, ' ')
                        addHiddenDiv('ii_description', `${deets}`, newDiv); 
                        if(bullets){
                          addHiddenDiv('ii_descriptionBullets', `${bullets.length}`, newDiv); 
                          for(let i = 0; i < bullets.length; i++){
                            let newBullet = bullets[i].replace(/<\/?li>/g,' ')
                            addHiddenDiv('ii_description', `${newBullet}`, newDiv); 
                            addHiddenDiv('ii_additionalDescBulletInfo', `${newBullet}`, newDiv); 
                          }
                        }
                      }

                      if(variant.p_Product_Warnings){
                        let deets = variant.p_Product_Warnings;
                        const regex = /<li>(.*?)<\/li>/g
                        let bullets = deets.match(regex)
                        deets = deets.replace(/<li>(.*?)<\/li>/g, ' ')
                        deets = deets.replace(/<.+?>/g, ' ')
                        addHiddenDiv('ii_warnings', `${deets}`, newDiv); 
                        if(bullets){
                          for(let i = 0; i < bullets.length; i++){
                            let newBullet = bullets[i].replace(/<\/?li>/g,' ')
                            addHiddenDiv('ii_warnings', `${newBullet}`, newDiv); 
                          }
                        }
                      }

                      if(variant.p_Product_Ingredients){
                        let deets = variant.p_Product_Ingredients;
                        const regex = /<li>(.*?)<\/li>/g
                        let bullets = deets.match(regex)
                        deets = deets.replace(/<li>(.*?)<\/li>/g, ' ')
                        deets = deets.replace(/<.+?>/g, ' ')
                        addHiddenDiv('ii_ingredients', `${deets}`, newDiv); 
                        if(bullets){
                          for(let i = 0; i < bullets.length; i++){
                            let newBullet = bullets[i].replace(/<\/?li>/g,' ')
                            addHiddenDiv('ii_ingredients', `${newBullet}`, newDiv); 
                          }
                        }
                      }

                      if(variant.p_Product_Directions){
                        let deets = variant.p_Product_Directions;
                        const regex = /<li>(.*?)<\/li>/g
                        let bullets = deets.match(regex)
                        deets = deets.replace(/<li>(.*?)<\/li>/g, ' ')
                        deets = deets.replace(/<.+?>/g, ' ')
                        addHiddenDiv('ii_directions', `${deets}`, newDiv); 
                        if(bullets){
                          for(let i = 0; i < bullets.length; i++){
                            let newBullet = bullets[i].replace(/<\/?li>/g,' ')
                            addHiddenDiv('ii_directions', `${newBullet}`, newDiv); 
                          }
                        }
                      }
                      addHiddenDiv('ii_id', variant.p_Sku_ID, newDiv);
                      skuArray.push(variant.p_Sku_ID);
                      addHiddenDiv('ii_packSize', variant.p_Sku_Size, newDiv);  
                      addHiddenDiv('ii_listPrice', variant.p_Product_Price, newDiv);              
                      addHiddenDiv('ii_weight', variant.p_Product_Weight, newDiv);              
                      addHiddenDiv('ii_reviewCount', variant.p_Product_Review, newDiv);              
                      addHiddenDiv('ii_promotion', variant.p_Promotion_Description, newDiv);  
                      addHiddenDiv('ii_price', variant.gbi_Actual_Price, newDiv);
                      addHiddenDiv('ii_servingSize', variant.p_Vendor_Serving_Size, newDiv);
                      addHiddenDiv('ii_numberOfServingsInPackage', variant.p_Vendor_Serving_Per_Container, newDiv);
                      addHiddenDiv('ii_servingSizeUom', variant.p_Vendor_Serving_Size_UOM, newDiv);
                      addHiddenDiv('ii_reviews', variant.p_Product_Review, newDiv);
                      addHiddenDiv('ii_rating', variant.p_Product_Rating, newDiv);
                      
                      let metaKeywords = [product.title];
                      
                      if(variant.p_Sku_Color){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_Color, newDiv);
                        metaKeywords.push(variant.p_Sku_Color)
                      }
                      if(variant.p_Sku_Size){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_Size, newDiv);
                        metaKeywords.push(variant.p_Sku_Size)
                      }
                      if(variant.p_Sku_Group_Size){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_Group_Size, newDiv);
                        metaKeywords.push(variant.p_Sku_Group_Size)
                      }
                      if(variant.p_Sku_Flavor){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_Flavor, newDiv);
                        metaKeywords.push(variant.p_Sku_Flavor)
                      }
                      if(variant.p_Sku_Count){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_Count, newDiv);
                        metaKeywords.push(variant.p_Sku_Count)
                      }
                      if(variant.p_Sku_Form){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_Form, newDiv);
                        metaKeywords.push(variant.p_Sku_Form)
                      }
                      if(variant.p_Sku_Absorbency){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_Absorbency, newDiv);
                        metaKeywords.push(variant.p_Sku_Absorbency)
                      }
                      if(variant.p_Sku_Final_Look){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_Final_Look, newDiv);
                        metaKeywords.push(variant.p_Sku_Final_Look)
                      }
                      if(variant.p_Sku_Finish){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_Finish, newDiv);
                        metaKeywords.push(variant.p_Sku_Finish)
                      }
                      if(variant.p_Sku_Fragrance){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_Fragrance, newDiv);
                        metaKeywords.push(variant.p_Sku_Fragrance)
                      }
                      if(variant.p_Sku_Pack){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_Pack, newDiv);
                        metaKeywords.push(variant.p_Sku_Pack)
                      }
                      if(variant.p_Sku_SPF){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_SPF, newDiv);
                        metaKeywords.push(variant.p_Sku_SPF)
                      }
                      if(variant.p_Sku_Scent){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_Scent, newDiv);
                        metaKeywords.push(variant.p_Sku_Scent)
                      }
                      if(variant.p_Sku_Strength){
                        addHiddenDiv('ii_variantInfo', variant.p_Sku_Strength, newDiv);
                        metaKeywords.push(variant.p_Sku_Strength)
                      }
                      let meta = metaKeywords.join(' ');
                      addHiddenDiv('ii_metaKeywords', `${meta}`, newDiv);


                      if(variant.CAREPASS_INDICATOR === "ELIGIBLE") {
                      addHiddenDiv('ii_shipping', 'Ships Free With CarePass', newDiv);
                      }
                    
                    
                    
                  }
                  // return skuArray;
                }
            
          }
        }
      }, json.records, json.totalRecordCount, htmlList);
    }



    // const html = await context.evaluate(async function getDataFromUrl() {
    //   // const redirectUrl = 'https://scontent.webcollage.net/cvs/power-page?ird=true&channel-product-id=874110'
    //   let response = fetch("https://scontent.webcollage.net/cvs/power-page?ird=true&channel-product-id=874110", {
    //     "headers": {
    //     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    //     "accept-language": "en-US,en;q=0.9",
    //     "cache-control": "no-cache",
    //     "pragma": "no-cache",
    //     "sec-fetch-dest": "document",
    //     "sec-fetch-mode": "navigate",
    //     "sec-fetch-site": "none",
    //     "sec-fetch-user": "?1",
    //     "upgrade-insecure-requests": "1"
    //   },
    //   "referrerPolicy": "no-referrer-when-downgrade",
    //   "body": null,
    //   "method": "GET",
    //   "mode": "no-cors",
    //   "credentials": "omit"
    //   })
    //   // .then(response => response.text())
    //   // .then(function (text) {
    //   //   // debugger
    //   //   console.log("THE TEXT IS COMING!!!!!!!!!")
    //   //   console.log(text + "THIS IS THE TEXT!!!!!!!!!!!!!")
    //   // });
  
    //   // if (response && response.status === 404) {
    //   //   console.log('Product Not Found!!!!');
    //   //   return '';
    //   // }
    //   if (response[0]) {
    //     console.log('Product Found!!!!');
    //     // console.log(response.status)
    //     console.log(response)
    //     const data = (await response[0]);
    //     debugger
    //     return data;
    //   }
    // });
    

    
    return await context.extract(productDetails, { transform: transformParam });

  },
};