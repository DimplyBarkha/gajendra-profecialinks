const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'ebay',
    transform,
    domain: 'ebay.de',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    { productDetails },
  ) => {
    const { transform } = parameters;
    try {
      await context.waitForSelector('iframe#desc_ifr');
    } catch (err) {
      console.log('manufacturer contents not loaded or unavailable');
    }
    const src = await context.evaluate(async function () {
      const iframe = document.querySelector('iframe#desc_ifr');
      // @ts-ignore
      const src = iframe ? iframe.src : '';
      return src;
    });
    await context.extract(productDetails, { transform });
    if (src) {
      try {
        await context.setBypassCSP(true);
        await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('div#ds_div');
        return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
      } catch (error) {
        try {
          await context.setBypassCSP(true);
          await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
          await context.waitForSelector('div#ds_div');
          return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
        } catch (error) {
          console.log('could not load page', error);
        }
      }
    }

    await context.evaluate(function () {
      console.log(window.location.href + ' is the url');
      function createNewDiv (headingText, imageSrc, imageAlt, altImages, priceSpan, brandText, netWeight, color, variantId, gtin) {
        const newHeading = document.createElement('h1');
        const newImage = document.createElement('img');
        const newDiv = document.createElement('div');
        const variantDiv = document.createElement('div');
        const tblData1 = document.createElement('td');
        const tblData2 = document.createElement('td');
        const tblData3 = document.createElement('td');
        const tblData4 = document.createElement('td');
        const tblData5 = document.createElement('td');
        const tblData6 = document.createElement('td');
        const tblData7 = document.createElement('td');
        const tblData8 = document.createElement('td');
        const newTable = document.createElement('table');
        if(brandText!=''){
        tblData1.textContent = 'marke';
        tblData2.textContent = brandText;
        newTable.appendChild(tblData1);
        newTable.appendChild(tblData2);
        }
        if(netWeight!=''){
          tblData3.textContent = 'weight';
          tblData4.textContent = netWeight;
          newTable.appendChild(tblData3);
          newTable.appendChild(tblData4);
          }
        if(color!=''){
          tblData5.textContent = 'color';
          tblData6.textContent = color;
          newTable.appendChild(tblData5);
          newTable.appendChild(tblData6);
        }
        if(gtin!=''){
          tblData7.textContent = 'GTIN';
          tblData8.textContent = gtin;
          newTable.appendChild(tblData7);
          newTable.appendChild(tblData8);
        }
        newDiv.id = 'vi_main_img_fs';
        const listArr = document.createElement('ul');
        for (let i = 0; i <= altImages.length; i++) {
          const liElement = document.createElement('li');
          const altImage = document.createElement('img');
          if (i !== 0) altImage.setAttribute('src', altImages[i - 1].getAttribute('src'));
          liElement.appendChild(altImage);
          listArr.appendChild(liElement);
          newDiv.appendChild(listArr);
        }
        const spanPrice = document.createElement('span');
        spanPrice.id = 'prcIsum';
        spanPrice.textContent = priceSpan;
        newHeading.id = 'itemTitle';
        newHeading.textContent = headingText;
        newImage.id = 'icImg';
        newImage.setAttribute('src', imageSrc);
        newImage.setAttribute('alt', imageAlt);
        variantDiv.id = 'descItemNumber';
        variantDiv.textContent = variantId;
        newDiv.style.display = 'none';
        newImage.style.display = 'none';
        newHeading.style.display = 'none';
        spanPrice.style.display = 'none';
        variantDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        document.body.appendChild(newImage);
        document.body.appendChild(newHeading);
        document.body.appendChild(spanPrice);
        document.body.appendChild(newTable);
      }

      if (window.location.href.includes('/p/')) {
        const headingText = document.querySelector('h1[class="product-title"]').textContent;
        let imageSrc = ''; let imageAlt = '';
        if (document.querySelector('div[class*="vi-image-gallery__wrapper"]')) {
          imageSrc = document.querySelector('div[class*="vi-image-gallery__wrapper"] li:first-child img').getAttribute('src');
          imageAlt = document.querySelector('div[class*="vi-image-gallery__wrapper"] li:first-child img').getAttribute('alt');
        }
        const secImages = document.querySelectorAll('div[class="thumbPicturePanel "] img');
        let price='';
        if(document.querySelector('div[class="display-price"]')){
          price = document.querySelector('div[class="display-price"]').textContent;}
        let brandText = ''; let netWeight = ''; let color = ''; let variantId = ''; let gtin = '';

        const sname = document.querySelectorAll('div[class="s-name"]');
        if (document.querySelector('input[id="iid"]')) { variantId = document.querySelector('input[id="iid"]').getAttribute('value'); } else if (document.querySelector('div[id="app-product-sticky-header"]')) { variantId = document.querySelector('div[class="vi-component-transaction-layer"]').getAttribute('data-itemid'); }
        for (let i = 0; i < sname.length; i++) {
          if (sname[i].textContent === 'Gewicht'){ netWeight = sname[i].nextSibling.innerText;}
          if (sname[i].textContent === 'Marke') brandText = sname[i].nextSibling.innerText;
          if (sname[i].textContent === 'Farbe') color = sname[i].nextSibling.innerText;
          if (sname[i].textContent === 'EAN') gtin = sname[i].nextSibling.innerText;
        }
        createNewDiv(headingText, imageSrc, imageAlt, secImages, price, brandText, netWeight, color, variantId, gtin);
      }
    });

    await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
  },
};
