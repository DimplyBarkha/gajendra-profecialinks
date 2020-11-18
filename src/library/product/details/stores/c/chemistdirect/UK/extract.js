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
  await context.evaluate(async ()=> {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      GlobalE.ShippingSwitcher.Show()
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      var gle_selectedCountry = document.querySelector("#gle_selectedCountry");
      gle_selectedCountry.value = "GB";
      GlobalE.ShippingSwitcher.SaveAndClose();
    }); 
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll("div.mobile-hidden div.cd-product-kits-opts a")) ? document.querySelectorAll("div.mobile-hidden div.cd-product-kits-opts a").length || 1 : 1;
  });
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
      }
  await applyScroll(context);
  await context.evaluate(async (j) => {
      
      

    let URL = window.location.href;
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.innerHTML = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const result = [];
    const reviews = document.querySelectorAll('#reviews li a');
    const descriptions = document.querySelectorAll("div.cd-tabs div.cd-product-tabs");
    //@ts-ignore
    const manufacturer = window.universal_variable.product.manufacturer;

    addHiddenDiv("document_manufacturer",manufacturer);

    // select query selector and loop and add div
    for (let i = 0; i < reviews.length; i++) {
      //@ts-ignore
      addHiddenDiv(reviews[i].innerText.replace(" ","").replace(" ","").replace(" ","") , descriptions[i].innerHTML);
    }
    return result;
  },j);

  if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
}
}

  return await context.extract(productDetails, { transform });
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
