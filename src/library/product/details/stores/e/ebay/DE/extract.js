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
      })
      //const textArray = document.querySelectorAll('div.lieferleft p');
      const textArray = document.querySelectorAll('div.inthebox span.title');
      const inTheBoxText = [];
      textArray.forEach(txt => {
        if (txt.innerText) {
          inTheBoxText.push(txt.innerText);
        }
      });
      console.log('inTheBox code execution complete');

      function getNodesFromxpath(STR_XPATH, context) {
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

      return { inTheBoxUrlArray, inTheBoxText, comparisionTable };
    });

    await context.goto(currentUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

    await context.evaluate(async function (inTheBoxUrl) {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }


      if (inTheBoxUrl.comparisionTable.length > 0) {
        addHiddenDiv('hasComparisionTable', 'Yes');
      }

      const inTheboxText = inTheBoxUrl.inTheBoxUrlArray.join(' || ')
      addHiddenDiv('inTheBoxText', inTheboxText);

      const inTheboxUrls = inTheBoxUrl.inTheBoxText.join(' || ')
      addHiddenDiv('inTheBoxUrl', inTheboxUrls);

    }, inTheBoxUrl);
    console.log('inTheBox code execution completed');
    return await await context.extract(productDetails, { transform });

  },
};
