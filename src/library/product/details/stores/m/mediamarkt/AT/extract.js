const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.at',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    SharedHelpers: 'module:product/details/stores/${store[0:1]}/${store}/helpersShared',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails, Helpers, SharedHelpers }) => {
    const sharedhelpers = new SharedHelpers(context);
    
    await context.waitForFunction(function (sel) {
      return Boolean(document.querySelector(sel));
    }, { timeout: 15000 }, 'body');

    await sharedhelpers.autoScroll();
    try {
      await context.waitForSelector('div#flix-inpage', { timeout: 65000 });
      await context.waitForSelector('div[id^="flixinpage_"]', { timeout: 65000 });
      await context.waitForSelector('div#inpage-iframe-modal', { timeout: 65000 });
    } catch (error) {
      console.log('No manufacturer content');
    }

    const avail = await sharedhelpers.getEleByXpath('//button[contains(text(), "In den Warenkorb")]');

    await sharedhelpers.addHiddenInfo('ii_availText', avail ? 'In Stock' : 'Out of Stock');
    try{     
      await context.waitForSelector('button[class*=ProductFeatures] span');
      await context.click('button[class*=ProductFeatures] span');
    }catch(err){
      console.log('no load more button for specification');
    }
    await context.evaluate(function () {
      
      if(document.querySelector('div[data-test="mms-accordion-features"] a[class*="ProductFeatures__StyledExpand"]')){
        let accordionClicker=document.querySelector('div[data-test="mms-accordion-features"] a[class*="ProductFeatures__StyledExpand"]');
        accordionClicker.click();
      }
      if(document.querySelector('div[class*="ProductFeatures__StyledFeatureContainer"]')){
        let specsData=document.querySelectorAll('div[class*="ProductFeatures__StyledFeatureContainer"] table tbody td');
        let specsAppended='';
        for(let i=0;i<specsData.length;i++){
          if(i!==specsData.length-1)
            specsAppended+=specsData[i].innerText+" || ";
          else
            specsAppended+=specsData[i].innerText;
        }
        let newDiv = document.createElement('div');
        newDiv.id = 'specs';
        newDiv.textContent = specsAppended;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
//div[contains(@class,'ProductFeatures__StyledFeatureContainer')]//table//tbody//td//text()
        
      if (document.querySelector('div[class^="ProductFeatures"] a[class^="Linkstyled"]')) {
        document.querySelector('div[class^="ProductFeatures"] a[class^="Linkstyled"]').click();
      }
    });


    // let moreInfoSelector=null;
    // moreInfoSelector=await context.evaluate(async function () {
    // if(document.querySelector('section img[alt="DYSON"]')){
    //   let moreInfoSpan=document.querySelector('section img[alt="DYSON"]');
    //   moreInfoSpan.click();
    //   return (document.querySelector('section img[alt="DYSON"]'));
    //   }
    //   else
    //     return null;
    // });

    await context.evaluate(async function () {
      if(document.querySelector('section img[alt="DYSON"]')){
        let moreInfoSpan=document.querySelector('section img[alt="DYSON"]');
        moreInfoSpan.click();
        await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        }

        // let playBtn=document.querySelector('div[id="player"] button[class*="play-button"]');
        // playBtn.click();
      });
    
        try{
        await context.waitForSelector('div[class*="flix-std-row"]', { timeout: 95000 });
        //div[@id="player"]//button[contains(@class,'play-button')|//div[contains(@class,'ProductDescription')]//iframe
        
        }catch(e){console.log('videos not loaded')}
    // if(moreInfoSelector!==null){
    //   // await context.waitForSelector
    //   // try{
    //   // await context.waitForSelector('div[class*="flix-std-row"]', { timeout: 95000 });
    //   // }catch(e){}
    //   await context.evaluate(async function () {
    //     let enhancedContent="";
    //   let flixRows=document.querySelectorAll('div[class*="flix-std-row"]');
    //   for(let i=0;i<flixRows.length;i++){
    //       if(flixRows[i].querySelector('div[class*="flix-std-title"]')){
    //       enhancedContent+=flixRows[i].querySelector('div[class*="flix-std-title"]').innerText+" || ";}
    //       if(flixRows[i].querySelector('div[class*="flix-std-desc"]')){
    //       enhancedContent+=flixRows[i].querySelector('div[class*="flix-std-desc"]').innerText+" || ";}
    //   }
    //   console.log(enhancedContent);
    //   function addHiddenDiv (id, content) {
    //     const newDiv = document.createElement('div');
    //     newDiv.id = id;
    //     newDiv.textContent = content;
    //     newDiv.style.display = 'none';
    //     document.body.appendChild(newDiv);
    //   }
    //   addHiddenDiv('enhancedContent',enhancedContent);
    //   });
    // }
      
    await context.extract(productDetails, { transform: transformParam });
  },
};
