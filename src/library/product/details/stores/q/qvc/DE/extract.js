const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll("ul[aria-label='Auswahl'] li:not([state='disabled'])")) ? document.querySelectorAll("ul[aria-label='Auswahl'] li:not([state='disabled'])").length : 0;
  });
  console.log('Length', variantLength);
  async function preparePage (index, variantLength) {


    // const checkExistance = async (selector) => {
    //   return await context.evaluate(async (currentSelector) => {
    //     return await Boolean(document.querySelector(currentSelector));
    //   }, selector);
    // };
    
    const productUrl = await context.evaluate(async () => {
      let url = window.location.href;
      return url;
    });

     
     let iframeLink=await context.evaluate(async () => {
       let iframeLink=null;
      let accordionTitles=document.querySelectorAll('a[class*="accordionTitle"]');
      let contentAccordion=null;
      for(let i=0;i<accordionTitles.length;i++){
         if(accordionTitles[i].textContent.includes('Produktdetails von'))   contentAccordion=accordionTitles[i];
        }
        contentAccordion.click();
      let iframeSelector=document.querySelector('iframe#loadbeeIframeId');
      if(iframeSelector){
       iframeLink=iframeSelector.getAttribute('src');
      }
      console.log('here is the iframe link '+iframeLink);
      return iframeLink;
    });

    let manufacturerDesc=[],manufacturerImages=[];

    // if (await checkExistance(document.querySelector('iframe#loadbeeIframeId'))) {
    if(iframeLink!==null){
    await context.goto(iframeLink, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
    await context.waitForXPath('//img');

    
    manufacturerDesc=await context.evaluate(async (manufacturerDesc) => {
      let textSelector1=document.querySelector('div[class="header-title"] span');
      let textSelector2=document.querySelectorAll('div[class="pic-text"] div:nth-child(2)');
      let textSelector3=document.querySelectorAll('table[class="table table-striped"] tr td');
      if(textSelector1){
      manufacturerDesc.push(textSelector1.innerText);
    }
      if(textSelector2){
      for(let i=0;i<textSelector2.length;i++){
        manufacturerDesc.push(textSelector2[i].innerText);
      }
    }
    if(textSelector3){
      for(let i=0;i<textSelector3.length;i++){
        manufacturerDesc.push(textSelector3[i].innerText);
      }
    }
      return manufacturerDesc;
    },manufacturerDesc);


    manufacturerImages=await context.evaluate(async (manufacturerImages) => {
      let imageSelector=document.querySelectorAll('img');
      for(let i=0;i<imageSelector.length;i++){
        manufacturerImages.push(imageSelector[i].getAttribute('src'));
      }
      return manufacturerImages;
    },manufacturerImages);
    }

  
    await context.goto(productUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

    await context.evaluate(async (index, variantLength,manufacturerDesc,manufacturerImages) => {
      console.log('index of variant', index);
     
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
        for(let i=0;i<manufacturerImages.length;i++){
          if(i!==manufacturerImages.length-1)
            aplusImages+=manufacturerImages[i]+" || ";
          else
            aplusImages+=manufacturerImages[i];
        }
        addHiddenDiv('aplusImages',aplusImages);
      }
      // Video API call
      var element = (document.querySelectorAll("div[class='videoThumbnails'] > div[class*='video']")) ? document.querySelectorAll("div[class='videoThumbnails'] > div[class*='video']") : null;
      const link = [];
      const promiseLink = [];
      for (let i = 0; i < element.length; i++) {
        const id = element[i].getAttribute('data-video-id').trim();
        const url = 'https://d2q1b32gh59m9o.cloudfront.net/player/config?callback=qvcde37083458&client=qvcde&type=vod&apiKey=3Zq6Qf7Nl4Xz2Ve0Zv8Ns7El8Fp1Qi&videoId=' + id + '&format=jsonp&callback=qvcde37083458';
        const value = fetch(url).then(response => {
          return response.text();
        });
        promiseLink.push(value);
      }
      await Promise.all(promiseLink).then((value) => {
        value.forEach((value) => {
          value.match(/"mp4":"(.*?)"/) && value.match(/"mp4":"(.*?)"/)[1] && link.push(value.match(/"mp4":"(.*?)"/)[1].replace(/\\/gm, ''));
        });
      });
      console.log('links', link, link.length);
      for (let i = 0; i < link.length; i++) {
        addHiddenDiv('ii_video', link[i]);
      }
      // sku and variants
      // @ts-ignore
      let skuNumber = document.querySelector('script[type="application/ld+json"]') ? document.querySelector('script[type="application/ld+json"]').innerText : '';
      if (skuNumber) {
        skuNumber = (JSON.parse(skuNumber.replace(/\\"/gm, '"'))) ? JSON.parse(skuNumber.replace(/\\"/gm, '"')) : [];
        index === 0 && variantLength > 0 && skuNumber.offers && skuNumber.offers.forEach((item) => {
          item.sku && item.availability.includes('InStock') && addHiddenDiv('ii_variants', item.sku);
        });
        skuNumber = (skuNumber.offers && skuNumber.offers[index]) ? skuNumber.offers[index].sku : '';
        skuNumber && addHiddenDiv('ii_sku', skuNumber);
      }
    }, index, variantLength,manufacturerDesc,manufacturerImages);
  }
  async function scrollToImg () {
    await context.evaluate(async () => {
      var element = (document.querySelector("div[data-component-type='LARGE_STATIC_IMAGE'] img[class*='largeDisplayImage']")) ? document.querySelector("div[data-component-type='LARGE_STATIC_IMAGE'] img[class*='largeDisplayImage']") : null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 5000);
        });
      }
    });
  }
  if (variantLength > 1) {
    for (let index = 0; index < variantLength; index++) {
      await context.click(`ul[aria-label='Auswahl'] li:not([state='disabled']):nth-child(${index + 1})`);
      // await new Promise((resolve) => { setTimeout(resolve, 10000); });
      if (index <= variantLength - 2) {
        console.log('Inside variants', index);
        await scrollToImg();
        await preparePage(index, variantLength);
        // console.log("Variant1", context.evaluate(() => { return document.querySelector("div[class*='easyzoom--with-thumbnails'] img").getAttribute("src")}));
        await context.extract(productDetails, { transform }, { type: 'APPEND' });
        // await new Promise((resolve) => { setTimeout(resolve, 10000); });
      }
    }
  }
  await scrollToImg();
  if (variantLength) {
    await preparePage(variantLength - 1, variantLength);
  } else {
    await preparePage(0, 0);
  }
  if(variantLength<=1)
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'qvc',
    transform,
    domain: 'qvc.de',
    zipcode: '',
  },
  implementation,
};
