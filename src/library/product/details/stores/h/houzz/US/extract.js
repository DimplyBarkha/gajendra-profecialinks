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
    try{
      var content = document.getElementsByClassName("hzui-tabs__content")[0].innerText;
    }catch(err){
      console.log(err)
    }
    
    try{
      var updated_content  = content.replace(/(\r\n|\n|\r)/gm, "").replace("See All SpecificationsReport incorrect information or image")
    }catch(err){
      console.log(err);
    }
    
    if (updated_content != null){
      addHiddenDiv("ii_content",updated_content)
    }

    var imagesCount = document.getElementsByClassName("alt-images__thumb")
    if (imagesCount != null){
      if(imagesCount.length != 0){
        addHiddenDiv("ii_imageCount",imagesCount.length)
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
        addHiddenDiv("ii_bulletcount",jsonParsed[0].description.split("\r\n-").length-1);
      }catch(err){
        console.log(err)
      };
      try{
        addHiddenDiv("ii_fulldescription","Product Description"+jsonParsed[0].description.replaceAll("-",""));
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
