const { transform } = require("../../../../shared");
module.exports = {
  implements: "product/search/extract",
  parameterValues: {
    country: "US",
    store: "houzz",
    transform: transform,
    domain: "houzz.com",
    zipcode: "",
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await new Promise(resolve => setTimeout(resolve, 10000));
    await context.evaluate(() => {
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      if (
        document.querySelector(
          ".btn.btn-none.hz-universal-search-header-tip__dismiss"
        ) != null
      ) {
        try{
          document.querySelector(".btn.btn-none.hz-universal-search-header-tip__dismiss").click();
        }catch(err){
          console.log(err)
        }
        
      }
      if (
        document.querySelector(
          "body > div.hz-modal.hz-modal--dark > div.hz-trap-focus.hz-modal__container > div > div.hz-modal__body > div > div.hz-international-redirect-modal__btns > div.hz-international-redirect-modal__continue-btn > button"
        ) != null
      ) {
        try{
          document
          .querySelector(
            "body > div.hz-modal.hz-modal--dark > div.hz-trap-focus.hz-modal__container > div > div.hz-modal__body > div > div.hz-international-redirect-modal__btns > div.hz-international-redirect-modal__continue-btn > button"
          )
          .click();
        }catch(err){
          console.log(err)
        }

      }
      let scrollTop =500;
      while (true) {
        window.scroll(0, scrollTop);
        stall(500);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }

      function getElementByXpath (xpath)  {
          const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          console.log('Element' + element);
          const text = element ? element.textContent : null;
          return text;
      
      }

      try{
        let jsonString =  getElementByXpath('//div[@data-vm-context="bpr_qv"]/div/no-script');
        var jsonParsed = JSON.parse(jsonString);
        try{
          var json_list = jsonParsed.itemListElement;
        }catch(e){
          let jsonString =  getElementByXpath('//div[@data-vm-context="bpr_qv"]/div/script');
          var jsonParsed = JSON.parse(jsonString); 
          var json_list = jsonParsed.itemListElement;       
        }
      }catch(e){
        console.log(e)
      }





      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        const originalDiv = document.querySelectorAll(
          ".hz-product-card__image-container"
        )[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      try{
        var maf = document.querySelectorAll('span[data-compid*="manufacturer"] span')
        var manufacture = []
        maf.forEach(item => {
        const name = item.textContent.replace("by ",'')
        manufacture.push(name)
        })
      }catch(err){
        console.log(err)
      }

      var link = document.getElementsByClassName("hz-product-card__link")
      var temp = 0
      if (link != null){
        for (let i = 0; i < link.length; i++) {
          console.log("Loop is working");
          var single_obj = json_list[temp];
          var url_web = single_obj.url;
          addHiddenDiv("ii_produrl", url_web, temp);
          const searchURL = window.location.href.split("?")[0]
          addHiddenDiv("ii_searchURL", searchURL, temp);
          try{
            addHiddenDiv("ii_manufacture",manufacture[temp],temp)
          }catch(e){
            console.log(e)
          }
          temp++;
        }
      }

    });
    return await context.extract(productDetails, { transform });
  }
}

