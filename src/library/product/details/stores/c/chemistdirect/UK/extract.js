const { transform } = require('../format')


async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 10000) {
        await stall(1000);
        scrollTop += 250;
        window.scroll(0, scrollTop);
        if (scrollTop === 10000) {
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
  
  var url = await context.evaluate(async ()=> {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      GlobalE.ShippingSwitcher.Show()
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      var gle_selectedCountry = document.querySelector("#gle_selectedCountry");
      gle_selectedCountry.value = "GB";
      GlobalE.ShippingSwitcher.SaveAndClose();
      return window.location.href;
    }); 
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll("div.mobile-hidden div.cd-product-kits-opts a")) ? document.querySelectorAll("div.mobile-hidden div.cd-product-kits-opts a").length || 1 : 1;
  });
  var skuIds = "";
  if (variantLength > 0) {
    for (let j = 0; j < variantLength; j++) {
      if (variantLength > 1) {
      var nextSkuUrl =  await context.evaluate(async (j) => {
            if(document.querySelectorAll("div.mobile-hidden div.cd-product-kits-opts a")[j].getAttribute("href") != null)
              return 'https://www.chemistdirect.co.uk/' + document.querySelectorAll("div.mobile-hidden div.cd-product-kits-opts a")[j].getAttribute("href");
          return null;
        }, j); 
        if(nextSkuUrl != null)
        await context.goto(nextSkuUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
      var skuId =  await context.evaluate(async (j) => {
          function addHiddenDiv(id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.innerHTML = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }
           return window.universal_variable.product.id;
        },j);

        skuIds +=  "<p>" + skuId + "</p>";
      }

    }

    for (let j = 0; j < variantLength; j++) {
      if(j == 0){
        await context.goto(url, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
      }
      if (variantLength > 1) {
      var nextSkuUrl =  await context.evaluate(async (j) => {
            if(document.querySelectorAll("div.mobile-hidden div.cd-product-kits-opts a")[j].getAttribute("href") != null)
              return 'https://www.chemistdirect.co.uk/' + document.querySelectorAll("div.mobile-hidden div.cd-product-kits-opts a")[j].getAttribute("href");
          return null;
        }, j); 
        if(nextSkuUrl != null)
        await context.goto(nextSkuUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
      }
  await applyScroll(context);
  var r = await context.evaluate(async (skuIds) => {
    let URL = window.location.href;
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.innerHTML = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    addHiddenDiv("document_variants",skuIds);
    const result = [];
    const reviews = document.querySelectorAll('#reviews li a');
    const descriptions = document.querySelectorAll("div.cd-tabs div.cd-product-tabs");
    if(!window.universal_variable.product){
      return null;
    }
    //@ts-ignore
    const manufacturer = window.universal_variable.product.manufacturer;

    addHiddenDiv("document_manufacturer", manufacturer);
    addHiddenDiv("document_url", window.location.href);

    // select query selector and loop and add div
    for (let i = 0; i < reviews.length; i++) {
      //@ts-ignore

      var descriptionData = "";
      var descriptionUl = "";
      var childNodes = descriptions[i].childNodes;
      childNodes.forEach(x => {
        console.log(x,reviews[i].innerText.replace(" ","").replace(" ","").replace(" ",""));
        
        if(descriptionData == undefined){
          descriptionData = "";
        }
        if(x.localName == "ul"){
          descriptionUl = "";
          x.childNodes.forEach(y => {
            if( y.innerHTML != undefined){
            if(descriptionUl == "")
            descriptionUl = y.innerHTML;
            else
            descriptionUl += " || " + y.innerHTML;
            }
          })
          descriptionData += " " + descriptionUl;
        }
        else{
          descriptionData += x.innerText;
        }
        descriptionData = descriptionData.replace("undefined","");
      })
      addHiddenDiv(reviews[i].innerText.replace(" ","").replace(" ","").replace(" ","") , descriptionData);
    }
    return result;
  },skuIds);

  if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
}
}
if(r != null){
  return await context.extract(productDetails, { transform });
}
else{
  return await context.extract("");
}
}


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'chemistdirect',
    transform,
    domain: 'chemistdirect.co.uk',
    zipcode: '',
  },implementation
};
