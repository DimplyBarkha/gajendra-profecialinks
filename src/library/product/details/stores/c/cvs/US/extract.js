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
    await context.waitForSelector('pre', { timeout: 20000 });

    var jsonText = await context.evaluate(function () {
      return document.body.innerText;
    });
    const json = JSON.parse(jsonText);
  
    if (json && json.records && json.totalRecordCount > 0) {

      const currentUrl = await context.evaluate(function() {
        return window.location.href;
      })
      const productPageUrl = await context.evaluate(function(records){
        const product = records[0].allMeta;
        const variant = product.variants[0].subVariant[0];
        return product.gbi_ParentProductPageUrl
      }, json.records)

      // const prodSkus = ["167781","989935","989928","167771","989933","989941"];
      const prodSkus = await context.evaluate(function(records,cnt) {
        if (records[0].allMeta) {
          const product = records[0].allMeta;
          if (product) {
            if(product.variants.length){
              let skuArray = [];
              product.variants.forEach(variant => {
                skuArray.push(variant.subVariant[0].p_Sku_ID);
              });
              if(skuArray.length){
                return skuArray;
              } else {
                return ["hello"]
              }
            }
          }
        }
      },json.records, json.totalRecordCount,)
  var stockArr = await context.evaluate(async function getDataFromAPI (products) {
    let stockArr = {};
    const url = 'https://www.cvs.com/RETAGPV3/OnlineShopService/V2/getSKUInventoryAndPrice';
    let body = "{\"request\":{\"header\":{\"lineOfBusiness\":\"RETAIL\",\"appName\":\"CVS_WEB\",\"apiKey\":\"a2ff75c6-2da7-4299-929d-d670d827ab4a\",\"channelName\":\"WEB\",\"deviceToken\":\"d9708df38d23192e\",\"deviceType\":\"DESKTOP\",\"responseFormat\":\"JSON\",\"securityType\":\"apiKey\",\"source\":\"CVS_WEB\",\"type\":\"retleg\"}},\"skuId\":[],\"pageName\":\"PLP\"}";
    let bodyjson = JSON.parse(body);
    bodyjson.skuId = products;
    body = JSON.stringify(bodyjson);   
    const response = await fetch(url,{
      "headers": {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json;charset=UTF-8",
        "pragma": "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": "https://www.cvs.com/shop/pop-arazzi-special-effects-nail-polish-prodid-1015111",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": body,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    if (response && response.status === 404) {
      console.log('Product Not Found!!!!');
      return [];
    }
    if (response && response.status === 200) {
      console.log('Product Found!!!!');
      const json = await response.json();
      
      if (json && json.response && json.response.getSKUInventoryAndPrice && json.response.getSKUInventoryAndPrice.skuInfo) {
        json.response.getSKUInventoryAndPrice.skuInfo.forEach(skuInfo => {        
          stockArr[skuInfo.skuId] = skuInfo.stockStatus
        });
      }
    }
    return stockArr;
}, prodSkus);

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
                if(skuArray.length){
                  return skuArray;
                } else {
                  return ["hello"]
                }
              }
            }
          }
        },json.records, json.totalRecordCount,)

        await context.goto(`https://scontent.webcollage.net#[!opt!]{"type":"js","init_js":""}[/!opt!]`, { timeout: 20000, waitUntil: 'load', checkBlocked: true });

        let manufArray = [];
        // let i = 0;
        // while(i < variants.length) {
        //   console.log("DOING THE SECOND GOTO")
        //   await context.goto(`https://scontent.webcollage.net/cvs/power-page?ird=true&channel-product-id=${variants[i]}`, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
        //   await new Promise(resolve => setTimeout(resolve, 1000));

        //   var jsonText = await context.evaluate(function () {
        //     return document.querySelector('pre').innerText;
        //   });
        //   const findStr1 = 'html:';
        //   console.log("START OF JSON" + jsonText)
        //   const startIdx1 = jsonText.indexOf(findStr1) + findStr1.length;
        //   const endIdx1 = jsonText.indexOf('var _wcscript');
        //   let text = (startIdx1 && startIdx1 > -1 && endIdx1 && endIdx1 > -1) ? jsonText.substr(startIdx1, endIdx1 - startIdx1) : 0;
        //   text = text.substr(1, text.indexOf('div>"')+4);
        //   manufArray.push(text);
        //   i++;
        // }
        for(let i = 0; i < variants.length; i++ ){

          const html = await context.evaluate(async function getEnhancedContent(variants, i) {

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
              let fetched = fetch(url).then(handleErrors).then(response => response.text()).catch(function(error) {
                  console.log("FETCH FAILED")
                  if (n === 1) return "Nothing Found";
                  return fetchRetry(url, n - 1);
              });
              
              return fetched
            }
            return await fetchRetry(`https://scontent.webcollage.net/cvs/power-page?ird=true&channel-product-id=${variants[i]}`, 10)
          }, variants, i);

          const regex = /html: "(.+)"\n\s\s\}\n\}\;/s
          let text = "Not Found"
          
            if(html.match(regex)){
              text = html.match(regex)[1];
            }
          
          text = text.replace(/html: /g, "")
          manufArray.push(text);
        }
        return manufArray;
      }

      const htmlList = await collectManuf();

      await context.goto(`https://www.cvs.com${productPageUrl}`, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      await new Promise(resolve => setTimeout(resolve, 20000));
      // await context.waitForSelector('div.css-1dbjc4n.r-16lk18l.r-1xi2sqm', { timeout: 20000 });

      const variantOptions = await context.evaluate(function(){
        
        let optionList = [];
        let optionPath = '//div[@class="css-1dbjc4n r-18u37iz r-f1odvy"]//div[@class="css-901oao r-vw2c0b"]'
        if(optionPath) {
          var element = document.evaluate( optionPath, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          if( element.snapshotLength > 0 ) {
            for(let i = 0; i < element.snapshotLength; i++) {
              let option = element.snapshotItem(i).textContent.replace(/: /g, '')
              if(option){
                optionList.push(option);
              }
            }
          }
        }
        return optionList;
      })

      await context.evaluate(function (records, cnt, htmlList, stockArr, variantOptions) {        
        function addHiddenDiv (id, content, parentDiv = null, html = false) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          if (!content) content = '';
          if(html) {
            newDiv.innerHTML = unescape(content.replace(/\\\\\\/g, '').replace(/\\/g,'')).replace(/\"/g,'').replace(/"""/g, '');
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
        addHiddenDiv('ii_url', window.location.href);
        
          if (records[0].allMeta) {
            const product = records[0].allMeta;
            if (product) {
              if(product.variants.length){
                let skuArray = [];
                for(let i = 0; i < product.variants.length; i++){
                  const variant = product.variants[i].subVariant[0];
                  const newDiv = addHiddenDiv(`ii_product`, `${i}`);
                  addHiddenDiv('ii_totalRecordCount', product.variants.length, newDiv);

                  addHiddenDiv(`ii_manufHTML`, htmlList[i], newDiv, true);
                  addHiddenDiv(`ii_imageAlt`, product.title, newDiv, true);


                  addHiddenDiv('ii_brand', product.ProductBrand_Brand, newDiv);
                  if(variant.product_title_desktop){
                    addHiddenDiv('ii_title', variant.product_title_desktop, newDiv);

                  } else {
                    addHiddenDiv('ii_title', product.p_Product_FullName, newDiv);

                  }
                  addHiddenDiv('ii_productUrl', product.gbi_ParentProductPageUrl, newDiv);
                  if(product.p_Product_UPCNumber){
                    addHiddenDiv('ii_gtin', product.p_Product_UPCNumber, newDiv);
                  } else {
                    addHiddenDiv('ii_gtin',`${variant.upc_image[0]}`, newDiv); 
                  }
                  if(product.categories){
                    let categoryArray = [];
                    Object.values(product.categories[0]).forEach(cat => {
                      if(!categoryArray.includes(cat)){
                          categoryArray.push(cat);
                          addHiddenDiv('ii_category', cat, newDiv); 
                        }
                    })
                  } 

                      if(variant.upc_image){
                        addHiddenDiv('ii_image',`https://www.cvs.com/bizcontent/merchandising/productimages/large/${variant.upc_image[0]}`, newDiv); 
                        if(variant.upc_image.length > 1){
                          addHiddenDiv('ii_secondaryImageTotal',`${variant.upc_image.length - 1}`, newDiv); 
                          for(let j = 1; j < variant.upc_image.length; j++){
                            addHiddenDiv('ii_alternateImages',`https://www.cvs.com/bizcontent/merchandising/productimages/large/${variant.upc_image[j]}`, newDiv); 
                          }
                        }   
                      }

                      if(variant.p_Sku_ColorSwatch_URL){
                        addHiddenDiv('ii_colorRef',variant.p_Sku_ColorSwatch_URL, newDiv); 
                      }

                      if(variant.gbi_Price_Each){
                        let unit = variant.gbi_Price_Each
                        let unitSplit = unit.split("/")
                        if(unitSplit[0] && unitSplit[1]) {
                          addHiddenDiv('ii_unitPrice', unitSplit[0], newDiv); 
                          addHiddenDiv('ii_unitPriceUom', unitSplit[1], newDiv); 
                        }
                      }


                      if(variant.p_Product_Details){
                        let deets = variant.p_Product_Details;
                        const regex = /<li>(.*?)<\/li>/g
                        let bullets = deets.match(regex)
                        if(!bullets && deets.match(/<li>/g)){
                          
                          if(deets.match(/<li>(.*?)<\/ul>/g)){
                            bullets = deets.replace(/<li>/g, "</li><li>").match(regex)
                            let noLi = deets.replace(/<li>/g, "</li><li>").replace(regex, "")
                            if(noLi && bullets){
                              if(noLi.match(/<li>(.*?)<\/ul>/g)){
                                bullets.push(noLi.match(/<li>(.*?)<\/ul>/g)[0])
                              }
                            }
                          } else {
                            bullets = deets.replace(/<li>/g, "</li><li>").match(regex)
                            if(bullets.length){
                              bullets = bullets[0].match(regex)
                            }
                          }
                        }
                        deets = deets.replace(/<li>/g, ' @ ')
                        deets = deets.replace(/<\/li>/g, ' ')
                        deets = deets.replace(/<.+?>/g, ' ')
                        deets = deets.replace(/@\s+@/g, ' || ')
                        deets = deets.replace(/@/g, ' || ')
                        addHiddenDiv('ii_description', `${deets}`, newDiv); 
                        if(bullets){
                          addHiddenDiv('ii_descriptionBullets', `${bullets.length}`, newDiv); 
                          for(let i = 0; i < bullets.length; i++){
                            let newBullet = bullets[i].replace(/<\/?li>/g,' ').replace(/<.+?>/g, ' ')
                            addHiddenDiv('ii_additionalDescBulletInfo', `${newBullet}`, newDiv); 
                          }
                        }
                      }


 
                      if(htmlList[i]){
                        let deets = htmlList[i];
                        const regex = /<li>(.*?)li>/g
                        let bullets = deets.match(regex)
                        let manufText = '//div[@id="ii_manufHTML"]//div[contains(@class, "wc-fragment")]//*[not (contains(., "Is the information in this section helpful")) and not (contains(., "The information above is")) and not (contains(., ".wc"))]//text()[not(contains(.,"layout:")) and not(contains(.,".jpg")) and not(contains(.,".png"))]'
                        let text = "";
                        let bulletsHash = {};
                        var element = document.evaluate( manufText, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                        if(bullets){
                          bullets.forEach(bullet => {
                            let newBullet = bullet.replace(/<\/?li>/g,'').replace(/<.+?>/g, '').replace(/\\'/g, "'")
                            bulletsHash[newBullet] = 1;
                          })
                        }
                        
                          if( element.snapshotLength > 0 ) {
                            for(let i = 0; i < element.snapshotLength; i++) {
                              let option = element.snapshotItem(i).textContent
                              if(bullets){
                                debugger
                                if(bulletsHash[option]){
                                  text += ` || ${option}`
                                } else {
                                  text += ` ${option}`
                                }
                              } else {
                                text += ` ${option}`
                              }                             
                            }
                          }
                          addHiddenDiv('ii_manufDesc', text, newDiv);
                      }
 




                      if(variant.p_Product_Warnings){
                        let deets = variant.p_Product_Warnings;
                        const regex = /<li>(.*?)<\/li>/g
                        let bullets = deets.match(regex)
                        deets = deets.replace(/<li>/g, ' @ ')
                        deets = deets.replace(/<\/li>/g, ' ')
                        deets = deets.replace(/<.+?>/g, ' ')
                        deets = deets.replace(/@\s+@/g, ' || ')
                        deets = deets.replace(/@/g, ' || ')
                        // deets = deets.replace(/\"/g, " ");
                        addHiddenDiv('ii_warnings', `${deets}`, newDiv); 
                      }

                      if(variant.p_Product_Ingredients){
                        let deets = variant.p_Product_Ingredients;
                        const regex = /<li>(.*?)<\/li>/g
                        let bullets = deets.match(regex)
                        deets = deets.replace(/<li>/g, ' @ ')
                        deets = deets.replace(/<\/li>/g, ' ')
                        deets = deets.replace(/<.+?>/g, ' ')
                        deets = deets.replace(/@\s+@/g, ' || ')
                        deets = deets.replace(/@/g, ' || ')
                        addHiddenDiv('ii_ingredients', `${deets}`, newDiv); 
                        if(variant.p_Product_Ingredients.includes("Servings Per Container:")){
                          let ingHtml = variant.p_Product_Ingredients
                          addHiddenDiv('ii_ingredientHTML', ingHtml, newDiv, true); 
                          const nutrTerm = document.querySelectorAll(`div.TablerData tr`);
                          const termsWithValues = {};
                          let i = 1;
                          while (i < nutrTerm.length) {
                            if (nutrTerm[i]) {
                              let terms = nutrTerm[i].querySelectorAll('td')
                              if(terms[0] && terms[1]){
                                let name = terms[0].innerText.split("(")
                                termsWithValues[name[0]] = terms[1].innerText
                              }
                            }
                            i++;
                          }
                  
                          Object.keys(termsWithValues).forEach((term) => {
                            console.log(term);
                            addHiddenDiv(`ii_${term}`, termsWithValues[term], newDiv);
                          });
                        }
                      }


                      if(variant.p_Product_Directions){
                        let deets = variant.p_Product_Directions;
                        const regex = /<li>(.*?)<\/li>/g
                        deets = deets.replace(/<li>/g, ' @ ')
                        deets = deets.replace(/<\/li>/g, ' ')
                        deets = deets.replace(/<.+?>/g, ' ')
                        deets = deets.replace(/@\s+@/g, ' || ')
                        deets = deets.replace(/@/g, ' || ')
                        if(deets){
                          addHiddenDiv('ii_directions', `${deets}`, newDiv); 

                        }
                      }


                      addHiddenDiv('ii_id', variant.p_Sku_ID, newDiv);
                      skuArray.push(variant.p_Sku_ID);
                      addHiddenDiv('ii_quantity', variant.p_Sku_Size, newDiv);  
                      addHiddenDiv('ii_listPrice', variant.p_Product_Price, newDiv);              
                      addHiddenDiv('ii_weight', variant.p_Product_Weight, newDiv);              
                      addHiddenDiv('ii_reviewCount', variant.p_Product_Review, newDiv);   
                      if(variant.p_Promotion_Description){
                        addHiddenDiv('ii_promotion', variant.p_Promotion_Description, newDiv);  
                      } else if(variant.coupons.ceb[0]) {
                        if(variant.coupons.ceb[0].webDsc){
                          addHiddenDiv('ii_promotion', variant.coupons.ceb[0].webDsc, newDiv);  
                        }

                      }
                      addHiddenDiv('ii_price', variant.gbi_Actual_Price, newDiv);
                      addHiddenDiv('ii_numberOfServingsInPackage', variant.p_Vendor_Serving_Per_Container, newDiv);
                      addHiddenDiv('ii_servingSizeUom', variant.p_Vendor_Serving_Size_UOM, newDiv);
                      addHiddenDiv('ii_reviews', variant.p_Product_Review, newDiv);
                      if(variant.p_Product_Rating){
                        let rating = parseFloat(variant.p_Product_Rating)
                        let adjusted = rating.toPrecision(2)
                        addHiddenDiv('ii_rating', adjusted, newDiv);
                      }

                      if(variant.p_Vendor_Serving_Size){
                        addHiddenDiv('ii_servingSize', variant.p_Vendor_Serving_Size, newDiv);
                      } else if(variant.p_Product_Ingredients){
                        if(variant.p_Product_Ingredients.includes("Serving Size:")){
                          let info = variant.p_Product_Ingredients;
                          info = info.match(/<p>(.*?)<\/p>/g)
                          if(info[0]){
                            info = info[0].replace(/<.+?>/g, '')
                            let split = info.split(": ")
                            if(split[1]){
                              let newSplit = split[1].split(" ")
                              addHiddenDiv('ii_servingSizeUom', newSplit[1], newDiv);
                              addHiddenDiv('ii_servingSize', newSplit[0], newDiv);
                            }
                          }
                        }
                      }


                      if(variant.HIGH_RES_IMG_AVLBL !== "0"){
                        addHiddenDiv('ii_imageZoom', "Yes", newDiv);
                      }

                      if(stockArr){
                         if(variant.retail_only === "0" && stockArr[variant.p_Sku_ID] === 0){
                          addHiddenDiv('ii_availability', "Out of stock", newDiv);
                        } else if(variant.retail_only === "1"){
                          addHiddenDiv('ii_availability', "Only in stores", newDiv);
                        } else if(variant.retail_only === "0" && stockArr[variant.p_Sku_ID] === 1){
                          addHiddenDiv('ii_availability', "In Stock", newDiv);
                        }
                      }

                        const iframeImgPath = '//div[contains(@class, "wc-tour-container")]/@data-resources-base';
                        const imgJson = document.querySelector('div.wc-json-data');
                        var iframeImg = document.evaluate( iframeImgPath, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                        if(iframeImg.snapshotLength > 0 && imgJson) {
                          if(imgJson.innerText){
                            let text = imgJson.innerText;
                            if(text.includes("runtimeSrc")){
                              let textSplit = text.split("runtimeSrc:{src:");
                              if(textSplit[1]){
                                if(textSplit[1].includes("web.jpg")){
                                  let imgText = textSplit[1].split("web.jpg");
                                  let imgSrc = imgText[0] + "web.jpg"
                                  addHiddenDiv('ii_iframeImg', `${iframeImg.snapshotItem(0).textContent}${imgSrc}`, newDiv);
                                }
                              }
                            }
                          }
                        }
                      
                      
                      let metaKeywords = [product.title];
                      let packSizes = [];
                      let variantInfoArray = [];
          
                      if(variantOptions.length > 0){

                        variantOptions.forEach(option => {
                          let optionFirst = option.split(" ")

                          if(variant.p_Sku_Color){
                            addHiddenDiv('ii_color', variant.p_Sku_Color, newDiv);
                            if("p_Sku_Color".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_Color)){
                              variantInfoArray.push(variant.p_Sku_Color);
                            }
                          }

                          if(variant.p_Sku_Size){
                            if("p_Sku_Size".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_Size)){
                              variantInfoArray.push(variant.p_Sku_Size);
                            }
                          }
                          
                          if(variant.p_Sku_Group_Size){
                            if("p_Sku_Group_Size".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_Group_Size)){
                              variantInfoArray.push(variant.p_Sku_Group_Size);
                            }
                            packSizes.push(variant.p_Sku_Group_Size)
                          }
                          if(variant.p_Sku_Flavor){
                            if("p_Sku_Flavor".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_Flavor)){
                              variantInfoArray.push(variant.p_Sku_Flavor);
                            }                    
                          }
                          if(variant.p_Sku_Concern){
                            if("p_Sku_Concern".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_Concern)){
                              variantInfoArray.push(variant.p_Sku_Concern);
                            }
                          } 
                          if(variant.p_Sku_Form){
                            if("p_Sku_Form".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_Form)){
                              variantInfoArray.push(variant.p_Sku_Form);
                            }                
                          }
                          if(variant.p_Sku_Absorbency){
                            if("p_Sku_Absorbency".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_Absorbency)){
                              variantInfoArray.push(variant.p_Sku_Absorbency);
                            }
                          }
                          if(variant.p_Sku_Final_Look){
                            if("p_Sku_Final_Look".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_Final_Look)){
                              variantInfoArray.push(variant.p_Sku_Final_Look);
                            }
                          }
                          if(variant.p_Sku_Finish){
                            if("p_Sku_Finish".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_Finish)){
                              variantInfoArray.push(variant.p_Sku_Finish);
                            }
                          }
                          if(variant.p_Sku_Fragrance){
                            if("p_Sku_Fragrance".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_Fragrance)){
                              variantInfoArray.push(variant.p_Sku_Fragrance);
                            }
                          }
                          if(variant.p_Sku_Pack){
                            if("p_Sku_Pack".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_Pack)){
                              variantInfoArray.push(variant.p_Sku_Pack);
                            }
                            packSizes.push(variant.p_Sku_Pack)
                          }
                          if(variant.p_Sku_SPF){
                            if("p_Sku_SPF".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_SPF)){
                              variantInfoArray.push(variant.p_Sku_SPF);
                            }                    
                          }
                          if(variant.p_Sku_Scent){
                            if("p_Sku_Scent".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_Scent)){
                              variantInfoArray.push(variant.p_Sku_Scent);
                            }                    
                          }
                          if(variant.p_Sku_Strength){
                            if("p_Sku_Strength".includes(optionFirst[0]) && !variantInfoArray.includes(variant.p_Sku_Strength)){
                              variantInfoArray.push(variant.p_Sku_Strength);
                            }                   
                          }
                        })
                        if(variantInfoArray.length != variantOptions.length){
                          if(variant.p_Sku_Size){
                              variantInfoArray.push(variant.p_Sku_Size);
                          }
                        }
                      // } else {
                      //   if(variant.p_Sku_Group_Size){

                      //     variantInfoArray.push(variant.p_Sku_Group_Size);
                      //     packSizes.push(variant.p_Sku_Group_Size)
                      
                      //   }
                      //   if(variant.p_Sku_Flavor){
                      //     variantInfoArray.push(variant.p_Sku_Flavor);
                    
                      //   }
                      //   if(variant.p_Sku_Color){
                      //     addHiddenDiv('ii_color', variant.p_Sku_Color, newDiv);
                      //     variantInfoArray.push(variant.p_Sku_Color);
                     
                      //   }
                      //   if(variant.p_Sku_Concern){
                      //     variantInfoArray.push(variant.p_Sku_Concern);
                   
                      //   } 
                      //   if(variant.p_Sku_Form){
                      //     variantInfoArray.push(variant.p_Sku_Form);
                  
                      //   }
                      //   if(variant.p_Sku_Absorbency){
                      //     variantInfoArray.push(variant.p_Sku_Absorbency);
                      
                      //   }
                      //   if(variant.p_Sku_Final_Look){
                      //     variantInfoArray.push(variant.p_Sku_Final_Look);
                    
                      //   }
                      //   if(variant.p_Sku_Finish){
                      //     variantInfoArray.push(variant.p_Sku_Finish);
                    
                      //   }
                      //   if(variant.p_Sku_Fragrance){
                      //     variantInfoArray.push(variant.p_Sku_Fragrance);
                    
                      //   }
                      //   if(variant.p_Sku_Pack){
                      //     variantInfoArray.push(variant.p_Sku_Pack);
                      //     packSizes.push(variant.p_Sku_Pack)
                      
                      //   }
                      //   if(variant.p_Sku_SPF){
                      //     variantInfoArray.push(variant.p_Sku_SPF);
                      
                      //   }
                      //   if(variant.p_Sku_Scent){
                      //     variantInfoArray.push(variant.p_Sku_Scent);
                      
                      //   }
                      //   if(variant.p_Sku_Strength){
                      //     variantInfoArray.push(variant.p_Sku_Strength);
                     
                      //   }
                      }
                      
                      addHiddenDiv('ii_metaKeywords', variant.p_Sku_FullName, newDiv);

                      if(variant.gbi_CarePassEligible === "Y") {
                      addHiddenDiv('ii_shipping', 'Ships Free With CarePass', newDiv);
                      }   
                      let packResult = packSizes.join(" ") 
                      addHiddenDiv('ii_packSize', packResult, newDiv);  

                        if(variantInfoArray.length) {
                          let variantJoin = variantInfoArray.join(" | ")
                          addHiddenDiv('ii_variantInfo', variantJoin, newDiv);
                        }        
                  }
                }
          }
        }
      }, json.records, json.totalRecordCount, htmlList, stockArr, variantOptions);
    } else {
      throw new Error("notFound");
    }

    
    return await context.extract(productDetails, { transform: transformParam });

  },
};