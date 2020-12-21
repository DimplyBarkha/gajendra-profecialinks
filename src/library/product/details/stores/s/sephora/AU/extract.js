const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'sephora',
    transform,
    domain: 'sephora.com.au',
    zipcode: '',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.evaluate(function () {
      document.cookie = 'locale=au;';
    });

    let scrollTop = 0;
    while (scrollTop !== 10000) {
      try {
        scrollTop += 1000;
        await context.waitForFunction(async function (scrollTop) {
          console.log('SCROLLING');
          window.scroll(0, scrollTop);
          const allProds = document.querySelectorAll('a[data-comp="ProductItem "]');
          const prodsWithImg = document.querySelectorAll('a[data-comp="ProductItem "] img');
        }, { timeout: 1000 }, scrollTop);
      } catch (err) {
        console.log('Failed');
      }
      if (scrollTop === 10000) {
        break;
      }
    }

    // async function selectorClick(sel) {
    //   await context.click(sel);
    //   await new Promise(resolve => setTimeout(resolve, 5000));
    //   await context.click('button[aria-label="Close"]');
    // }

    const videoSources = await context.evaluate(async function (selectorClick) {
      const videoSrcArr = [];
      const closeSel = document.querySelector('button[aria-label="Close"]');
      const videoSelectors = document.querySelectorAll('div.video-image-overlay');
      const videoSrcXpath = '//iframe[@id="video-article-details"]/@src';
      const srcSel = document.querySelector('iframe#video-article-details');

      let i = 0;
      debugger;
      while (i < videoSelectors.length) {
        videoSelectors[i].click();
        await new Promise(resolve => setTimeout(resolve, 5000));
        var videoSrcCheck = document.evaluate(videoSrcXpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (videoSrcCheck.snapshotLength > 0) {
          const checkSrc = videoSrcCheck.snapshotItem(0);
          videoSrcArr.push(`https:${checkSrc.textContent}`);
        }
        closeSel.click();
        await new Promise(resolve => setTimeout(resolve, 4000));
        i++;
      }
      return videoSrcArr;
    });

    // for(let i = 0; i < videoSelectors.length; i++){
    //   context.click(videoSelectors[i])
    //   await new Promise(resolve => setTimeout(resolve, 5000));
    //   context.click('button[aria-label="Close"]')
    // }

    const nameExtended = await context.evaluate(function (parentInput, videoSources) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv('ii_parentInput', parentInput);
      const name = [];
      const variant = '//span[contains(@class, "current-variant-name")]';
      const variant2 = '//ul[contains(@class, "product-variant-swatches")]//li[contains(@class,"product-variant-swatch active")]//@title';
      const names = '//div[@class="basic-information-section"]//div[contains(@class, "product-")]';
      const names2 = '//h1[contains(@class, "product-name")]';
      const brand2 = '//h2[contains(@class, "product-brand")]';
      const directions = '//div[@class="product-details"]/div[contains(.,"How To")]//text()';
      const directions2 = '//div[contains(@class, "product-description")]//div[contains(@id,"product-how-to")]//text()';
      const directionBullets = '//div[contains(@class, "how-to")]//li';
      const directionBullets2 = '//div[contains(@class, "product-description")]//div[contains(@id,"product-how-to")]//li';
      const description = '//div[@class="product-details"]/div[contains(.,"Description")]//text()';
      const description2 = '//div[contains(@class, "product-description")]//div[contains(@id,"product-description")]//text()';
      const descriptionBullets = '//div[contains(@class, "product-description")]//li';
      const descriptionBullets2 = '//div[contains(@class, "product-description")]//div[contains(@id,"product-description")]//li';
      const videoSelectors = document.querySelectorAll('div.video-image-overlay');
      const videoLinks = [];
      var directionsBCheck = document.evaluate(directionBullets, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var descriptionBCheck = document.evaluate(descriptionBullets, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var directionsCheck = document.evaluate(directions, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var descriptionCheck = document.evaluate(description, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var variantCheck = document.evaluate(variant, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var namesCheck = document.evaluate(names, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var directionsBCheck2 = document.evaluate(directionBullets2, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var descriptionBCheck2 = document.evaluate(descriptionBullets2, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var directionsCheck2 = document.evaluate(directions2, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var descriptionCheck2 = document.evaluate(description2, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var variantCheck2 = document.evaluate(variant2, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var namesCheck2 = document.evaluate(names2, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var brandCheck2 = document.evaluate(brand2, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

      if (videoSources) {
        videoSources.forEach(src => {
          addHiddenDiv('ii_video', src);
        });
      }

      if (namesCheck.snapshotLength > 0 || namesCheck2.snapshotLength > 0) {
        const checkName1 = namesCheck.snapshotItem(0) || brandCheck2.snapshotItem(0);
        const checkName2 = namesCheck.snapshotItem(1) || namesCheck2.snapshotItem(0);
        const checkVariant = variantCheck.snapshotItem(0) || variantCheck2.snapshotItem(0);
        if (checkName1) {
          name.push(checkName1.textContent);
        }
        if (checkName2) {
          name.push(checkName2.textContent);
        }
        if (checkVariant) {
          name.push(checkVariant.textContent);
        }

        const fullName = name.join(' - ');
        addHiddenDiv('ii_nameExtended', fullName);
      }

      if (directionsCheck.snapshotLength > 0 || directionsCheck2.snapshotLength > 0) {
        const fullDir = [];
        const snapshotLength = directionsCheck.snapshotLength || directionsCheck2.snapshotLength;
        for (let i = 0; i < snapshotLength; i++) {
          const line = directionsCheck.snapshotItem(i) || directionsCheck2.snapshotItem(i);
          console.log('HERE123' + line);
          if (directionsBCheck.snapshotLength > 0 || directionsBCheck2.snapshotLength > 0) {
            const snapLength = directionsBCheck.snapshotLength || directionsBCheck2.snapshotLength;
            for (let i = 0; i < snapLength; i++) {
              const content = directionsBCheck.snapshotItem(i) || directionsBCheck2.snapshotItem(i);
              if (line.textContent.includes(content.textContent)) {
                line.textContent = ` || ${line.textContent}`;
              }
            }
          }
          fullDir.push(line.textContent);
        }
        const joins = fullDir.join(' ');
        addHiddenDiv('ii_directions', joins);
      }

      if (descriptionCheck.snapshotLength > 0 || descriptionCheck2.snapshotLength > 0) {
        const fullDesc = [];
        const snapshotLength = descriptionCheck.snapshotLength || descriptionCheck2.snapshotLength;
        for (let i = 1; i < snapshotLength; i++) {
          const line = descriptionCheck.snapshotItem(i) || descriptionCheck2.snapshotItem(i);
          if (descriptionBCheck.snapshotLength > 0 || descriptionBCheck2.snapshotLength > 0) {
            const snapLength = descriptionBCheck.snapshotLength || descriptionBCheck2.snapshotLength;
            for (let i = 0; i < snapLength; i++) {
              const content = descriptionBCheck.snapshotItem(i) || descriptionBCheck2.snapshotItem(i);
              if (line.textContent.includes(content.textContent)) {
                line.textContent = ` || ${line.textContent}`;
              }
            }
          }
          fullDesc.push(line.textContent);
        }
        if (descriptionBCheck.snapshotLength > 0 || descriptionBCheck2.snapshotLength > 0) {
          const snapLength = descriptionBCheck.snapshotLength || descriptionBCheck2.snapshotLength;
          addHiddenDiv('ii_descriptionBullets', snapLength);
        }
        const joins = fullDesc.join(' ');
        addHiddenDiv('ii_description', joins);
      }
    }, parentInput, videoSources);

    // await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform: transformParam });
  },
};
