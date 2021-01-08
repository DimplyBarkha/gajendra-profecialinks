const implementation = async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
  const { url, id } = inputs;
  let builtUrl;
  if (!url) {
    if (!id) throw new Error('No id provided');
    else builtUrl = await dependencies.createUrl(inputs);
  }
  await dependencies.goto({ ...inputs, url: builtUrl || url });

  if (loadedSelector) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
  }
  const noResults = await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
  if (!noResults) {
    return false;
  }

  // Apply scroll to make sure videos are loaded
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(1000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };

  await applyScroll(context);

  // Code for variants starts from here

  const doesVariantsExists = await context.evaluate(function () {
    const colorVariants = document.querySelectorAll('#color-list-mobile > li');
    const sizeVariants = document.querySelectorAll('#size-list-container > li');
    return colorVariants.length || sizeVariants.length;
  });

  if (!doesVariantsExists) {
    // Bind the sku & image to the dummy li
    await context.evaluate(function () {
      const dummyUl = document.createElement('ul');
      dummyUl.setAttribute('id', 'color-list-mobile');
      const li = document.createElement('li');
      const img = document.createElement('img');
      // get the image url
      const imgEle = document.evaluate('(//li[@class="img-viewer"]/img/@src)[1]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
      const imgUrl = imgEle ? imgEle.nodeValue : '';

      let sku = url.match(/skuId=(\d+)/) ? url.match(/skuId=(\d+)/)[1] : '';

      if (!sku) {
        console.log('No sku exists');
        const productCodeEle = document.evaluate('//p[@class="m-product__information--code"]//span', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
        sku = productCodeEle ? productCodeEle.textContent : '';
      }

      // Append secondary images
      const altImages = document.evaluate("(//div[not(contains(@class,'pzlvideo'))]/img[@class='pdpthumb lazyloaded']/@src)[position()>1]", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const altImagesLen = altImages.snapshotLength;
      let images = '';
      for (let j = 0; j < altImagesLen; j++) {
        images += `${altImages.snapshotItem(j).textContent} | `;
      }

      images = altImagesLen ? images.slice(0, -3) : images;

      img.setAttribute('id', sku);
      img.setAttribute('src', imgUrl);
      img.setAttribute('altImg', images);
      img.setAttribute('altImgCount', altImagesLen.toString());

      // Check if there is ul element, then bind the sku & img to it else bind it to dummy ul element
      li.appendChild(img);
      dummyUl.appendChild(li);
      const body = document.querySelector('body');
      body.appendChild(dummyUl);
    });
  } else {
    await context.evaluate(async function () {
      async function awaitElement (selector, ms) {
        const loadingImgEle = document.querySelector(selector);
        const loadingImg = loadingImgEle ? loadingImgEle.style.display : '';
        if (loadingImg !== 'block') {
          console.log('Resolved, but wait for 500ms more');
          await new Promise(resolve => setTimeout(resolve, 500));
          return;
        }
        console.log('Waiting');
        await new Promise(resolve => setTimeout(resolve, ms));
        await awaitElement(selector, ms);
      }

      let variantUlElement;
      let variantCount;

      const colorVariants = document.querySelectorAll('#color-list-mobile > li');
      const sizeVariants = document.querySelectorAll('#size-list-container > li');

      if (colorVariants.length) {
        variantUlElement = colorVariants;
        variantCount = colorVariants.length;
      } else {
        variantUlElement = sizeVariants;
        variantCount = sizeVariants.length;
      }
      let images = '';
      let altImagesLen = 0;
      let firstVariant = '';
      for (let i = 0; i < variantCount; i++) {
        // Click each li & bind variant info to each li/img
        // @ts-ignore
        variantUlElement[i].children[0].click();
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        await awaitElement('div.loading', 500);

        const variantInfoEle = document.evaluate('//div[@class="m-product__colors"]//p[contains(text(),\'Color\')]//span/text() | (//ul[@id=\'size-list-container\']/li/*[contains(@class,\'active\')])[1]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
        const variantInfo = variantInfoEle ? variantInfoEle.textContent : '';
        // Prepare secondary images for first variant
        if (i === 0) {
          const altImages = document.evaluate("(//div[not(contains(@class,'pzlvideo'))]/img[contains(@class,'pdpthumb')]/@src)[position()>1]", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          altImagesLen = altImages.snapshotLength;
          console.log('altImagesLen for first variant' + altImagesLen);
          for (let j = 0; j < altImagesLen; j++) {
            images += `${altImages.snapshotItem(j).textContent} | `;
          }
          images = altImagesLen ? images.slice(0, -3) : images;
        }

        const img = variantUlElement[i].children[0].children[0];
        // Making sure  if img is present, if not create dummy img & bind data-skuid to it & img url
        if (img) {
          img.setAttribute('title', variantInfo);
          // Replacing the sku id with variant id
          const sku = img.getAttribute('id');
          if (i === 0) {
            firstVariant = sku;
          }
          img.setAttribute('altImg', images.replace(firstVariant, sku));
          console.log('altImagesLen for variants' + altImagesLen);
          img.setAttribute('altImgCount', altImagesLen.toString());
        } else {
          const sku = variantUlElement[i].children[0].getAttribute('data-skuid');
          if (sku.includes('NONELIGIBLE')) {
            variantUlElement[i].remove();
            i--;
            variantCount--;
          } else {
            const imgEle = document.evaluate('(//li[@class="img-viewer"]/img/@src)[1]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
            const imgUrl = imgEle ? imgEle.nodeValue : '';
            const dummyImg = document.createElement('img');
            if (i === 0) {
              firstVariant = sku;
            }
            dummyImg.setAttribute('title', variantInfo);
            dummyImg.setAttribute('id', sku);
            dummyImg.setAttribute('src', imgUrl);
            dummyImg.setAttribute('altImg', images.replace(firstVariant, sku));
            console.log('altImagesLen for variants' + altImagesLen);
            dummyImg.setAttribute('altImgCount', altImagesLen.toString());
            variantUlElement[i].appendChild(dummyImg);
          }
        }
      }
    });
  }
  return true;
};

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    domain: 'liverpool.mx',
    loadedSelector: 'section.o-product__detail',
    noResultsXPath: '//h1[@class="a-errorPage-title"]',
    zipcode: '',
  },
  implementation,
};
