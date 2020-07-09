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
    
    // const linkURL = await context.evaluate(function () {
    //   const element = document.querySelector('div.css-1dbjc4n.r-18u37iz.r-tzz3ar a');
    //   const elementSelector = 'div.css-1dbjc4n.r-18u37iz.r-tzz3ar a'
    //   if (element) {
    //     // return element.href;
    //     return [elementSelector, element.href];
    //   } else {
    //     return null;
    //   }
    // });

    // https://www.cvs.com/shop/american-crew-styling-gel-prodid-1013504
    // https://www.cvs.com/shop/american-crew-styling-gel-prodid-1013504

    // if(linkURL === null) {
    //   throw new Error("notFound");
    // }
    // await context.goto(linkURL[1], { timeout: 30000, waitUntil: 'load', checkBlocked: true });

    // await context.click(linkURL[0])

    // const urlTest = await context.evaluate(function(linkURL) {
    //   let currentUrl = window.location.href;
    //   let urlFromLink = linkURL[1]
    //   if(currentUrl === urlFromLink){
    //     return true;
    //   } else{
    //     return false
    //   }
    // }, linkURL)
    // if(!urlTest){
    //   await context.goto(linkURL[1], { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    // }
    var jsonText = await context.evaluate(function () {
      return document.body.innerText;
    });
    const json = JSON.parse(jsonText);
  
    if (json && json.records && json.totalRecordCount) {
      await context.evaluate(function (records, cnt) {
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
        
        // for (let i = 0; i < records.length; i++) {
          
          if (records[0].allMeta) {
            const product = records[0].allMeta;
            if (product) {
              if(product.variants.length){
                // debugger
                for(let i = 0; i < product.variants.length; i++){
                  
                const newDiv = addHiddenDiv(`ii_product`, `${i}`);
                addHiddenDiv('ii_brand', product.ProductBrand_Brand, newDiv);
                addHiddenDiv('ii_title', product.title, newDiv);
                addHiddenDiv('ii_productUrl', product.gbi_ParentProductPageUrl, newDiv);
                addHiddenDiv('ii_category', product.categories);  
                
                const variant = product.variants[i].subVariant[0];
                // addHiddenDiv('ii_image', variant.upc_image[0], newDiv);    
                // debugger          
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
                    if(variant.CAREPASS_INDICATOR === "ELIGIBLE") {
                    addHiddenDiv('ii_shipping', 'Ships Free With CarePass', newDiv);
                    }
                    
                    // debugger
                    addHiddenDiv('ii_image', variant.BV_ImageUrl, newDiv);
                    addHiddenDiv('ii_reviews', variant.p_Product_Review, newDiv);
                    addHiddenDiv('ii_rating', variant.p_Product_Rating, newDiv);
                    if (variant.gbi_Badge_Sponsored && variant.gbi_Badge_Sponsored === true) { addHiddenDiv('ii_sponsored', 'Sponsored', newDiv); }
                }
              }
            
          }
        }
      }, json.records, json.totalRecordCount);
    }


    return await context.extract(productDetails, { transform: transformParam });

  },
};