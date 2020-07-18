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
  
    if (json && json.records && json.totalRecordCount > 0) {

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

        await new Promise(resolve => setTimeout(resolve, 1000));

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
            return fetch(`https://scontent.webcollage.net/cvs/power-page?ird=true&channel-product-id=${variants[i]}`)
            .then(response => response.text())
          }, variants, i);
          await new Promise(resolve => setTimeout(resolve, 1000));
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      await context.goto(currentUrl, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
      await new Promise(resolve => setTimeout(resolve, 2000));

      await context.evaluate(function (records, cnt, htmlList) {        
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

                  addHiddenDiv('ii_totalRecordCount', product.variants.length - 1, newDiv);

                  addHiddenDiv(`ii_manufHTML`, htmlList[i], newDiv, true);
                  addHiddenDiv(`ii_imageAlt`, product.title, newDiv, true);


                  addHiddenDiv('ii_brand', product.ProductBrand_Brand, newDiv);
                  if(variant.product_title_desktop){
                    addHiddenDiv('ii_title', variant.product_title_desktop, newDiv);
                    addHiddenDiv('ii_metaKeywords', `Buy ${variant.product_title_desktop} and enjoy FREE SHIPPING on most orders from CVS Pharmacy. Shop now to stock up on essentials, see coupons, deals, and get the best price!`, newDiv);

                  } else {
                    addHiddenDiv('ii_title', product.p_Product_FullName, newDiv);
                    addHiddenDiv('ii_metaKeywords', `Buy ${product.p_Product_FullName} and enjoy FREE SHIPPING on most orders from CVS Pharmacy. Shop now to stock up on essentials, see coupons, deals, and get the best price!`, newDiv);

                  }
                  addHiddenDiv('ii_productUrl', product.gbi_ParentProductPageUrl, newDiv);
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
                          addHiddenDiv('ii_imageAlt',`https://www.cvs.com/bizcontent/merchandising/productimages/large/${variant.upc_image[1]}`, newDiv); 
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
                        deets = deets.replace(/<li>/g, ' @ ')
                        deets = deets.replace(/<\/li>/g, ' ')
                        deets = deets.replace(/<.+?>/g, ' ')
                        deets = deets.replace(/@\s+@/g, ' || ')
                        deets = deets.replace(/@/g, ' || ')
                        addHiddenDiv('ii_description', `${deets}`, newDiv); 
                        if(bullets){
                          addHiddenDiv('ii_descriptionBullets', `${bullets.length}`, newDiv); 
                          for(let i = 0; i < bullets.length; i++){
                            let newBullet = bullets[i].replace(/<\/?li>/g,' ')
                            // addHiddenDiv('ii_description', `${newBullet}`, newDiv); 
                            addHiddenDiv('ii_additionalDescBulletInfo', `${newBullet}`, newDiv); 
                          }
                        }
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
                  
                        if(variant.p_Product_Ingredients.includes("% Daily Value")){
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
                        // let split = deets.split("||  ||")
                        // deets = split.join("||")
                        if(deets){
                          if(deets.includes("Questions?")){
                            let deetSplit = deets.split("Questions")
                            addHiddenDiv('ii_directions', `${deetSplit[0]}`, newDiv); 
                          } else{
                            addHiddenDiv('ii_directions', `${deets}`, newDiv); 
                          }
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
                      
                      if(variant.retail_only === "0" && variant.stock_level === "0"){
                        addHiddenDiv('ii_availability', "Out of stock", newDiv);
                      } else if(variant.retail_only === "1"){
                        addHiddenDiv('ii_availability', "Only in stores", newDiv);
                      } else if(variant.retail_only === "0" && variant.stock_level !== "0"){
                        addHiddenDiv('ii_availability', "In Stock", newDiv);
                      }
                      
                      
                      let metaKeywords = [product.title];
                      let packSizes = [];
                      let variantInfoArray = [];
                      if(variant.p_Sku_Color){
                        addHiddenDiv('ii_color', variant.p_Sku_Color, newDiv);
                        variantInfoArray.push(variant.p_Sku_Color);
                   
                      }
                      // if(variant.p_Sku_Size){
                      //   addHiddenDiv('ii_variantInfo', variant.p_Sku_Size, newDiv);
                      //   if(!product.title.includes(variant.p_Sku_Size)){
                      //     metaKeywords.push(variant.p_Sku_Size)
                      //   }
                      // }
                      if(variant.p_Sku_Group_Size){
                        variantInfoArray.push(variant.p_Sku_Group_Size);
                        packSizes.push(variant.p_Sku_Group_Size)
                    
                      }
                      if(variant.p_Sku_Flavor){
                        variantInfoArray.push(variant.p_Sku_Flavor);
                  
                      }
                      if(variant.p_Sku_Flavor){
                        variantInfoArray.push(variant.p_Sku_Flavor);
                   
                      }
                      if(variant.p_Sku_Concern){
                        variantInfoArray.push(variant.p_Sku_Concern);
                 
                      } 
                      // else {
                      //   addHiddenDiv('ii_variantInfo', variant.p_Sku_Size, newDiv);
                      // }
                      if(variant.p_Sku_Form){
                        variantInfoArray.push(variant.p_Sku_Form);
                
                      }
                      if(variant.p_Sku_Absorbency){
                        variantInfoArray.push(variant.p_Sku_Absorbency);
                    
                      }
                      if(variant.p_Sku_Final_Look){
                        variantInfoArray.push(variant.p_Sku_Final_Look);
                  
                      }
                      if(variant.p_Sku_Finish){
                        variantInfoArray.push(variant.p_Sku_Finish);
                  
                      }
                      if(variant.p_Sku_Fragrance){
                        variantInfoArray.push(variant.p_Sku_Fragrance);
                  
                      }
                      if(variant.p_Sku_Pack){
                        variantInfoArray.push(variant.p_Sku_Pack);
                        packSizes.push(variant.p_Sku_Pack)
                    
                      }
                      if(variant.p_Sku_SPF){
                        variantInfoArray.push(variant.p_Sku_SPF);
                    
                      }
                      if(variant.p_Sku_Scent){
                        variantInfoArray.push(variant.p_Sku_Scent);
                    
                      }
                      if(variant.p_Sku_Strength){
                        variantInfoArray.push(variant.p_Sku_Strength);
                   
                      }
                      // let meta = metaKeywords.join(' ');
                      // addHiddenDiv('ii_metaKeywords', variant.p_Sku_FullName, newDiv);


                      if(variant.gbi_CarePassEligible === "Y") {
                      addHiddenDiv('ii_shipping', 'Ships Free With CarePass', newDiv);
                      }   
                      let packResult = packSizes.join(" ") 
                      addHiddenDiv('ii_packSize', packResult, newDiv);  

                      if(product.variants.length > 1){
                        if(variantInfoArray.length) {
                          let variantJoin = variantInfoArray.join(" | ")
                          addHiddenDiv('ii_variantInfo', variantJoin, newDiv);
                        } else {
                          addHiddenDiv('ii_variantInfo', variant.p_Sku_Size, newDiv);
                        }
                      }
                    
                  }
                }
          }
        }
      }, json.records, json.totalRecordCount, htmlList);
    } else {
      throw new Error("notFound");
    }

    
    return await context.extract(productDetails, { transform: transformParam });

  },
};