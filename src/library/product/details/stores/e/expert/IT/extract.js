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
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    helperModule: 'module:helpers/helpers',
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
  const { productDetails, helperModule: { Helpers } } = dependencies;

  const helper = new Helpers(context);

  const productUrl = await context.evaluate(async () => {
    const url = window.location.href;
    return url;
  });

  await helper.ifThereClickOnIt('#btn_cookie_warning', 10000, true); // accept cookies
  try{
    await context.waitForSelector('iframe#eky-dyson-iframe')

  }catch(error){
    console.log("no iframe detected")
  }
  const iframeLink = await context.evaluate(async () => {
    let iframeLink = null;
    const iframeSelector = document.querySelector('iframe#eky-dyson-iframe');
    if (iframeSelector) {
      iframeLink = iframeSelector.getAttribute('src');
    }
    console.log('here is the iframe link ' + iframeLink);
    return iframeLink;
  });
  let manufacturerDesc = []; let manufacturerImages = [];

  if (iframeLink) {
    await context.goto(iframeLink ,{ timeout: 100000, waitUntil: 'load', checkBlocked: true });
    await context.waitForXPath('//img');
  }

  manufacturerDesc = await context.evaluate(async (manufacturerDesc) => {
    function pushToEnhancedContent (textSelector, manufacturerDesc) {
      for (let i = 0; i < textSelector.length; i++) {
        manufacturerDesc.push(textSelector[i].innerText);
      }
      return manufacturerDesc;
    }

    const textSelector1 = document.querySelectorAll('div[class*="eky-header"] h2');
    const textSelector2 = document.querySelector('div[class*="eky-header"] h3');
    const textSelector3 = document.querySelectorAll('div[class*="eky-row"] h1');
    const textSelector4 = document.querySelectorAll('div[class*="eky-row"] h2');
    const textSelector5 = document.querySelectorAll('li[class*="eky-overlay-text"]');
    const textSelector6 = document.querySelectorAll('div[class*="eky-accessory"]');
    const textSelector7 = document.querySelectorAll('div[class*="eky-specs"]');

    if (textSelector1) {
      manufacturerDesc = pushToEnhancedContent(textSelector1, manufacturerDesc);
    }
    if (textSelector2) {
      manufacturerDesc = pushToEnhancedContent(textSelector2, manufacturerDesc);
    }
    if (textSelector3) {
      manufacturerDesc = pushToEnhancedContent(textSelector3, manufacturerDesc);
    }
    if (textSelector4) {
      manufacturerDesc = pushToEnhancedContent(textSelector4, manufacturerDesc);
    }
    if (textSelector5) {
      manufacturerDesc = pushToEnhancedContent(textSelector5, manufacturerDesc);
    }
    if (textSelector6) {
      manufacturerDesc = pushToEnhancedContent(textSelector6, manufacturerDesc);
    }
    if (textSelector7) {
      manufacturerDesc = pushToEnhancedContent(textSelector7, manufacturerDesc);
    }
    console.log(manufacturerDesc + ' is enhanced content');
    return manufacturerDesc;
  }, manufacturerDesc);

  manufacturerImages = await context.evaluate(async (manufacturerImages) => {

   manufacturerImages.push(...[...document.querySelectorAll('img')].map(elm => elm.src));
  return manufacturerImages;
  }, manufacturerImages);

let theBoxStr ='';

theBoxStr = await context.evaluate(async () => {
 let theBox = ''
  let inThe = document.querySelectorAll('div.eky-accessory');
  a = []
  for(let i = 0; i<inThe.length; i++){
    theBox = inThe[i].innerText;
    a.push(theBox)
  }
    return a.join(' || ');
});

console.log("===============",theBoxStr);

let theImageStr = '';
theImageStr = await context.evaluate(async () => {
 let theBox = ''
  let inThe = document.querySelectorAll('div.eky-accessory img');
  a = []
  for(let i = 0; i<inThe.length; i++){
    theBox = inThe[i]['src'];
    a.push(theBox)
  }
    return a.join(' || ');
});

console.log("===============",theImageStr);



  await context.goto(productUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

  await context.evaluate(async (manufacturerDesc, manufacturerImages, theBoxStr, theImageStr) => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    if (manufacturerDesc.length) {
      let enhancedContent = '';
      for (let i = 0; i < manufacturerDesc.length; i++) {
        if (i !== manufacturerDesc.length - 1) { enhancedContent += manufacturerDesc[i] + ' || '; } else { enhancedContent += manufacturerDesc[i]; }
      }
      addHiddenDiv('enhancedContent', enhancedContent);
    }

    addHiddenDiv('inTheBox', theBoxStr);
    addHiddenDiv('inTheBoxUrl', theImageStr);


    if (manufacturerImages.length) {
      let aplusImages = '';
      const iframeUrl = window.location.href;
      for (let i = 0; i < manufacturerImages.length; i++) {
        if (i !== manufacturerImages.length - 1) {
          if (manufacturerImages[i] && manufacturerImages[i].substring(0, 6) === 'images') {
            let tempUrl = 'https://media.flixfacts.com/eyekandy/dyson/v11/it/';
            tempUrl += manufacturerImages[i];
            aplusImages += tempUrl + ' || ';
          } else {
            aplusImages += manufacturerImages[i] + ' || ';
          }
        } else {
          if (manufacturerImages[i] && manufacturerImages[i].substring(0, 6) === 'images') {
            let tempUrl = 'https://media.flixfacts.com/eyekandy/dyson/v11/it/';
            tempUrl += manufacturerImages[i];
            aplusImages += tempUrl;
          } else {
            aplusImages += manufacturerImages[i];
          }
        }
      }

      addHiddenDiv('aplusImages', aplusImages);
    }
  }, manufacturerDesc, manufacturerImages, theBoxStr, theImageStr);


  const infiniteScroll = () => context.evaluate(async () => {
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
  });
  await infiniteScroll();
  await context.waitForSelector('script#productMicroData', 7000)
    .catch(() => console.log('selector not found'));
  await context.evaluate(async () => {
    function addHiddenDiv (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const scriptNode = document.querySelector("[id*='productMicroData']");
    let JSONArr = '';
    if (scriptNode) {
      const scriptData = scriptNode.textContent;
      JSONArr = JSON.parse(scriptData);
    }
    const offerText = JSONArr ? JSONArr.offers : null;
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
  // await context.waitForSelector('#flix-comp', { timeout: 45000 });

  try {
    await context.waitForSelector('#flix-comp', { timeout: 10000 });
  } catch (error) {
    console.log(error);
  }

  await new Promise((resolve) => setTimeout(resolve, 6000));
  await context.evaluate(() => {
    var elmt = document.getElementById('flix-comp-mainTitle');
    elmt && elmt.scrollIntoView(true);
  });
  try {
    await context.waitForSelector('div.flix-comp-mainTitle');
  } catch (error) {
    console.log(error);
  }
  await context.evaluate(() => {
    const imgSelelctor = document.querySelector('div.flix-comp-mainTitle');
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', !!imgSelelctor);
  });

  return await context.extract(productDetails, { transform });
}
