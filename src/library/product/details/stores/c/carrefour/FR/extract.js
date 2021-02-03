const { transform } = require('../FR/shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    transform,
    domain: 'carrefour.fr',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;
  let list = await context.evaluate(() => !document.evaluate(`//div[@class="pagination"]/following-sibling::ul[@id="data-plp_produits"][1]/li[@class="product-grid-item"]/article`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)
  console.log('list: ', list);
  let newUrl;
  if (!list) {
    try {
      await context.waitForSelector('button#footer_tc_privacy_button', { timeout: 90000 });
      let cookieBtnClicked = 0; 
      await context.evaluate( () => {
      // await context.evaluateInFrame('div.v-content__wrap iframe', () => {
        let cookieButton = document.querySelector('button#footer_tc_privacy_button');
        if (cookieButton) {
          // @ts-ignore
          cookieButton.click();
          cookieBtnClicked = 1;
        }
      });
      console.log('cookieBtnClicked before if: ', cookieBtnClicked);
      if(cookieBtnClicked === 1){
        console.log('cookieBtnClicked: ', cookieBtnClicked);
        // await context.goto(newUrl, { timeout: 80000, waitUntil: 'load', checkBlocked: true });
        // await context.waitForNavigation();
        // await context.reload();
        // await context.waitForNavigation();
      }
      } catch (error) {
        console.log('error: ', error);
      }
    async function firstItemLink() {
      return await context.evaluate(function () {
        //-------------------
          const xpath = `//div[@class="pagination"]/following-sibling::ul[@id="data-plp_produits"][1]/li[@class="product-grid-item"]/article`;
          const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        
        //-------------------
        // @ts-ignore
        let firstItem = document.evaluate(`//div[@class="pagination"]/following-sibling::ul[@id="data-plp_produits"][1]/li[@class="product-grid-item"]/article//div[@class="ds-product-card__shimzone--large"]/a`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        // @ts-ignore
        firstItem = firstItem ? firstItem.href : '';
        console.log('firstItem href: ', firstItem);
        let finalLink
        // @ts-ignore
        if (firstItem.includes('http') & firstItem !== '') {
          finalLink = firstItem
          console.log('finalLink: ', finalLink);
          // @ts-ignore
        } else if (firstItem !== '') {
          finalLink = 'https://www.carrefour.fr' + firstItem;
          console.log('finalLink: ', finalLink);
        }
        return finalLink;
      });
    }
    const url = await firstItemLink();
    console.log('url: ', url);
    newUrl = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    if (newUrl !== null) {
      await context.goto(newUrl, { timeout: 80000, waitUntil: 'load', checkBlocked: true });
    }
    await context.waitForNavigation();
  }
  
  //-------------------------
  try {
    await context.waitForSelector('button#footer_tc_privacy_button', { timeout: 90000 });
    let cookieBtnClicked = 0; 
    await context.evaluate( () => {
    // await context.evaluateInFrame('div.v-content__wrap iframe', () => {
      let cookieButton = document.querySelector('button#footer_tc_privacy_button');
      if (cookieButton) {
        // @ts-ignore
        cookieButton.click();
        cookieBtnClicked = 1;
      }
    });
    console.log('cookieBtnClicked before if: ', cookieBtnClicked);
    if(cookieBtnClicked === 1){
      console.log('cookieBtnClicked: ', cookieBtnClicked);
      // await context.goto(newUrl, { timeout: 80000, waitUntil: 'load', checkBlocked: true });
      // await context.waitForNavigation();
      // await context.reload();
      // await context.waitForNavigation();
    }
    } catch (error) {
      console.log('error: ', error);
    }
      // try {
      // await context.waitForSelector('div.v-content__wrap div#iframe-wrapper iframe', { timeout: 90000 });
      // let cookieBtnClicked = 0; 
      // await context.evaluateInFrame('div.v-content__wrap div#iframe-wrapper iframe', () => {
      // // await context.evaluateInFrame('div.v-content__wrap iframe', () => {
      //   let cookieButton = document.querySelector('button#footer_tc_privacy_button');
      //   if (cookieButton) {
      //     // @ts-ignore
      //     cookieButton.click();
      //     cookieBtnClicked = 1;
      //   }
      // });
      // console.log('cookieBtnClicked before if: ', cookieBtnClicked);
      // if(cookieBtnClicked === 1){
      //   console.log('cookieBtnClicked: ', cookieBtnClicked);
      //   // await context.goto(newUrl, { timeout: 80000, waitUntil: 'load', checkBlocked: true });
      //   // await context.waitForNavigation();
      //   await context.reload();
      //   await context.waitForNavigation();
      // }
      // } catch (error) {
      //   console.log('error: ', error);
      // }
     
  await context.evaluate(async (parentInput) => {
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
    }catch(error){
      console.log(error)
    }
    let clickLoadMore = document.querySelector('button.paragraph-truncate__see-more');
    // @ts-ignore
    clickLoadMore = clickLoadMore ? clickLoadMore.click() : '';
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let enhancedDescHTML = document.querySelector('div#flix-inpage');
    let enhancedDescHTML1 = document.querySelector('div#wc-aplus');
    let enhancedDescHTML2 = document.querySelector('div#flix-dyson-new-inpage');
    if(enhancedDescHTML){
      let enhancedDesc = enhancedDescHTML ? enhancedDescHTML.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
      addHiddenDiv('cr_enhancedContent',enhancedDesc);
    }else if(enhancedDescHTML1){
      let enhancedDesc = enhancedDescHTML1 ? enhancedDescHTML1.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').replace('Le contenu suivant est fourni par la marque:', '').trim() : '';
      addHiddenDiv('cr_enhancedContent',enhancedDesc);
      // https://www.carrefour.fr/p/soupe-deshydratee-thai-poule-et-citronnelle-knorr-8722700027775
    }else if(enhancedDescHTML2){
      let enhancedDesc = enhancedDescHTML2 ? enhancedDescHTML2.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').replace('Le contenu suivant est fourni par la marque:', '').trim() : '';
      addHiddenDiv('cr_enhancedContent',enhancedDesc);
      // https://www.carrefour.fr/p/soupe-deshydratee-thai-poule-et-citronnelle-knorr-8722700027775
    }
    
    let specTrs = document.querySelectorAll('div.secondary-details__characteristics-table table tr');
    let finalSpecArr = [];
    let fieldVal = '';
    let field;
    let value;
    for (let index = 0; index < specTrs.length; index++) {
      const element = specTrs[index];
      field = element.querySelector('td:nth-child(1)')
      // @ts-ignore
      let fieldStr = field ? field.innerText : '';
      value = element.querySelector('td:nth-child(2)');
      // @ts-ignore
      let valueStr = value ? value.innerText : '';
      if(fieldStr && valueStr){
        let fieldVal = fieldStr+' : '+valueStr;
        finalSpecArr.push(fieldVal);
      }

    }
    let finalSpecStr
    if(finalSpecArr.length > 0){
      finalSpecStr = finalSpecArr.join(' || ');
    }
    addHiddenDiv('cr_specification',finalSpecStr );
    // @ts-ignore
    let tc_vars = window.tc_vars;
    let brand = tc_vars ? tc_vars.product_brand : '';
    addHiddenDiv('cr_brand',brand);
  });
    return await context.extract(productDetails, { transform });
    }
