// @ts-nocheck
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto',
    transform: null,
    domain: 'otto.de',
  },
  implementation: async ({ url }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const dataObj = JSON.parse((document.querySelector('script#productDataJson').innerText).trim());
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addVideoElementToDocument (key, arr) {
        const catElement = document.createElement('div');
        catElement.id = key;
        for (let i = 0; i < arr.length; i++) {
          const videoElement = document.createElement('img');
          if (arr[i].src) {
            videoElement.src = arr[i].src;
          } else {
            videoElement.src = arr[i].getAttribute('data-img-src');
          }
          catElement.appendChild(videoElement);
        }
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      let availabilityText = document.querySelector('#availability');
      availabilityText = availabilityText ? availabilityText.innerText.trim() : '';
      availabilityText = availabilityText.includes('leider ausverkauft') ? 'leider ausverkauft' : 'In den Warenkorb';
      addElementToDocument('ot_availabilityText', availabilityText);
      if (dataObj) {
        addElementToDocument('ot_sku', dataObj.id);
        addElementToDocument('ot_brand', dataObj.brand);
        let gtinSelector = document.evaluate("//meta[contains(@itemprop,'gtin')]/@content", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        gtinSelector = gtinSelector ? `Article no. ${gtinSelector.innerText}` : '';
        let bulletDescription = document.evaluate('//ul[@class="prd_unorderedList"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        bulletDescription = bulletDescription ? bulletDescription.innerText : '';
        addElementToDocument('ot_description', `${gtinSelector} ${bulletDescription} ${dataObj.description}`);
        addElementToDocument('ot_variantID', Object.keys(dataObj.variations).length);
        let prodName = document.querySelector('div.prd_shortInfo__text h1');
        prodName = prodName ? prodName.innerText.trim() : '';
        addElementToDocument('ot_nameExtended', `${prodName} (${dataObj.id})`);
      }
      const colorlement = document.evaluate("//div[contains(@class,'prd_color ')]//li[contains(@class,'p_selected')]/@style", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (colorlement && colorlement.value.indexOf('background-color') > -1) {
        const colorCode = colorlement.value.slice(colorlement.value.indexOf('#') + 1);
        addElementToDocument('ot_colorcode', colorCode);
      }
      const videoButton = document.querySelector('.prd_videoLink__icon');
      if (videoButton) {
        videoButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        const videoElement = document.querySelector('.p_layer__wrapper video');
        videoElement && addElementToDocument('ot_video', videoElement.src);
      }
      const manfacturerButton = document.querySelector('#js_prd_manufacturerContentButton');
      if (manfacturerButton) {
        manfacturerButton.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        let url = document.querySelector('iframe.prd_manufacturerContent__iframe');
        url = url ? url.src : '';
        if (url) {
          const contents = await fetch('https://cors-anywhere.herokuapp.com/' + url)
            .then(response => response.text())
            .then(contents => contents)
            .catch(error => console.log(error));
          if (contents) {
            const domParser = new DOMParser();
            const d = domParser.parseFromString(contents, 'text/html');
            const manufacturerContent = d.querySelector('div#saturn-wraper , div#product');
            if (manufacturerContent) {
              const manufacturerDescription = d.querySelectorAll('div.flix-std-content , div#productdescription  ul');
              const newArr = [];
              for (let i = 0; i < manufacturerDescription.length; i++) {
                newArr.push(manufacturerDescription[i].innerText);
              }
              manufacturerDescription && addElementToDocument('ot_manufacturerDescription', newArr.join());
              let manfacturerImages = d.querySelectorAll('img.flix-center');
              if (manfacturerImages && manfacturerImages.length) {
                addVideoElementToDocument('ot_manfacturerImages', manfacturerImages);
              } else {
                manfacturerImages = d.querySelectorAll('div[data-type="picture"], div.icon > img');
                manfacturerImages && addVideoElementToDocument('ot_manfacturerImages', manfacturerImages);
              }
            }
          }
        }
      }
    });
    await context.extract(productDetails);
  },
};
