const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    transform,
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
    const buttonSelector = 'button#detailsAndSpecs';
    await context.click(buttonSelector);
    await context.waitForXPath('//h3[text()="Warranty"]/parent::div/following-sibling::div');
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
    //  let detailsAndSpecs = document.querySelector('button#detailsAndSpecs');
     // @ts-ignore
    //  detailsAndSpecs = detailsAndSpecs ? detailsAndSpecs.click() : '';
     let detailsAndSpecsTextArr = [];
     let warrantyTextArr = [];
     let detailsAndSpecsText = document.querySelectorAll('div.itemContainer_RJI-h');
     for (let index = 0; index < detailsAndSpecsText.length; index++) {
       let field = detailsAndSpecsText[index].querySelector('div.itemName_jGrp0');
       let specs = detailsAndSpecsText[index].querySelector('div.itemValue_341-l');
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
     let dimension = document.querySelectorAll('div.itemContainer_RJI-h div.itemName_jGrp0');
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
       if(elementTxt === 'Colour'){
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
     const buttonSelector1 = 'button#moreInfo';
     await context.click(buttonSelector1);
     await context.waitForSelector('div.productDescription_ujYCD ul li');
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
      // @ts-ignore
      if(description !== ''){
        descArr.push(description);
      }
      // let moreInfoBtn = document.querySelector('div#moreInfo');
      // // @ts-ignore
      // moreInfoBtn = moreInfoBtn ? moreInfoBtn.click() : '';
      let bulletsDescription = document.querySelectorAll('div.productDescription_ujYCD ul li');
      let bulletCount = bulletsDescription.length;
      addElementToDocument('bb_descriptionBulletsCount', bulletCount);
      for (let index = 0; index < bulletsDescription.length; index++) {
        let element = bulletsDescription[index];
        // @ts-ignore
        element = element ? element.innerText : '';
        descArr.push(element);
      }
      // @ts-ignore
      descArr = descArr.join(' || ');
      addElementToDocument('bb_descriptionBullets', descArr);
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
     const buttonSelector2 = 'button#whatsIncluded';
     await context.click(buttonSelector2);
     await context.waitForSelector('div#whatsIncluded ul li');
     await context.evaluate(async function () {
     let otherInfoArr = [];
     let otherInfo = document.querySelector('button#whatsIncluded');
     // @ts-ignore
     otherInfo = otherInfo ? otherInfo.click() : '';
     let otherInfoTxt = document.querySelectorAll('div#whatsIncluded ul li');
     for (let index = 0; index < otherInfoTxt.length; index++) {
       // @ts-ignore
       const element = otherInfoTxt[index].innerText;
       otherInfoArr.push(" | "+element);
     }
     // @ts-ignore
     otherInfoArr = otherInfoArr.join('');
     addElementToDocument('bb_productOtherInformation', otherInfoArr);
     //------------------------------------------------------------------------------
     function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
   });
   
    return await context.extract(productDetails, { transform });
  },
};
