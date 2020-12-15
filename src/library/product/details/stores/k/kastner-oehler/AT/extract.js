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
    const productUrl = await context.evaluate(async function () {
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

    async function autoScroll () {
      await context.evaluate(async function () {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            console.log('===== Scrolling =====');
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    }

    await autoScroll();
    const iFrameCss = 'div[id*="loadBeeContainer"] iframe';
    try {
      await context.waitForSelector(iFrameCss, { timeout: 30000 });
      console.log(`iFrameCss: ${iFrameCss} loaded..`);
    } catch (error) {
      console.log(`iFrameCss: ${iFrameCss} not loaded..`, error);
    }

    const iframeLink = await context.evaluate(async function (iFrameCss) {
      let iframeLink = null;
      document.querySelector('#productcarousel_3 .productcarousel__header').scrollIntoView({ behavior: 'smooth' });
      if (document.querySelector('div[class*="site_inner"] iframe')) { iframeLink = document.querySelector(iFrameCss).getAttribute('src'); }
      return iframeLink;
    }, iFrameCss);

    let enhancedContent = null;
    console.log(`Iframe link: ${iframeLink}`);
    if (iframeLink !== null) {
      await context.goto(iframeLink, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
      await context.waitForSelector('.module.header img');
      enhancedContent = await context.evaluate(async function () {
        const video = document.querySelector('.play-btn.centered.desktop').getAttribute('data-video');
        const enhancedContent = document.querySelector('.pic-text-modul').innerText;
        const aplusImagesArray = document.querySelectorAll('.pic-text img');
        const aplusImagesSrc = [];
        if (aplusImagesArray.length > 0) {
          aplusImagesArray.forEach(image => {
            aplusImagesSrc.push(image.getAttribute('data-src') + ' ||');
          });
        }
        // let enhancedContent='';
        // let fontText1=document.querySelectorAll('div[class*="pic-text"] div font font');
        // for(let i=0;i<fontText1.length;i++) enhancedContent+=fontText1[i].innerText+' || ';
        // let fontText2=document.querySelectorAll('div[class*="animation-text"]  font font');
        // for(let i=0;i<fontText2.length;i++) enhancedContent+=fontText2[i].innerText+'||';
        return { enhancedContents: enhancedContent, videos: video, aplusImages: aplusImagesSrc };
      });
    } else console.log('iframe link not loaded');

    await context.goto(productUrl, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    if (enhancedContent !== null) {
      await context.evaluate(async function (enhancedContent) {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        addHiddenDiv('enhancedContent', enhancedContent.enhancedContents);
        addHiddenDiv('video', enhancedContent.videos);
        addHiddenDiv('aplusImage', enhancedContent.aplusImages);
      }, enhancedContent);
    }
    await context.waitForSelector('.en_lazy_load');
    await context.extract(productDetails, { transform: transformParam });
  },
};
