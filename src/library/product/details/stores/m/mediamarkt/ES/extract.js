const { cleanUp } = require('../../../../shared');

// @ts-ignore
// @ts-ignore
async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  try {
    await context.waitForSelector('button[class*="RichProductDescription"]');
  } catch (error) {
    console.log(error)
  }
  // @ts-ignore
  // @ts-ignore
  const currentUrl = await context.evaluate(() => {
    return window.location.href;
  });

  // const selectors = {
  //   isVariants: 'div[class*="product-attributes"]',
  //   isColors: '.product-attributes__color-item',
  //   isSizes: '.product-attributes__item-select',
  //   targetDiv: 'body > #product-wrapper',
  //   targetScroll: '.dyProductContainer',
  //   targetManufScroll: '#wrp_flixmedia, .features-wrapper',
  // };

  // try {
  //   await context.waitForSelector(selectors.isVariants);
  //   await context.evaluate((selectors) => {
  //     let firstVariant = '';
  //     const div = document.querySelector(selectors.targetDiv);
  //     const isColors = document.querySelector(selectors.isColors);
  //     const isSizes = document.querySelector(selectors.isSizes);
  //     if (isColors) {
  //       firstVariant = isColors.getAttribute('data-action-id').replace(/(.+-)(\d+)(.html)/, '$2');
  //       div.setAttribute('first-variant', firstVariant);
  //     }
  //     if (!isColors && isSizes) {
  //       firstVariant = isSizes.querySelector('option').getAttribute('data-action-id').replace(/(.+-)(\d+)(.html)/, '$2');
  //       div.setAttribute('first-variant', firstVariant);
  //     }
  //   }, selectors);
  // } catch (e) {
  //   console.log('No variants present for this product');
  // }

  await context.evaluate(() => {
    async function infiniteScroll() {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    infiniteScroll();
  });


  //Specifications 


  await new Promise(resolve => setTimeout(resolve, 5000));

  // For enhanced content
  try {
    await context.waitForSelector('button[class*="RichProductDescription"]', { timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.click('button[class*="RichProductDescription"]');
    await new Promise(resolve => setTimeout(resolve, 10000));
    await context.waitForSelector('div#inpage_container img');
    await context.evaluate(() => {
      const manufacturerImg = document.querySelectorAll('div#inpage_container img');
      let manufacturerImages = [];
      manufacturerImg.forEach(img => {
        if (img.getAttribute('src')) {
          manufacturerImages.push(img.getAttribute('srcset'));
        }
      })
      addElementToDocument('manufacturerImages', manufacturerImages.join(' || '));

      const manufacturerDesc = document.querySelectorAll('div.flix-std-row');
      let text = '';
      manufacturerDesc.forEach(img => {
        // @ts-ignore
        text += (text ? ' ' : '') + img.innerText;
      })
      const manufDescription = text.trim();
      addElementToDocument('manufacturerDescription', manufDescription);

      let inTheBoxImg = document.querySelectorAll('div[class*=flix-std-row] img');
      let inTheBoxUrl = [];
      inTheBoxImg.forEach(img => {
        if (img.getAttribute('srcset')) {
          inTheBoxUrl.push(img.getAttribute('srcset'));
        }
      })
      addElementToDocument('inTheBoxUrl', inTheBoxUrl.join(' || '));

      const textArray1 = document.querySelectorAll('div.inpage_selector_InTheBox div.flix-std-content');
      const inTheBoxText = [];
      textArray1.forEach(txt => {
        // @ts-ignore
        if (txt.innerText) {
          // @ts-ignore
          inTheBoxText.push(txt.innerText);
        }
      });
      addElementToDocument('inTheBoxText', inTheBoxText.join(' || '));

      let videos = [];
        let videoId = document.evaluate("//div[contains(@class,'flix-videocontainer')]//input/@value", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let index = 0; index < videoId.snapshotLength; index++) {
          const element = videoId.snapshotItem(index);
          let video = element && element.textContent.replace(/(.*){"file":"\\\/\\\/(.+)(.mp4)"(.*)/g, 'https://$2$3').replace(/\\/g,'');
          videos.push(video);
        }
        let videoData = videos.join(' || ');
      
      
      addElementToDocument('added_video', videoData);

      const specs = document.querySelectorAll('div[class*="ProductFeatures"] td');
      const specifications = [];
      specs.forEach(txt => {
        // @ts-ignore
        if (txt.innerText) {
          // @ts-ignore
          specifications.push(txt.innerText);
        }
      });
      // @ts-ignore
      addElementToDocument('Specifications', specifications.join(' || '));

      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

    });
  } catch (e) {
    console.log(e.message);
  }

  return await context.extract(productDetails, { transform });
}


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'mediamarkt',
    transform: cleanUp,
    domain: 'mediamarkt.es',
    zipcode: '',
  },
  implementation,
};
