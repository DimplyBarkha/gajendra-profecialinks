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
    context, { productDetails },
  ) => {
    const { transform } = parameters;
    try {
      await context.waitForSelector('iframe#desc_ifr');
    } catch (err) {
      console.log('manufacturer contents not loaded or unavailable');
    }
    // const src = await context.evaluate(async function () {
    //   const iframe = document.querySelector('iframe#desc_ifr');
    //   // @ts-ignore
    //   const src = iframe ? iframe.src : '';
    //   return src;
    // });
    // // await context.extract(productDetails, { transform });
    // if (src) {
    //   try {
    //     await context.setBypassCSP(true);
    //     await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    //     await context.waitForSelector('div#ds_div');
    //     return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
    //   } catch (error) {
    //     try {
    //       await context.setBypassCSP(true);
    //       await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    //       await context.waitForSelector('div#ds_div');
    //       return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
    //     } catch (error) {
    //       console.log('could not load page', error);
    //     }
    //     //   }
    //     // }

    const currentUrl = await context.evaluate(() => {
      return window.location.href;
    });

    // Extracting data from product page
    // await context.extract(productDetails, { transform });

    const src = await context.evaluate(async function () {
      const iframe = document.querySelector('iframe#desc_ifr');
      // @ts-ignore
      const src = iframe ? iframe.src : '';
      return src;
    });
    // await context.extract(productDetails, { transform });
    if (src) {
      try {
        // navigating to iframe src
        console.log(`in the box url is :${src}`);
        await context.setBypassCSP(true);
        await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('div#ds_div');
      } catch (error) {
        console.log('could not load page', error);
      }
    }

    const inTheBoxUrl = await context.evaluate(async function () {
      // const imgArray = document.querySelectorAll('div.lieferleft img');
      const imgArray = document.querySelectorAll('div.inthebox span img');
      const inTheBoxUrlArray = [];
      imgArray.forEach(img => {
        if (img.getAttribute('src')) {
          inTheBoxUrlArray.push(img.getAttribute('src'));
        }
      });
      // const textArray = document.querySelectorAll('div.lieferleft p');
      const textArray = document.querySelectorAll('div.inthebox span.title');
      const inTheBoxText = [];
      textArray.forEach(txt => {
        if (txt.innerText) {
          inTheBoxText.push(txt.innerText);
        }
      });
      console.log('inTheBox code execution complete');

      function getNodesFromxpath (STR_XPATH, context) {
        var xresult = document.evaluate(
          STR_XPATH,
          context,
          null,
          XPathResult.ANY_TYPE,
          null,
        );
        var xnodes = [];
        var xres;
        while ((xres = xresult.iterateNext())) {
          xnodes.push(xres);
        }
        return xnodes;
      }
      // const compareTableXpath = '//p[contains(.,"Vergleich")]';
      const compareTableXpath = '//h1[contains(.,"Vergleich")]';
      const comparisionTable = getNodesFromxpath(compareTableXpath, document);

      const aplusImages = document.querySelectorAll('div.gallery_d img, label img, div.feature span img, div.inthebox span img, div.brand img');
      const aplusImage = [];
      aplusImages.forEach(img => {
        if (img.getAttribute('src')) {
          aplusImage.push(img.getAttribute('src'));
        }
      });
      const manufacturercDescr = document.querySelector('div#ds_div .container.threes');
      const manufacturercDesc = manufacturercDescr && manufacturercDescr.innerText.trim();

      let specsText = '';
      if (document.querySelectorAll('div[class*="p-wrapper"] div[class*="p-spec"]').length !== 0) {
        const specDivs = document.querySelectorAll('div[class*="p-wrapper"] div[class*="p-spec"]');
        for (let i = 0; i < specDivs.length; i++) {
          if (specDivs[i].querySelector('span[class*="p-val"]') && specDivs[i].querySelector('span[class*="p-val"]').innerText !== '') { specsText += specDivs[i].querySelector('span[class*="p-title"]').innerText + ' || ' + specDivs[i].querySelector('span[class*="p-text"]').innerText + ' || '; }
          if (specDivs[i].querySelector('b') && specDivs[i].querySelector('b').innerText !== '') { specsText += specDivs[i].querySelector('p').innerText + ' || '; }
        }
      } else if (document.querySelectorAll('table td div[id*="ds_div"] p')) {
        const specsParas = document.querySelectorAll('table td div[id*="ds_div"] p');
        for (let i = 0; i < specsParas.length; i++) {
          if (!specsParas[i].innerText.includes('Specifications')) { specsText += specsParas[i].innerText + ' || '; }
        }
      }
      if (document.querySelectorAll('div[class*="container"] div[class="spec"]').length !== 0) {
        const specDivs = document.querySelectorAll('div[class*="container"] div[class="spec"]');
        for (let i = 0; i < specDivs.length; i++) {
          if (specDivs[i].querySelector('span[class*="val"]') && specDivs[i].querySelector('span[class*="val"]').innerText !== '') { specsText += specDivs[i].querySelector('span[class*="title"]').innerText + ' || ' + specDivs[i].querySelector('span[class*="val"]').innerText + ' || '; }
          if (specDivs[i].querySelector('b') && specDivs[i].querySelector('b').innerText !== '') { specsText += specDivs[i].querySelector('p').innerText + ' || '; }
        }
      }

      return { inTheBoxUrlArray, inTheBoxText, comparisionTable, aplusImage, specsText, manufacturercDesc };
    });

    await context.goto(currentUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

    try {
      await context.waitForSelector('iframe#desc_ifr');
    } catch (err) {
      console.log(err);
    }

    await context.evaluate(async function (inTheBoxUrl) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      if (inTheBoxUrl.comparisionTable.length > 0) {
        addHiddenDiv('hasComparisionTable', 'Yes');
      }

      const inTheboxText = inTheBoxUrl.inTheBoxText.join(' || ');
      addHiddenDiv('inTheBoxText', inTheboxText);

      const inTheboxUrls = inTheBoxUrl.inTheBoxUrlArray.join(' || ');
      addHiddenDiv('inTheBoxUrl', inTheboxUrls);

      console.log('inTheBox code execution completed');

      const aplusImages = inTheBoxUrl.aplusImage.join(' || ');
      addHiddenDiv('manufacturerImages', aplusImages);

      addHiddenDiv('manufacturercDesc', inTheBoxUrl.manufacturercDesc);

      addHiddenDiv('specsDiv', inTheBoxUrl.specsText);
    }, inTheBoxUrl);
    return await await context.extract(productDetails, { transform });
  },
};
