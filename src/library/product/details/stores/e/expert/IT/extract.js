const { transform } = require('../IT/shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'expert',
    transform,
    domain: 'expertonline.it',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const productUrl = await context.evaluate(async () => {
    let url = window.location.href;
    return url;
  });
  
  let iframeLink=await context.evaluate(async () => {
    let iframeLink=null;
   let iframeSelector=document.querySelector('iframe#eky-dyson-iframe');
   if(iframeSelector){
    iframeLink=iframeSelector.getAttribute('src');
   }
   console.log('here is the iframe link '+iframeLink);
   return iframeLink;
 });
 let manufacturerDesc=[],manufacturerImages=[];

 
 if(iframeLink!==null){
  await context.goto(iframeLink, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
  await context.waitForXPath('//img');
 }

 manufacturerDesc=await context.evaluate(async (manufacturerDesc) => {

 function pushToEnhancedContent(textSelector,manufacturerDesc){
  for(let i=0;i<textSelector.length;i++){
    manufacturerDesc.push(textSelector[i].innerText);
  }
  return manufacturerDesc;
 }

  let textSelector1=document.querySelectorAll('div[class*="eky-header"] h2');
  let textSelector2=document.querySelector('div[class*="eky-header"] h3');
  let textSelector3=document.querySelectorAll('div[class*="eky-row"] h1');
  let textSelector4=document.querySelectorAll('div[class*="eky-row"] h2');
  let textSelector5=document.querySelectorAll('li[class*="eky-overlay-text"]');
  let textSelector6=document.querySelectorAll('div[class*="eky-accessory"]');
  let textSelector7=document.querySelectorAll('div[class*="eky-specs"]');

  if(textSelector1){
    manufacturerDesc=pushToEnhancedContent(textSelector1,manufacturerDesc);
  }
  if(textSelector2){
    manufacturerDesc=pushToEnhancedContent(textSelector2,manufacturerDesc);
  }
  if(textSelector3){
    manufacturerDesc=pushToEnhancedContent(textSelector3,manufacturerDesc);
  }
  if(textSelector4){
    manufacturerDesc=pushToEnhancedContent(textSelector4,manufacturerDesc);
  }
  if(textSelector5){
    manufacturerDesc=pushToEnhancedContent(textSelector5,manufacturerDesc);
  }
  if(textSelector6){
    manufacturerDesc=pushToEnhancedContent(textSelector6,manufacturerDesc);
  }
  if(textSelector7){
    manufacturerDesc=pushToEnhancedContent(textSelector7,manufacturerDesc);
  }
  console.log(manufacturerDesc+' is enhanced content');
  return manufacturerDesc;
},manufacturerDesc);


manufacturerImages=await context.evaluate(async (manufacturerImages) => {
  function pushToEnhancedContent(imageSelector,manufacturerImages){
   for(let i=0;i<imageSelector.length;i++){
     manufacturerImages.push(imageSelector[i].getAttribute('src'));
   }
   return manufacturerImages;
  }
 
   let imageSelector=document.querySelectorAll('img');
 
   if(imageSelector){
     manufacturerImages=pushToEnhancedContent(imageSelector,manufacturerImages);
   }
  //  console.log(manufacturerDesc+' is enhanced content');
   return manufacturerImages;
 },manufacturerImages);


await context.goto(productUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

    await context.evaluate(async (manufacturerDesc,manufacturerImages) => {
     
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      if(manufacturerDesc.length!==0){
        let enhancedContent="";
        for(let i=0;i<manufacturerDesc.length;i++){
          if(i!==manufacturerDesc.length-1)
            enhancedContent+=manufacturerDesc[i]+" || ";
          else
            enhancedContent+=manufacturerDesc[i];
        }
        addHiddenDiv('enhancedContent',enhancedContent);
      }
      if(manufacturerImages.length!==0){
        let aplusImages="";
        let iframeUrl= window.location.href;
        for(let i=0;i<manufacturerImages.length;i++){
          if(i!==manufacturerImages.length-1){
            if(manufacturerImages[i] && manufacturerImages[i].substring(0,6)==='images'){
            let tempUrl='https://media.flixfacts.com/eyekandy/dyson/v11/it/';
            tempUrl+=manufacturerImages[i];
            aplusImages+=tempUrl+" || ";}
          else
          {aplusImages+=manufacturerImages[i]+" || ";
            }
          }
          else{
            if(manufacturerImages[i] && manufacturerImages[i].substring(0,6)==='images'){
              let tempUrl='https://media.flixfacts.com/eyekandy/dyson/v11/it/';
              tempUrl+=manufacturerImages[i];
              aplusImages+=tempUrl;}
              else{
            aplusImages+=manufacturerImages[i];}
            }
        }
        addHiddenDiv('aplusImages',aplusImages);
      }
    },manufacturerDesc,manufacturerImages);

    
  await context.evaluate(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.log(error);
    }
    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await context.waitForSelector('script#productMicroData');
    } catch (error) {
      console.log(error);
    }

    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    function findJsonObj1 (scriptSelector) {
      try {
        const xpath = `//script[contains(.,'${scriptSelector}')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let jsonStr = element.textContent;
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);
      } catch (error) {
        console.log(error.message);
      }
    }

    function findJsonObj2 () {
      try {
        const xpath = '//script[contains(id,\'productMicroData\')]';
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let jsonStr = element.textContent;
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);
      } catch (error) {
        console.log(error.message);
      }
    }
    const str = '"@type":"Product"';
    let JSONArr;
    const JSONArr1 = findJsonObj1(str);
    const JSONArr2 = findJsonObj2();
    console.log(JSONArr, 'JSONArr');
    if (JSONArr1) {
      JSONArr = JSONArr1;
    } else if (JSONArr2) {
      JSONArr = JSONArr2;
    } else if (JSONArr1 && JSONArr2) {
      if (JSONArr1.length >= JSONArr2.length) {
        JSONArr = JSONArr1;
      } else if (JSONArr2.length >= JSONArr1.length) {
        JSONArr = JSONArr2;
      }
    }
    const offerText = JSONArr ? JSONArr.offers : '';
    let availabilityText = offerText ? offerText.availability : '';
    if (availabilityText.includes('OutOfStock')) {
      availabilityText = 'Out of Stock';
    } else {
      availabilityText = 'In Stock';
    }
    addHiddenDiv('availability', availabilityText);
    const gtin = JSONArr ? JSONArr.gtin13 : '';
    addHiddenDiv('gtin', gtin);
    const Sku = JSONArr ? JSONArr.sku : '';
    addHiddenDiv('Sku', Sku);
    // let sellerText = offer_text ? offer_text.seller : ''
    // let seller = sellerText ? sellerText.name : ''
    // addHiddenDiv('sellerName', seller);
    const RatingText = JSONArr ? JSONArr.aggregateRating : '';
    const reviewCount = RatingText ? RatingText.reviewCount : '';
    addHiddenDiv('reviewCount', reviewCount);
    let aggregateRating = RatingText ? RatingText.ratingValue : '';
    aggregateRating = aggregateRating ? Number(aggregateRating).toFixed(1) : '';
    console.log('aggregateRating: ', aggregateRating);
    addHiddenDiv('aggregateRating', aggregateRating.replace('.', ','));
    // let enhancedContent = document.querySelector('div#flix-inpage').innerHTML;
    // enhancedContent = enhancedContent ? enhancedContent.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
    // addHiddenDiv('li_enhancedContent', enhancedContent);
    const specTrs = document.querySelectorAll('#Dettaglio table tr');
    const finalSpecArr = [];
    let field;
    let value;
    for (let index = 0; index < specTrs.length; index++) {
      const element = specTrs[index];
      field = element.querySelector('td.tdSinistro');
      // @ts-ignore
      const fieldStr = field ? field.innerText : '';
      value = element.querySelector('td.tdDestro');
      // @ts-ignore
      const valueStr = value ? value.innerText : '';
      if (fieldStr && valueStr) {
        const fieldVal = fieldStr + ' : ' + valueStr;
        finalSpecArr.push(fieldVal);
      }
    }
    let finalSpecStr;
    if (finalSpecArr.length > 0) {
      finalSpecStr = finalSpecArr.join(' || ');
    }
    addHiddenDiv('ex_specification', finalSpecStr);
    const brand = JSONArr ? JSONArr.brand : '';
    console.log('brand: ', brand);
    const brandText = brand ? brand.name : '';
    console.log('brandText: ', brandText);
    addHiddenDiv('ex_brand', brandText);
    const descArr = [];
    let finalDes;
    const descriptionLi = document.querySelectorAll('div[class="skywalker_scheda_descrizione"] ul li');
    for (let index = 0; index < descriptionLi.length; index++) {
      const li = descriptionLi[index];
      // @ts-ignore
      const descTxt = li.innerText;
      descArr.push(descTxt);
    }
    if (descArr.length > 0) {
      finalDes = descArr.join(' || ');
      finalDes = '|| ' + finalDes;
    }
    addHiddenDiv('ex_description', finalDes);
  });

  try {
    await new Promise((resolve) => setTimeout(resolve, 6000));
  } catch (error) {
    console.log('error: ', error);
  }
  return await context.extract(productDetails, { transform });
}
