const { cleanUp } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise(resolve => setTimeout(resolve, 3000));
  await context.evaluate(async function () {
    function timeout (ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const tabs = document.querySelectorAll('ul#product-tabs>li>a');
    if (tabs) {
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].click();
        await timeout(3000);
      }
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
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    const specificationArr = document.querySelectorAll('div#specifications_content tr');
    const specification = [];
    if (specificationArr) {
      specificationArr.forEach(e => {
        specification.push(e.innerText.replace(/•/g, '||').replace(/\n|\s{2,}/g, ' '));
      });
    }
    addElementToDocument('specification', specification.join('|'));
    const specDimensions = document.evaluate("//td[strong[contains(text(),'Height') or contains(text(),'Width') or contains(text(),'Depth')]]/following-sibling::td", document, null, XPathResult.ANY_TYPE, null);
    if (specDimensions) {
      const nodes = [];
      for (let node = specDimensions.iterateNext(); node; node = specDimensions.iterateNext()) {
        nodes.push(`${node.innerText}"`);
      }
      const dimensions = nodes.join(' x ');
      addElementToDocument('dimensions', dimensions);
    }
    const bulletInfo = document.querySelectorAll('div#overview_content td li');
    const keyFeatures = document.querySelectorAll('ul#key_features li');
    const descBulletInfo = [];
    if (keyFeatures) {
      keyFeatures.forEach(e => {
        descBulletInfo.push(e.innerText);
      });
    };
    if (bulletInfo) {
      bulletInfo.forEach(e => {
        descBulletInfo.push(e.innerText);
      });
    }
    addElementToDocument('descBulletInfo', descBulletInfo.join('||'));
    let availablility = document.querySelector('div#pricing_container span.pricing-availability-desc.instock') ? 'In Stock' : 'Out of Stock';
    if (document.querySelector('button[class*="addToCart"]') && document.querySelector('button[class*="addToCart"]').innerText.includes('ADD')) { availablility = 'In Stock'; }
    addElementToDocument('availablility', availablility);

    const variants = document.querySelector('div.display-group-color');
    const variantColor = variants && document.querySelector('div.display-group-color strong')
      ? document.querySelector('div.display-group-color strong').innerText : '';
    const specColorXpath = document.evaluate('//table[@id="specs_table"]//strong[text()="Color"]/../following-sibling::td[1]', document, null, XPathResult.STRING_TYPE, null);
    const specColor = specColorXpath ? specColorXpath.stringValue : '';
    const descColorXpath = document.evaluate('//li[strong[text()="Color:"]]/text()', document, null, XPathResult.STRING_TYPE, null);
    const descColor = descColorXpath ? descColorXpath.stringValue : '';
    const keyFeaturesColorXpath = document.evaluate('//ul[@id="key_features"]/li[position() = last()][contains(text(),"Finish")]/text()', document, null, XPathResult.STRING_TYPE, null);
    const keyFeaturesColor = keyFeaturesColorXpath ? keyFeaturesColorXpath.stringValue.replace(/\sFinish/g, '') : '';
    if (variantColor) {
      addElementToDocument('color', variantColor);
    } else if (specColor) {
      addElementToDocument('color', specColor);
    } else if (descColor) {
      addElementToDocument('color', descColor);
    } else {
      addElementToDocument('color', keyFeaturesColor);
    }
    const pdfExist = document.querySelector('div#documents_content ul li');
    if (pdfExist) addElementToDocument('pdfExist', 'Yes');
    const image360Exists = document.querySelector('div.wc-three-sixty');
    if (image360Exists) addElementToDocument('image360Exists', 'Yes');
    let manufacturerDescription = document.querySelector('div#from_manufacturer_content')
      ? document.querySelector('div#from_manufacturer_content').innerText.replace(/\n{2,}|\s{2,}/g, '') : '';
    let inTheBoxUrl = '';
    if (document.querySelector('.syndi_powerpage')) {
      const manDescSelector = [...document.querySelector('.syndi_powerpage').shadowRoot.querySelectorAll('.syndigo-featureset-feature')];
      let manDescArray = [];
      for (let i = 0; i < manDescSelector.length; i++) {
        if (manDescSelector[i].innerText) {
          manDescArray.push(manDescSelector[i].innerText);
        }
      }
      manDescArray = [...new Set(manDescArray)];
      const manDesc = manDescArray.join(' | ');
      manufacturerDescription = manufacturerDescription + manDesc;
      if (manufacturerDescription) addElementToDocument('manufacturerDescription', manufacturerDescription);

      let array = [];
      let inTheBoxText;
      const inTheBoxHeader = [...document.querySelector('.syndi_powerpage').shadowRoot.querySelectorAll('.syndigo-widget-section-header')];
      for (let i = 0; i < inTheBoxHeader.length; i++) {
        if (inTheBoxHeader[i].innerText.match('In')) {
          array = [...inTheBoxHeader[i].parentElement.querySelectorAll('.syndigo-featureset img')];
          inTheBoxText = inTheBoxHeader[i].parentElement.querySelector('.syndigo-featureset').innerText;
        }
      }
      let inTheBoxImages = [];
      if (array.length) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].getAttribute('src')) {
            inTheBoxImages.push(array[i].getAttribute('src'));
          }
        }
      }
      console.log('in the box images are: ', inTheBoxImages);
      inTheBoxImages = [...new Set(inTheBoxImages)];
      const inTheBox = inTheBoxImages.join(' || ');
      inTheBoxUrl = inTheBoxUrl + inTheBox;
      if (inTheBoxUrl) addElementToDocument('inTheBoxUrl', inTheBoxUrl);
      if (inTheBoxText) addElementToDocument('inTheBoxText', inTheBoxText);

      const manImageSelector = [...document.querySelector('.syndi_powerpage').shadowRoot.querySelectorAll('img')];
      let manImagesArray = [];
      for (let i = 0; i < manImageSelector.length; i++) {
        if (manImageSelector[i].getAttribute('src')) {
          manImagesArray.push(manImageSelector[i].getAttribute('src'));
        }
      }
      manImagesArray = [...new Set(manImagesArray)];
      const manImages = manImagesArray.join(' || ');
      document.querySelector('body').setAttribute('manImages', manImages);
    }
    const viedoContainer = document.querySelector('div#productvideocontainer script')
      ? document.querySelector('div#productvideocontainer script').innerText : '';
    const regex = new RegExp("youtubeid:\\s'(.+)'", 'g');
    const videoArr = viedoContainer.match(regex);
    if (videoArr) {
      for (let i = 0; i < videoArr.length; i++) {
        const videoSrc = videoArr[i].replace(regex, '$1');
        if (videoSrc) addElementToDocument('video', 'https://www.youtube.com/watch?v='.concat(videoSrc));
      }
    }
    var iframeVideo = document.querySelector('iframe[title="Product Videos"]');
    if (iframeVideo) {
      const iframeVideoContents = iframeVideo.contentWindow.document.body;
      const videoUrl = iframeVideoContents.querySelector('video').src;
      if (videoUrl) addElementToDocument('video1', videoUrl);
    }

    // retrieving videos from dataLayer.
    try {
      let temp = null;
      dataLayer.forEach(q => {
        if (JSON.stringify(q).includes('play')) { console.log(q); temp = q; }
      });
      const videoUrls = JSON.stringify(temp).replace(/(.+)("event_label":")(.+)(",)(.+)/, 'https://www.youtube.com/watch?v=$3');
      if (videoUrls !== 'null') {
        addElementToDocument('videoUrls', videoUrls);
      }
    } catch (e) {
      console.log('video section not present.');
    }

    let priceText = '';
    if (document.querySelector('div[id="product_pricing_container"] span[itemprop="price"]')) {
      priceText += document.querySelector('div[id="product_pricing_container"] span[itemprop="price"]').innerText;
      priceText = priceText.substr(12, priceText.length);
    } else if (document.querySelector('div[class*="pricing-item-price pricing-class-package"]')) {
      priceText += document.querySelector('div[class*="pricing-item-price pricing-class-package').innerText;
      priceText = priceText.substr(12, priceText.length);
    }
    if (priceText !== '') addElementToDocument('priceText', priceText);
    const scripts = document.querySelectorAll('script[type="text/javascript"]');
    let targetScript = null;
    let skuStr = '';
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].innerText.includes('Product_')) {
        targetScript = scripts[i].innerText;
      }
    }
    for (let i = 0; i < targetScript.length; i++) {
      if (targetScript.substring(i, i + 3).includes('SKU')) {
        let j = i + 3;
        while (true) {
          if (targetScript.charAt(j) === '}') { skuStr = targetScript.substring(i, j); break; }
          j++;
        }
        break;
      }
    }
    if (skuStr.length > 0) {
      for (let i = 0; i < targetScript.length; i++) {
        if (targetScript.substring(i, i + 3).includes('SKU')) {
          let j = i + 3;
          while (true) {
            if (targetScript.charAt(j) === '}') { skuStr = targetScript.substring(i, j); break; }
            j++;
          }
          break;
        }
      }
      for (let i = 5; i < skuStr.length; i++) {
        if (skuStr.charAt(i) === '\'') {
          skuStr = skuStr.substring(i + 1, skuStr.length - 1);
          break;
        }
      }
    }
    addElementToDocument('skuString', skuStr);
  });
  await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'abt',
    transform: cleanUp,
    domain: 'abt.com',
    zipcode: '',
  },
  implementation,
};
