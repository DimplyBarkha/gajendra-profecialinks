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
    await new Promise(resolve => setTimeout(resolve, 10000));
    

    // async function gotoUrl(){
    //   const currentUrl = await context.evaluate(function() {
      
    //     return window.location.href;
    //   });
    //   console.log('ABOUT TO GO BACK???????????????????????????????????????????????????')
    //   await context.goto(currentUrl, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
    //   return currentUrl;
    // }

    // async function collectManuf() {
    //   const currentUrl = context.evaluate(function() {
    //     return window.location.href
    //   })
    //   await context.goto('https://scontent.webcollage.net/cvs/power-page?ird=true&channel-product-id=874110', { timeout: 20000, waitUntil: 'load', checkBlocked: true });
    //   var jsonText = await context.evaluate(function () {
    //     return document.querySelector('pre').innerText;
    //   });
    //   const findStr1 = 'html:';
    //   const startIdx1 = jsonText.indexOf(findStr1) + findStr1.length;
    //   const endIdx1 = jsonText.indexOf('var _wcscript');
    //   let text = (startIdx1 && startIdx1 > -1 && endIdx1 && endIdx1 > -1) ? jsonText.substr(startIdx1, endIdx1 - startIdx1) : 0;
    //   text = text.substr(0, text.indexOf('div>"')+5);
    //   console.log('END OF COLLECTMANUF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    //   await context.goto(currentUrl, { timeout: 20000, waitUntil: 'load', checkBlocked: true });

    //   return text;
    // }

    // await context.goto(currentUrl, { timeout: 20000, waitUntil: 'load', checkBlocked: true });





    var jsonText = await context.evaluate(function () {
      return document.body.innerText;
    });
    const json = JSON.parse(jsonText);
  
    if (json && json.records && json.totalRecordCount) {
      await context.evaluate(function (records, cnt, gotoUrl, collectManuf) {
        function addHiddenDiv (id, content, parentDiv = null) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          if (!content) content = '';
          newDiv.textContent = content;
          // newDiv.style.display = 'none';
          if (parentDiv) {
            parentDiv.appendChild(newDiv);
          } else {
            document.body.appendChild(newDiv);
          }
          return newDiv;
        }
        document.body.innerText = '';
        // const parentDiv = addHiddenDiv('ii_products', '');
        addHiddenDiv('totalRecordCount', cnt);
        addHiddenDiv('ii_url', window.location.href);
        // addHiddenDiv('ii_product', text);

        // for (let i = 0; i < records.length; i++) {
          
          if (records[0].allMeta) {
            const product = records[0].allMeta;
            if (product) {
              if(product.variants.length){
                // debugger
                for(let i = 0; i < product.variants.length; i++){
                  
                const newDiv = addHiddenDiv(`ii_product`, `${i}`);
                

                // collectManuf
                // gotoUrl

                addHiddenDiv('ii_brand', product.ProductBrand_Brand, newDiv);
                addHiddenDiv('ii_title', product.title, newDiv);
                addHiddenDiv('ii_productUrl', product.gbi_ParentProductPageUrl, newDiv);
                addHiddenDiv('ii_category', product.categories);  
                
                const variant = product.variants[i].subVariant[0];
                    if(variant.upc_image.length){
                      // debugger
                      addHiddenDiv('ii_image',`https://www.cvs.com/bizcontent/merchandising/productimages/large/${variant.upc_image[0]}`, newDiv); 
                      
                      if(variant.upc_image.length > 1){
                        addHiddenDiv('ii_imageAlt',`https://www.cvs.com/bizcontent/merchandising/productimages/large/${variant.upc_image[1]}`, newDiv); 
                        addHiddenDiv('ii_secondaryImageTotal',`${variant.upc_image.length - 1}`, newDiv); 
                        for(let j = 1; j < variant.upc_image.length; j++){
                          addHiddenDiv('ii_alternateImages',`https://www.cvs.com/bizcontent/merchandising/productimages/large/${variant.upc_image[j]}`, newDiv); 
                        }
                      }   
                    }
                    addHiddenDiv('ii_id', variant.p_Sku_ID, newDiv);
                    addHiddenDiv('ii_packSize', variant.p_Sku_Size, newDiv);              
                    addHiddenDiv('ii_additionalDescBulletInfo', variant.gbi_Product_Details, newDiv); 
                    addHiddenDiv('ii_listPrice', variant.p_Product_Price, newDiv);              
                    addHiddenDiv('ii_ingredients', variant.p_Product_Ingredients, newDiv);              
                    addHiddenDiv('ii_weight', variant.p_Product_Weight, newDiv);              
                    addHiddenDiv('ii_directions', variant.p_Product_Directions, newDiv);              
                    addHiddenDiv('ii_warnings', variant.p_Product_Warnings, newDiv);              
                    addHiddenDiv('ii_reviewCount', variant.p_Product_Review, newDiv);              
                    addHiddenDiv('ii_promotion', variant.p_Promotion_Description, newDiv);  
                    addHiddenDiv('ii_price', variant.gbi_Actual_Price, newDiv);

                    addHiddenDiv('ii_servingSize', variant.p_Vendor_Serving_Size, newDiv);
                    addHiddenDiv('ii_numberOfServingsInPackage', variant.p_Vendor_Serving_Per_Container, newDiv);
                    addHiddenDiv('ii_servingSizeUom', variant.p_Vendor_Serving_Size_UOM, newDiv);
                    // addHiddenDiv('ii_price', variant.gbi_Actual_Price, newDiv);

                    if(variant.CAREPASS_INDICATOR === "ELIGIBLE") {
                    addHiddenDiv('ii_shipping', 'Ships Free With CarePass', newDiv);
                    }
                    
                    // debugger
                    // addHiddenDiv('ii_image', variant.BV_ImageUrl, newDiv);
                    addHiddenDiv('ii_reviews', variant.p_Product_Review, newDiv);
                    addHiddenDiv('ii_rating', variant.p_Product_Rating, newDiv);
                    if (variant.gbi_Badge_Sponsored && variant.gbi_Badge_Sponsored === true) { addHiddenDiv('ii_sponsored', 'Sponsored', newDiv); }
                }
              }
            
          }
        }
      }, json.records, json.totalRecordCount);
    }

    // const html = await context.evaluate(async function getDataFromUrl() {
    //   console.log('getDataFromUrl');
    //   const redirectUrl = 'https://scontent.webcollage.net/cvs/power-page?ird=true&channel-product-id=874110'
    //   let response = await fetch(redirectUrl, {
    //     referrerPolicy: 'no-referrer-when-downgrade',
    //     // body: null,
    //     method: 'GET',
    //     mode: 'cors',
    //     headers: {
    //       "Content-Type": "application/json"        }
    //   })
    //   // if (response && response.status === 404) {
    //   //   console.log('Product Not Found!!!!');
    //   //   return '';
    //   // }
    //   if (response ) {
    //     console.log('Product Found!!!!');
    //     const data = await response;
    //     debugger
    //     return data;
    //   }
    // });


    return await context.extract(productDetails, { transform: transformParam });

  },
};