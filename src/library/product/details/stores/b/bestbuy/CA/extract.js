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
    await context.evaluate(async function () {
      let description = document.querySelector('div[itemprop="description"]');
      // @ts-ignore
      description = description ? description.innerText : '';
      let descArr = [];
      // @ts-ignore
      if(description !== ''){
        descArr.push(description);
      }
      let moreInfoBtn = document.querySelector('div#moreInfo');
      // @ts-ignore
      moreInfoBtn = moreInfoBtn ? moreInfoBtn.click() : '';
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
      //------------------------------------------------------------
     let detailsAndSpecs = document.querySelector('button#detailsAndSpecs');
     // @ts-ignore
     detailsAndSpecs = detailsAndSpecs ? detailsAndSpecs.click() : '';
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
     let netWeight = document.querySelectorAll('div.itemContainer_RJI-h div.itemName_jGrp0');
     let netWeightTxt = '';
     for (let index = 0; index < netWeight.length; index++) {
       const element = netWeight[index];
       // @ts-ignore
       let elementTxt = element.innerText;
       if((elementTxt === 'Weight') || (elementTxt==='Weight (lbs)')){
        // @ts-ignore
        netWeightTxt = element.nextSibling.innerText;
        console.log('netWeight: ', netWeightTxt);
       }
     }
     addElementToDocument('bb_weightNet', netWeightTxt);
     //-----------------------------------------------------------------
     let color = document.querySelectorAll('div.itemContainer_RJI-h div.itemName_jGrp0');
     let colorTxt = '';
     for (let index = 0; index < color.length; index++) {
       const element = color[index];
       // @ts-ignore
       let elementTxt = element.innerText;
       if(elementTxt === 'Colour'){
        // @ts-ignore
        colorTxt = element.nextSibling.innerText;
        console.log('colorTxt: ', colorTxt);
       }
     }
     addElementToDocument('bb_colour', colorTxt);
     //---------------------------------------------------------------
     let dimension = document.querySelectorAll('div.itemContainer_RJI-h div.itemName_jGrp0');
     let dimensionTxtField = '';
     let dimensionTxtFieldVal = '';
     let dimensionTxt = '';
     let dimensionTxtArr =[];
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
     }
     addElementToDocument('bb_dimension', dimensionTxtArr.join(' | '));
     //----------------------------------------------------------------
    //  await new Promise((resolve) => setTimeout(resolve, 3000));
    //   const element = document.getElementById('div.container_2uRCr');
    //   if (element) {
    //     element.scrollIntoView({ behavior: 'smooth' });
    //     await new Promise((resolve) => setTimeout(resolve, 2197));
    //   }
    //  let warranty = document.querySelectorAll('div.itemContainer_RJI-h div.itemName_jGrp0');
    //  let warrantyTxtField = '';
    //  let warrantyTxtFieldVal = '';
    //  let warrantyTxt = '';
    //  let warrantyTxtArr =[];
    //  for (let index = 0; index < warranty.length; index++) {
    //    const element = warranty[index];
    //    // @ts-ignore
    //    let elementTxt = element.innerText;
    //    console.log('elementTxt warranty: ', elementTxt);
    //    if((elementTxt === "Manufacturer's Warranty - Parts")||(elementTxt === "Manufacturer's Warranty - Labour")){
    //     // @ts-ignore
    //     warrantyTxtField = element.innerText;
    //     // @ts-ignore
    //     warrantyTxtFieldVal = element.nextSibling.innerText;
    //     warrantyTxt = warrantyTxtField+' : '+warrantyTxtFieldVal;
    //     warrantyTxtArr.push(warrantyTxt);
    //    }
    //  }
    //  addElementToDocument('bb_warranty', warrantyTxtArr.join(' | '));
     //-----------------------------------------------------------------
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
     //------------------------------------------------------------------------------
     let otherInfoArr = [];
     let otherInfo = document.querySelector('button#whatsIncluded');
     // @ts-ignore
     otherInfo = otherInfo ? otherInfo.click() : '';
     let otherInfoTxt = document.querySelectorAll('div#whatsIncluded ul li');
     for (let index = 0; index < otherInfoTxt.length; index++) {
       // @ts-ignore
       const element = otherInfoTxt[index].innerText;
       otherInfoArr.push(element);
     }
     // @ts-ignore
     otherInfoArr = otherInfoArr.join(' | ');
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
