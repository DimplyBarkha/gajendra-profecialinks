const { transform } = require("../format");

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'deichmann',
    transform,
    domain: 'deichmann.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
            break;
          }
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    var variantLength = await context.evaluate(async () => {
      if(document.querySelector(".open-size-selector"))
        document.querySelector(".open-size-selector").click();
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      return (document.querySelector(".size-selection") ? document.querySelector(".size-selection").querySelectorAll("ul")[1].querySelectorAll("li.active-element").length : 0);
    });
    
    if (variantLength > 1) {
      for (let j = 0; j < variantLength; j++) {
    
    await context.evaluate(async (j) =>{
      var productId = 0;
      var isDisabled = false;
      if(document.querySelector("#document_ratingValue"))
        document.querySelector("#document_ratingValue").remove();
      if(document.querySelector("#document_reviewCount"))
        document.querySelector("#document_reviewCount").remove();
      if(document.querySelector("#document_manufacturer"))
        document.querySelector("#document_manufacturer").remove();
      if(document.querySelector("#document_productId")){
        productId = Number(document.querySelector("#document_productId").innerHTML);
        document.querySelector("#document_productId").remove();
      }
      if(document.querySelector("#document_sku"))
        document.querySelector("#document_sku").remove();
      if(document.querySelector("#document_url"))
        document.querySelector("#document_url").remove();
      if(document.querySelector("#document_variants"))
        document.querySelector("#document_variants").remove();
      if(document.querySelector("#document_variant"))
        document.querySelector("#document_variant").remove();
      if(document.querySelector("#document_type"))
        document.querySelector("#document_type").remove();
      
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.innerHTML = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        function addHiddenDiv1 (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
      //@ts-ignore
      if(document.querySelector(".open-size-selector"))
        document.querySelector(".open-size-selector").click();
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      
      if(document.querySelector(".size-selection") != null){
        if(document.querySelector(".size-selection").querySelectorAll("ul").length > 1 != null){
        if(document.querySelector(".size-selection").querySelectorAll("ul")[1].querySelectorAll("li.active-element")[j].querySelector("span") != null)
          document.querySelector(".size-selection").querySelectorAll("ul")[1].querySelectorAll("li.active-element")[j].querySelector("span").click();
          if(j > 0){
            if(document.querySelector(".size-selection").querySelectorAll("ul")[1].querySelectorAll("li.active-element")[j].querySelector("span").className.indexOf("disabled") > -1){
              isDisabled = true;
            }
          }
        }
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      var variant = "";
      if(document.querySelector(".size-selection") != null){
        if(document.querySelector(".size-selection").querySelector(".active-element") != null){
          if(document.querySelector(".size-selection").querySelector(".active-element").querySelector("span").querySelector("div")) document.querySelector(".size-selection").querySelector(".active-element").querySelector("span").querySelector("div").remove();
        //variant = (document.querySelector(".size-selection").querySelector(".active-element").querySelector("span") != null ? document.querySelector(".size-selection").querySelector(".active-element").querySelector("span").innerText : "");
        variant = (document.querySelector(".size-selection").querySelectorAll("ul").length > 1) ? document.querySelector(".size-selection").querySelectorAll("ul")[1].querySelectorAll("li.active-element")[j].querySelector("span").innerText : "";
        }
      }
      if(document.querySelector(".size-selection") != null){
        if(document.querySelector(".size-selection").querySelector(".size-system") != null){
          if(document.querySelector(".size-selection").querySelector(".size-system").querySelector(".active") != null){
            var arrText = (document.querySelector(".size-selection").querySelector(".size-system").querySelector(".active").innerHTML).split(" ");
            var text  = (variant).trim();
            arrText.forEach(x => {
              if(x != "" && x != "EU" && x != "(EU)" && x != "UK" && x != "(UK)")
                text += ":" + x;
            })
            addHiddenDiv1("document_type",text);
          }
        }
      }
      
      var variants = "";
      if(document.querySelector(".size-selection") != null){
        if(document.querySelector(".size-selection").querySelectorAll("ul").length > 1){
          document.querySelector(".size-selection").querySelectorAll("ul")[1].querySelectorAll("li.active-element").forEach(x => {
            if(x){ 
              if(x.querySelector("span").querySelector("div")) x.querySelector("span").querySelector("div").remove();
            variants += "<p>" + x.querySelector("span").textContent + "</p>";
            }
          })
    }
    }
    

      
      if(document.getElementById("product-schema")){
        var x = JSON.parse(document.getElementById("product-schema").innerHTML);
        const ratingValue = x.aggregateRating.ratingValue
        addHiddenDiv("document_ratingValue",ratingValue);
        const reviewCount = x.aggregateRating.reviewCount
        addHiddenDiv("document_reviewCount",reviewCount);
        const mName = x.manufacturer.name;
        addHiddenDiv("document_manufacturer",mName);
        const productID = x.productID;
        // if(isDisabled == false)
          addHiddenDiv("document_productId",productID);
        // else
          // addHiddenDiv("document_productId",productId + 1);
        const sku = x.sku;
        addHiddenDiv("document_sku",sku);
        const url = window.location.href;
        addHiddenDiv("document_url",url);
        addHiddenDiv("document_variants",variants);
        addHiddenDiv("document_variant",variant);
      }
    },j)
    if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
  }
}
    await context.extract(productDetails, { transform });
  },
};
