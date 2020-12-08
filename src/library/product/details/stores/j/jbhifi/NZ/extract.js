const { transform } = require('./../shared');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    console.log('we need to wait for price div');
    await context.waitForXpath("(//p[@class='price']//span[contains(@class,'amount ')])[last()]", {timeout: 35000});
  } catch (err) {
    console.log('got some error while waiting for price div');
  }
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // description
    let descContent = document.querySelector("div[class*='info'] div[itemprop*='description'] ul") ? document.querySelector("div[class*='info'] div[itemprop*='description'] ul").innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
    descContent = descContent.substring(descContent.indexOf('||')).trim();
    try{
      let description = document.evaluate("//div[@id='tab1']//ul", document, null, XPathResult.ANY_TYPE, null);
    // @ts-ignore
    description = description.iterateNext().innerText;
    if (descContent) {
      addHiddenDiv('desc', descContent + ' | ' + description);
    } else {
      addHiddenDiv('desc', description);
    }
    }catch(err){
      console.log('No description present', err.message);
    }
    // enhancedContent
    // @ts-ignore
    const iframe = document.querySelector('iframe[id*="flixDescription"]') ? document.querySelector('iframe[id*="flixDescription"]').contentDocument.documentElement.innerHTML : null;
    if (iframe) {
      const domparser = new DOMParser();
      const iframeDom = domparser.parseFromString(iframe, 'text/html');
      let manufactureDesc = '';
      let manufactureImage = [];
      if (iframeDom.querySelectorAll('img') !== null) {
        const images = iframeDom.querySelectorAll('img');
        for (let i = 0; i < images.length; i++) {
          manufactureImage.push(images[i].src + '');
        }
      }
      // @ts-ignore
      manufactureImage = [...new Set(manufactureImage)];
      addHiddenDiv('primary_image', manufactureImage.join(' | '));
      const nodes = iframeDom.evaluate("//body//*[not(*) and not(self::*[(contains(@id,'policy')) or contains(@class,'policy') or contains(@class,'flix-privacy-pointer') or contains(@style,'clear')]) and not(self::style)]", iframeDom, null, XPathResult.ANY_TYPE, null);
      let nodeEle = nodes.iterateNext();
      while (nodeEle) {
        // @ts-ignore
        manufactureDesc += nodeEle.textContent + ' ';
        nodeEle = nodes.iterateNext();
      }
      addHiddenDiv('ii_manufactureDesc', manufactureDesc.replace(/\n/gm, ' ').replace(/\s{2,}/gm, ' ').trim());
      console.log('ManufacturerDescription : ', manufactureDesc);
      const videoNodes = iframeDom.evaluate("//div[contains(@class,'fullJwPlayerWarp')]//input", iframeDom, null, XPathResult.ANY_TYPE, null);
      let videoNodeEle = videoNodes.iterateNext();
      while (videoNodeEle) {
        // @ts-ignore
        let videoJSON = videoNodeEle.getAttribute('value');
        videoJSON = JSON.parse(videoJSON.replace(/\\"/gm, '"'));
        if (videoJSON) {
          const url = (videoJSON.playlist && videoJSON.playlist[0] && videoJSON.playlist[0].file) ? 'https:' + videoJSON.playlist[0].file : '';
          url && addHiddenDiv('ii_video', (url));
        }
        videoNodeEle = videoNodes.iterateNext();
      }
      const gtin = iframeDom.querySelector('script[id="flix-iframe-async"]');
      const gtinValue = gtin.getAttribute('data-flix-ean');
      addHiddenDiv('ii_gtin', gtinValue);
    }
    // specifications
    const specTab = document.querySelector("li[class*='tab2'] a") ? document.querySelector("li[class*='tab2'] a") : null;
    if (specTab) {
      // @ts-ignore
      await specTab.click();
      await new Promise(resolve => setTimeout(resolve, 5000));
      // @ts-ignore
      const iframeSpecs = document.querySelector('iframe[id*="flixDetails"]') ? document.querySelector('iframe[id*="flixDetails"]').contentDocument.documentElement.innerHTML : null;
      if (iframeSpecs) {
        const domparser = new DOMParser();
        const iframeSpecsDom = domparser.parseFromString(iframeSpecs, 'text/html');
        let specs = '';
        const nodes = iframeSpecsDom.querySelectorAll('div[class*="inpage_column"]');
        for (let i = 0; i < nodes.length; i++) {
          if (i % 2 === 0) {
            // @ts-ignore
            specs += nodes[i].innerText + ' : ';
            // @ts-ignore
            nodes[i].innerText.includes('Weight') && addHiddenDiv('ii_weight', nodes[i + 1].innerText.trim());
          } else {
            // @ts-ignore
            specs += nodes[i].innerText + ' || ';
          }
        }
        specs && addHiddenDiv('ii_specs', specs.slice(0, -4));
        console.log('Iframe Specifications', specs);
      }
    }
    const video = document.querySelector('div[class="fluid-width-video-wrapper"]');
    if (video !== null) {
      video.querySelectorAll('iframe').forEach(element => {
        addHiddenDiv('ii_video', element.src);
      });
    }
    // nameExtended
    // @ts-ignore
    let brand = document.querySelector("div[class*='brand'] img") ? document.querySelector("div[class*='brand'] img").getAttribute('alt') : '';
    if (!brand) {
      brand = document.querySelector("meta[property='brand']") ? document.querySelector("meta[property='brand']").getAttribute('content') : '';
    }
    const title = document.querySelector("meta[property*='title']") ? document.querySelector("meta[property*='title']").getAttribute('content') : '';
    let nameExtended = '';
    if (brand && title) {
      nameExtended = brand + ' - ' + title;
    } else {
      nameExtended = title;
    }
    addHiddenDiv('ii_name', title);
    addHiddenDiv('ii_nameExtended', nameExtended);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'jbhifi',
    transform,
    domain: 'jbhifi.co.nz',
    zipcode: '',
  },
  implementation,
};
