const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'kastner-oehler',
    transform: cleanUp,
    domain: 'kastner-oehler.at',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    let productUrl=await context.evaluate(async function(){
      return document.URL;
    });
    await context.evaluate(async function () {
      const cookies = document.querySelector('span.tao_button_cookie_settings');
      if (cookies) cookies.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const bulletInfo = document.querySelectorAll('div.article_detail_text li');
      const descBulletInfo = [];
      if (bulletInfo) {
        bulletInfo.forEach(e => {
          descBulletInfo.push(e.innerText);
        });
      }
      addElementToDocument('desc_bullets', descBulletInfo.join('||'));
      const descInfo = document.querySelectorAll('span[itemprop="description"] p');
      const descInfoArr = [];
      if (descInfo) {
        descInfo.forEach(e => {
          descInfoArr.push(e.innerText);
        });
      }
      addElementToDocument('desc_info', descInfoArr.join('||').replace(/\n/g, '||'));

      const inStockXpath = document.evaluate("//div[contains(@class, 'en_griditem')]/span[text()='In den Warenkorb'][contains(@class,'en_button--color_blue')]", document, null, XPathResult.STRING_TYPE, null);
      if (inStockXpath && inStockXpath.stringValue) {
        addElementToDocument('inStock', 'In Stock');
      }
      const colorXpath = document.evaluate("//span[@itemprop='description']/ul/li[contains(., 'Farbe')]", document, null, XPathResult.STRING_TYPE, null);
      if (colorXpath && colorXpath.stringValue) {
        addElementToDocument('productColor', colorXpath.stringValue.replace(/Farbe:\s(.+)$/g, '$1'));
      }
      const nameExtended = document.querySelector('meta[property="og:title"]');
      // @ts-ignore
      if (nameExtended && nameExtended.content) {
        // @ts-ignore
        const newNameExtended = nameExtended.content.replace(/,/, '');
        // @ts-ignore
        nameExtended.content = newNameExtended;
      }

    });
    let iframeLink=await context.evaluate(async function(){
      let iframeLink=null;
      document.querySelector('footer').scrollIntoView({behavior: 'smooth'});
      function stall (ms)
      {
      return new Promise((resolve, reject) => {
      setTimeout(() => {
      resolve();
      }, ms);
      });
      }
      await stall(15000);
      if(document.querySelector('div[class*="site_inner"] iframe'))
        iframeLink=document.querySelector('div[id*="loadBeeContainer"] iframe').getAttribute('src');
      return iframeLink;
    });

    let enhancedContent=null;
    if(iframeLink!==null){
      await context.goto(iframeLink, { timeout: 5000, waitUntil: 'load', checkBlocked: true });
       enhancedContent= await context.evaluate(async function(){
        let enhancedContent='';
        let fontText1=document.querySelectorAll('div[class*="pic-text"] div font font');
        for(let i=0;i<fontText1.length;i++) enhancedContent+=fontText1[i].innerText+' || ';
        let fontText2=document.querySelectorAll('div[class*="animation-text"]  font font');
        for(let i=0;i<fontText2.length;i++) enhancedContent+=fontText2[i].innerText+'||';
        return enhancedContent;
      });
    }
    else console.log('iframe link not loaded');
    await context.goto(productUrl, { timeout: 5000, waitUntil: 'load', checkBlocked: true });
    if(enhancedContent!==null){
      await context.evaluate(async function(enhancedContent){
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        addHiddenDiv('enhancedContent',enhancedContent);
      },enhancedContent)
    }
    await context.extract(productDetails, {transform: transformParam});
  },
};
