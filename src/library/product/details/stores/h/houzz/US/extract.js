async function implementation(
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    try{
      document.querySelector("li[class='hzui-tabs__label   ']").click();
    }catch(err){
      console.log(err)
    }
    
  });
  await context.evaluate(async function () {
    function findLabel(productObj, label) {
      const value = productObj[label];
      if (Array.isArray(value)) {
        return {
          label: value.reduce((prevVal, currentVal) => {
            return prevVal ? prevVal + "," + currentVal : currentVal;
          }, ""),
        };
      } else if (value) {
        return { label: value };
      }
      return null;
    }
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement("div");
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = "none";
      document.body.appendChild(newDiv);
    }
    function findAndInsertLabel(obj, labelName, outputName) {
      const result = findLabel(obj, labelName);
      if (result != null) {
        addHiddenDiv("ii_" + outputName, result.label);
      }
    }
    function clickXpath (xpath) {
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // @ts-ignore
      element && element.click();
    }
    function findXpath (xpath) {
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const productDetails = element && element.textContent ? element.textContent : '';
      return productDetails;
    }
    await clickXpath('//button[@aria-controls="productDescription"] | //li[@data-component="product_description"]')
    await new Promise(resolve => setTimeout(resolve, 1000));

    try{
    if(document.querySelector("div[class*='vp-redesign-description']") != null){
      var descr = document.querySelector("div[class*='vp-redesign-description']").innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/gm, ' ').trim()
    }else{
      var descr = document.querySelector('div[id*="productDescription"]').innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/gm, ' ').trim()
    }}catch(e){
      console.log(e)
    }

    const arrayBullets =  []
    const additiona = document.querySelectorAll(".description-item") ? document.querySelectorAll(".description-item") : [];

    additiona.forEach(item => {
      arrayBullets.push(item.innerText);
    });

    addHiddenDiv('ii_bullets_info', arrayBullets.join(' || '));

    if(document.querySelector(".description-item") != null){
      var bullet = document.querySelectorAll(".description-item").length
    }else{
      var bullet = 0
    }


    await clickXpath('//button[@aria-controls="productSpecification"] | //li[@data-component="product_specs"]')
    await new Promise(resolve => setTimeout(resolve, 1000));

    try{
    if(document.querySelector("dl[class*='product-specs-group ']") != null){
      var specific = document.querySelector("dl[class*='product-specs-group ']").innerHTML.replace(/<\/dd.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/gm, ' ').trim()
    }else{
      var specific = document.querySelector('dl[class*="product-specs-group mtl mb0"]').innerHTML.replace(/<\/dd.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/gm, ' ').trim()
    }}catch(e){
      console.log(e)
    }

    const seller = findXpath("//div[contains(@class,'product-spec-item') and contains(.,'Sold By')]//dd");
    const lbb = seller.toLowerCase().includes('houzz') ? 'No' : 'Yes';
    if (lbb === 'Yes') {

      addHiddenDiv('ii_otherSellerName', seller);

    }
    
    if (specific != null){
      addHiddenDiv("ii_content",specific)
    }

    var imagesCount = document.getElementsByClassName("alt-images__thumb")
    if (imagesCount != null){
      if(imagesCount.length != 0){
        addHiddenDiv("ii_imageCount",imagesCount.length-1)
      }else{
        addHiddenDiv("ii_imageCount",0)
      }
      
    }

    try{
      var title = document.getElementsByClassName("hz-view-product-title")[0].innerText
      var updated_title  = title.replace(/(\r\n|\n|\r)/gm, "")
    }catch(err){
      console.log(err)
    }

    if (updated_title != null){
      addHiddenDiv("ii_title",updated_title)
    }
    // @ts-ignore
    try{
      var img_url= document.getElementsByClassName("zoom-pane-image")[0].style.backgroundImage.split('"')[1]
      addHiddenDiv("ii_image_url",img_url)
    }catch(err){
      console.log(err)
    }
    
    const jsonString = document.querySelector(
      "script[type='application/ld+json']"
    ).innerText;


    let jsonParsed = {};
    if (jsonString && jsonString.trim()) {
      jsonParsed = JSON.parse(jsonString);
      try{
        findAndInsertLabel(jsonParsed[0], "image", "image");
      }catch(err){
        console.log(err)
        };

      try{
        findAndInsertLabel(jsonParsed[0], "category", "category");
      }catch(err){
        console.log(err)
        };

      try{
        findAndInsertLabel(jsonParsed[0], "name", "nameExtended");
      }catch(err){
        console.log(err)
        };
      try{
        findAndInsertLabel(jsonParsed[0], "description", "description");
      }catch(err){
        console.log(err)
        };

      try{
        findAndInsertLabel(jsonParsed[0], "sku", "sku");
      }catch(err){
        console.log(err)
        };
      try{
        findAndInsertLabel(jsonParsed[0], "mpn", "mpc");
      }catch(err){
        console.log(err)
        };
      try{
        findAndInsertLabel(jsonParsed[0], "material", "material");
      }catch(err){
        console.log(err)
        };

      try{
        findAndInsertLabel(jsonParsed[0], "color", "color");

      }catch(err){
        console.log(err)
        };
      try{
        findAndInsertLabel(jsonParsed[0].weight, "description", "weightNet");

      }catch(err){
        console.log(err)
        };
      try{
        findAndInsertLabel(jsonParsed[0].manufacturer, "name", "manufacturer");
      }catch(err){
        console.log(err)
        };
      try{
        findAndInsertLabel(jsonParsed[0], "productID", "variantId");
      }catch(err){
        console.log(err)
        };

        
      try{
        findAndInsertLabel(jsonParsed[0], "url", "productURL");
      }catch(err){
        console.log(err)
        };

      try{
        addHiddenDiv("ii_bulletcount",bullet);
      }catch(err){
        console.log(err)
      };
      try{
        addHiddenDiv("ii_fulldescription","Product Description"+descr);
      }catch(err){
        console.log(err)
      };
    }
  });
  return await context.extract(productDetails, { transform });
}
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "US",
    store: "houzz",
    transform: cleanUp,
    domain: "houzz.com",
    zipcode: "",
  },
  implementation,
};
