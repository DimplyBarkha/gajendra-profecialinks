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
    
    //getting enhacedContent from iframe.
    const iframeUrl = await context.evaluate(async function() {
      let gtin = document.querySelector('span[itemprop*=gtin]') ? document.querySelector('span[itemprop*=gtin]').innerText.trim() : "";
      if(!gtin) {
        console.log("Enhaced Content not found");
        return null;
      }
      return `https://service.loadbee.com/ean/${gtin}/de_DE?css=default&template=default&button=default&data=%7B%22shop%22%3A%22www.kastner-oehler.at%22%2C%22source%22%3A%22inpage%22%2C%22api%22%3A%22hKxdndaN6V7hJ6SwV2RyLs9M3gGt73re%22%7D`;
    });
    let enhancedContent = {};
    if(iframeUrl) {
      await context.goto(iframeUrl, {
        block_ads: false,
        load_all_resources: true,
        images_enabled: true,
        timeout: 50000,
        waitUntil: 'load',
      });
      enhancedContent = await context.evaluate(async function() {
        let content = {};
        content.images = [];
        let imageNodes = document.querySelectorAll('img[class=pic]');
        imageNodes.forEach(img => {
          if(img.hasAttribute('src')) {
            content.images.push(img.getAttribute('src'));
          }
        });
        content.manufacturerDescription = document.body.innerText.trim().replace(/\n|\s\s+/g," ");
        content.videos = [];
        let videoNodes = document.querySelectorAll('*[data-video]');
        videoNodes.forEach(vid => {
          if(vid.hasAttribute('data-video')) {
            if(!content.videos.includes(vid.getAttribute('data-video'))) {
            content.videos.push(vid.getAttribute('data-video'))
            }
          }
        })

        return content;
      })
    }

    //going back to product page
    await context.goto(productUrl, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 50000,
      waitUntil: 'load',
    });

    await context.evaluate(async function (enhancedContent) {
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

      addElementToDocument('enhancedContent', enhancedContent.manufacturerDescription);
      if(enhancedContent.videos) {
        enhancedContent.videos.forEach(q => {
          addElementToDocument('video', q);
        })
      }
      if(enhancedContent.images) {
        enhancedContent.images.forEach(q => {
          addElementToDocument("manufacturerImages", q);
        })
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
    }, enhancedContent);
    await context.extract(productDetails, { transform: transformParam });
  },
};
