module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'breuninger',
    domain: 'breuninger.de',
    loadedSelector: 'div[class*="active"] img[class="bewerten-bild"][alt*="1"], h1.next-chapter',
    noResultsXPath: '//*[contains(.,"Leider konnten wir den gewünschten Artikel nicht finden")]',
    // noResultsXPath: '//p[@class="shop-copytext bewerten-out-of-stock-banner__text"] | //*[contains(.,"Leider konnten wir den gewünschten Artikel nicht finden")]',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    console.log('params', parameters);
    // const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
    const url = inputs.url
    await dependencies.goto({ url, zipcode: inputs.zipcode });

    // checking if popup exists and if so, closing it
    let acceptButtonPresent = await context.evaluate(async function () {
      if (document.querySelector('button[id="uc-btn-accept-banner"]')) { return Boolean(document.querySelector('button[id="uc-btn-accept-banner"]')); }
      return null;
    });

    if(!acceptButtonPresent) {
      try {
        await context.waitForSelector('button[id="uc-btn-accept-banner"]');
        console.log('found the pop up button');
      } catch(err) {
        console.log('got some error while waiting for button', err.message);
        try {
          await context.waitForSelector('button[id="uc-btn-accept-banner"]');
          console.log('found the pop up button, finally');
        } catch(err) {
          console.log('got some error while waiting for button, again', err.message);
        }
      }

      acceptButtonPresent = await context.evaluate(async function () {
        if (document.querySelector('button[id="uc-btn-accept-banner"]')) { return document.querySelector('button[id="uc-btn-accept-banner"]'); }
        return null;
      });
    }

    if (acceptButtonPresent) {
      await context.click('button[id="uc-btn-accept-banner"]');
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    }

    if (parameters.loadedSelector) {
      try {
        await context.waitForFunction(function (sel, xp) {
          return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
        }, { timeout: 30000 }, parameters.loadedSelector, parameters.noResultsXPath);
      } catch(err) {
        console.log('we got some error', err.message);
      }
    }
  
    let loadedSelLoaded = false;
    if(parameters.loadedSelector) {
      console.log('need to check for the loaded selector', parameters.loadedSelector);
      loadedSelLoaded = await context.evaluate(async (loadedSelector) => {
        let elm = document.querySelectorAll(loadedSelector);
        if(elm && elm.length > 0) {
          return true;
        }
        return false;
      }, parameters.loadedSelector);
      let thisTime = 0;
      let maxTime = 20000;
      while(!loadedSelLoaded && (thisTime < maxTime)) {
        loadedSelLoaded = await context.evaluate(async (loadedSelector) => {
          let elm = document.querySelectorAll(loadedSelector);
          if(elm && elm.length > 0) {
            return true;
          }
          return false;
        }, parameters.loadedSelector);
        thisTime += 5000;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
  
      console.log('waited for', thisTime);
      console.log('loadedSelLoaded', loadedSelLoaded);
      if(loadedSelLoaded) {
        return loadedSelLoaded;
      }
    }
    console.log('Checking no results', parameters.noResultsXPath);
    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, parameters.noResultsXPath);
  },
};
