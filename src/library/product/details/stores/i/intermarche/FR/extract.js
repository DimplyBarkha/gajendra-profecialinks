const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'intermarche',
    transform,
    domain: 'intermarche.com',
    zipcode: '',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 10000));
    try{
      await context.evaluate(async function(){
      let cookieButton = document.querySelector('.didomi-popup-view .didomi-popup-close.didomi-no-link-style');
      if(cookieButton){
        cookieButton.click();
      }
    });
    }
    catch(error){
      console.log('cookie button not found',error.message);
    }
    try{
      await context.waitForSelector('div[class*="ProductGeneralInfoContainer"]',{timeout:80000});
    }
    catch(error){
      console.log('Page not loaded',error.message);
      await context.evaluate(async () => {
      let maxTime = 120000;
      let currTime = 0;
      let waitForSel = 'div[class*="ProductGeneralInfoContainer"]';
      let loaderElm = document.querySelectorAll(waitForSel);
      async function stallOut ( ms ) {
      return new Promise((resolve, reject) => {
      setTimeout(() => {
      console.log('waiting!! for ' + ms + ' millisecs');
      resolve();
      }, ms);
      });
      }
      while(loaderElm.length === 0) {
      console.log('we do not have the prod div still');
      await stallOut(3000);
      currTime = currTime + 3000;
      loaderElm = document.querySelectorAll(waitForSel);
      if(currTime > maxTime) {
      console.log('already waited for ' + currTime + ' ms - still the prod is not loaded');
      break;
      }
      }
      loaderElm = document.querySelectorAll(waitForSel);
      if(loaderElm.length === 0) {
      console.log('still prod is not there');
      } else {
      console.log('prod is there');
      }
      });
    }
    await context.evaluate(function (parentInput) {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      let prodUrl = window.location.href.split("product/")
      if (prodUrl[1]) {
        addHiddenDiv(`ii_url`, prodUrl[1]);
      }
      addHiddenDiv(`ii_parentInput`, parentInput);

    }, parentInput);
   

    // const dataRaw = await context.evaluate(function () {
    //   fetch('https://api.intermarche.com/produits/v2/pdvs/11833/produits/0000040198125', {
    //     method: 'GET',
    //     headers: {
    //       'Accept':'application/json, text/plain, */*',
    //       'X-Red-Device':'red_fo_desktop',
    //       'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
    //       'X-Red-Version':'1',
    //       'Sec-Fetch-Site':'same-site'
    //     }
    //   })
    //   .then(response => response.json())
    //   .then(data => {
    //     if(data.url){
    //       console.log("Failed !!!!!!!!!!!!!!!!!!!!")
    //       // return context.reportBlocked(lastResponseData.code, 'CodeAction decided extractor got blocked');
    //     }else{
    //       debugger
    //       console.log('Success:', data);
    //     }
    //   })
    //   .catch((error) => {
    //       console.error('Error:', error);
    //   });
    // });


    // await new Promise(resolve => setTimeout(resolve, 10000));

    return await context.extract(productDetails, { transform: transformParam });
  },
};

