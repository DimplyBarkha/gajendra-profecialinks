const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    transform: transform,
    domain: 'bestbuy.ca',
    zipcode: '',    
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const {url, id } = inputs;
    if (id) {
      // eslint-disable-next-line no-inner-declarations
      async function firstItemLink () {
        return await context.evaluate(function () {
          let firstItem = document.querySelector('a[itemprop="url"]');
          firstItem = firstItem ? firstItem.href : '';
          return firstItem;
        });
      }
    }
    await context.evaluate(async function () {
      const buttonSelector = 'button#detailsAndSpecs';
      let available = document.querySelector(buttonSelector);
      // @ts-ignore
      available = available ? available.click() : '';
    });
    try {
      await context.waitForXPath('//h3[text()="Warranty"]/parent::div/following-sibling::div');
    } catch (error) {
      console.log("Warranty element not found");
    }
    await context.evaluate(async function () {
      
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
     let detailsAndSpecsTextArr = [];
     let warrantyTextArr = [];
     let detailsAndSpecsText = document.querySelectorAll('div.itemContainer_20kXj');
     for (let index = 0; index < detailsAndSpecsText.length; index++) {
       let field = detailsAndSpecsText[index].querySelector('div.itemName_37zd4');
       let specs = detailsAndSpecsText[index].querySelector('div.itemValue_XPfaq');
       // @ts-ignore
       let fieldSpec = field.innerText + ' : '+specs.innerText;
       if(fieldSpec.includes("Warranty")){
        warrantyTextArr.push(fieldSpec);
       }
       detailsAndSpecsTextArr.push(fieldSpec);
     }
     // @ts-ignore
     warrantyTextArr = warrantyTextArr.join(' | ');
     addElementToDocument('bb_warranty', warrantyTextArr);
     // @ts-ignore
     detailsAndSpecsTextArr = detailsAndSpecsTextArr.join(' || ');
     addElementToDocument('bb_specifications', detailsAndSpecsTextArr);
     //---------------------------------------------------------------
     let dimension = document.querySelectorAll('div.smallSizeContainer_1UtWF div.itemContainer_20kXj');
     let dimensionTxtField = '';
     let originTxtField = '';
     let dimensionTxtFieldVal = '';
     let originTxtFieldVal = '';
     let dimensionTxt = '';
     let originTxt = '';
     let dimensionTxtArr =[];
     let originTxtArr=[];
     let netWeightTxt = '';
     let colorTxt = '';
     for (let index = 0; index < dimension.length; index++) {
       const element = dimension[index];
       // @ts-ignore
       let elementTxt = element.innerText;
       if((elementTxt === 'Width')||(elementTxt === 'Height') || (elementTxt === 'Depth')|| (elementTxt === 'Width (Inches)') || (elementTxt === 'Height (Inches)') || (elementTxt === 'Depth (Inches)')){
        // @ts-ignore
        dimensionTxtField = element.innerText;
        // @ts-ignore
        dimensionTxtFieldVal = element.nextSibling.innerText;
        dimensionTxt = dimensionTxtField+' : '+dimensionTxtFieldVal;
        dimensionTxtArr.push(dimensionTxt);
       }
       if((elementTxt === 'Country of Origin')){
        // @ts-ignore
        originTxtField = element.innerText;
        // @ts-ignore
        originTxtFieldVal = element.nextSibling.innerText;
        originTxtArr.push(originTxtFieldVal);
       }
       if((elementTxt === 'Weight') || (elementTxt==='Weight (lbs)')){
        // @ts-ignore
        netWeightTxt = element.nextSibling.innerText;
       }
       if((elementTxt === 'Colour') || (elementTxt === 'Band Colour')){
        // @ts-ignore
        colorTxt = element.nextSibling.innerText;
       }
     }
     addElementToDocument('bb_colour', colorTxt);
     addElementToDocument('bb_weightNet', netWeightTxt);
     addElementToDocument('bb_countryOfOrigin', originTxtArr.join(' | '));
     addElementToDocument('bb_dimension', dimensionTxtArr.join(' | '));
    });
     //-----------------------------------------------------------------
     await context.evaluate(async function () {
      const buttonSelector1 = 'button#moreInfo';
      let available = document.querySelector(buttonSelector1);
      // @ts-ignore
      available = available ? available.click() : '';
     });
     try {
     await context.waitForSelector('div.productDescription_1F7nr');
     } catch (error) {
       console.log("Product description not loaded");
     }
     await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
     let description = document.querySelector('div[itemprop="description"]');
      // @ts-ignore
      description = description ? description.innerText : '';
      let descArr = [];
      let additionalBulletInfo = [];
      // @ts-ignore
      if(description !== ''){
        descArr.push(description);
      }
      let bulletsDescription = document.querySelectorAll('div.productDescription_1F7nr ul li');
      console.log('bulletsDescription: ', bulletsDescription);
      let bulletCount = bulletsDescription.length;
      if(bulletsDescription.length !== 0){
        bulletCount = bulletsDescription.length;
        for (let index = 0; index < bulletsDescription.length; index++) {
          let element = bulletsDescription[index];
          // @ts-ignore
          element = element ? element.innerText.replace(/•/, '') : '';
          descArr.push(element);
          additionalBulletInfo.push(element);
        }
        addElementToDocument('bb_descriptionBulletsCount', bulletCount);
        // @ts-ignore
      descArr = descArr.join(' | ');
      addElementToDocument('bb_descriptionBullets', descArr);
      addElementToDocument('bb_addDescriptionBulletsInfo', additionalBulletInfo.join(' | '));
      }
      let count = 0;

      if(bulletsDescription.length == 0){
        bulletsDescription = document.querySelectorAll('div.productDescription_1F7nr p');
        bulletCount = bulletsDescription.length;
        // if(bulletsDescription.length == 1){
        //   addElementToDocument('bb_descriptionBulletsCount', bulletsDescription);
        // }
        for (let index = 0; index < bulletsDescription.length; index++) {
          let element = bulletsDescription[index];
          // @ts-ignore
          element = element ? element.innerText.replace(/•/, ' | ') : '';
          // @ts-ignore
          if(element.includes(' | ')){
            additionalBulletInfo.push(element);
           count++;
          }
          
          descArr.push(element);
        }

      let desc = descArr.join(' ');
      // @ts-ignore
      descArr = descArr.join(' ');
      addElementToDocument('bb_descriptionBullets', descArr);

      addElementToDocument('bb_descriptionBulletsCount', count);
      addElementToDocument('bb_addDescriptionBulletsInfo', additionalBulletInfo.join(' | '));
      console.log('count: ', count);
      }
      
    });
      //------------------------------------------------------------
      // await context.waitForSelector('img[class="middle_1qXv8"]');
      await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
     let videoLinkArr = [];
     let videos = document.querySelectorAll('img[class="middle_1qXv8"]');
     for (let index = 0; index < videos.length; index++) {
       // @ts-ignore
       let element = videos[index];
       element = element.previousElementSibling;
       // @ts-ignore
       element = element ? element.src : '';
       console.log('element: ', element);
       // @ts-ignore
       if(element.includes('https://i1.ytimg.com/vi/')){
       // @ts-ignore
       let videoLink = element.replace(/https:\/\/i1\.ytimg\.com\/vi\/(.*)\/default.jpg/,'$1');
       videoLink = 'https://www.youtube.com/watch?v='+videoLink+'&feature=youtu.be';
       videoLinkArr.push(videoLink)
       }
     }
     // @ts-ignore
     videoLinkArr = videoLinkArr.join(' | ');
     addElementToDocument('bb_videos', videoLinkArr);
    });
     //------------------------------------------------------------------------------
    //  await context.evaluate(async function () {
    //   const buttonSelector2 = 'button#whatsIncluded';
    //   let available = document.querySelector(buttonSelector2);
    //   // @ts-ignore
    //   available = available ? available.click() : '';
    //  });
    //  try {
    //    await context.waitForSelector('div#whatsIncluded ul li');
    //  } catch (error) {
    //   console.log("whatsIncluded description not loaded");
    //  }
     //------------------------------------------------------------------------
    //  await context.evaluate(async function () {
    //  let otherInfoArr = [];
    //  let otherInfo = document.querySelector('button#whatsIncluded');
    //  // @ts-ignore
    //  otherInfo = otherInfo ? otherInfo.click() : '';
    //  let otherInfoTxt = document.querySelectorAll('div#whatsIncluded ul li');
    //  for (let index = 0; index < otherInfoTxt.length; index++) {
    //    // @ts-ignore
    //    const element = otherInfoTxt[index].innerText;
    //    otherInfoArr.push(" | "+element);
    //  }
    //  // @ts-ignore
    //  otherInfoArr = otherInfoArr.join('');
    //  addElementToDocument('bb_productOtherInformation', otherInfoArr);
     //------------------------------------------------------------------------------
    //    function addElementToDocument (key, value) {
    //     const catElement = document.createElement('div');
    //     catElement.id = key;
    //     catElement.textContent = value;
    //     catElement.style.display = 'none';
    //     document.body.appendChild(catElement);
    //   }
    //  });
   
    return await context.extract(productDetails, { transform });
  },
};
