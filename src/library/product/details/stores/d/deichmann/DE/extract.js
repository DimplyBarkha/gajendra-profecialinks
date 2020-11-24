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
    await context.evaluate(async () =>{
      //@ts-ignore
      if(document.querySelector(".open-size-selector"))
        document.querySelector(".open-size-selector").click();
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));

      var variant = "";
      if(document.querySelector(".size-selection") != null){
        if(document.querySelector(".size-selection").querySelector(".active-element") != null){
          if(document.querySelector(".size-selection").querySelector(".active-element").querySelector("span").querySelector("div")) document.querySelector(".size-selection").querySelector(".active-element").querySelector("span").querySelector("div").remove();
        variant = (document.querySelector(".size-selection").querySelector(".active-element").querySelector("span") != null ? document.querySelector(".size-selection").querySelector(".active-element").querySelector("span").innerText : "");
        }
      }
      var variants = "";
      if(document.querySelector(".size-selection") != null){
        if(document.querySelector(".size-selection").querySelectorAll("ul").length > 1){
          document.querySelector(".size-selection").querySelectorAll("ul")[1].querySelectorAll("li").forEach(x => {
            if(x){ 
              if(x.querySelector("span").querySelector("div")) x.querySelector("span").querySelector("div").remove();
            variants += "<p>" + x.querySelector("span").textContent + "</p>";
            }
          })
    }
    }
    if(document.querySelector(".size-selection") != null){
      if(document.querySelector(".size-selection").querySelector(".active-element") != null){
      if(document.querySelector(".size-selection").querySelector(".active-element").querySelector("span") != null)
        document.querySelector(".size-selection").querySelector(".active-element").querySelector("span").click();
      }
    }

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.innerHTML = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
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
        addHiddenDiv("document_productId",productID);
        const sku = x.sku;
        addHiddenDiv("document_sku",sku);
        const url = window.location.href;
        addHiddenDiv("document_url",url);
        addHiddenDiv("document_variants",variants);
        addHiddenDiv("document_variant",variant);
      }
    })

    await context.extract(productDetails, { transform });
  },
};
