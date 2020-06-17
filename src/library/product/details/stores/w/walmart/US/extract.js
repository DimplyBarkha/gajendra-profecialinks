const { transform } = require('./transform');

/*
*  @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    transform: transform,
    domain: 'walmart.com',
  },
  dependencies: {
    goto: 'action:navigation/goto',
    createUrl: 'action:product/details/createUrl',
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, dependencies) => {
    async function getVariants () {
      const variants = await context.evaluate(function () {
        const variantList = [];
        const node = document.querySelector("script[id='item']");
        if (node) {
          const elements = node.textContent.match(/({"productId":")(\w+)/g);
          if (elements && elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
              console.log(i);
              const id = elements[i].split(':')[1].replace(/"/g, '');
              if (id) {
                variantList.push(id);
              }
            }
          }
        }
        return variantList;
      });
      return variants;
    };
    async function addUrl () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      let url = window.location.href;
      const splits = url ? url.split('?')[0].split('/') : [];
      url = (splits.length > 1) ? splits[splits.length - 2] : '';
      addHiddenDiv('added-sku', url);
    }

    async function scrollForIframe () {
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
    }

    async function collectEnhancedContent () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const elemsInIframes = (selector, prop) => [
        // @ts-ignore
        ...[...document.querySelectorAll('iframe')].reduce((acc, frame) => {
          return [...acc, ...[...frame.contentWindow.document.querySelectorAll(selector)].map(v => v[prop || 'src'])];
        }, []),
        // @ts-ignore
        ...[...document.querySelectorAll(selector)].map(v => v[prop || 'src']),
      ];
      const elemInIframes = (selector, prop) => [
        // @ts-ignore
        ...[...document.querySelectorAll('iframe')].reduce((acc, frame) => {
          return [...acc, ...[...frame.contentWindow.document.querySelectorAll(selector)].map(v => v.innerText)];
        }, []),
        // @ts-ignore
        ...[...document.querySelectorAll(selector)].map(v => v.innerText),
      ];
      const wcBody = elemInIframes("div[class*='wc-aplus']");
      addHiddenDiv('added-aplus-body', wcBody);
      const images = elemsInIframes("img[class*='wc-image']");
      if (images) {
        images.forEach(img => addHiddenDiv('added-aplus', img));
      }
    }

    const allVariants = await getVariants();
    await context.evaluate(scrollForIframe);
    await context.evaluate(collectEnhancedContent, [], 'iframe[id="iframe-AboutThisItem-marketingContent"]');
    await context.evaluate(addUrl);
    await context.extract(dependencies.productDetails, { transform: transformParam, type: 'APPEND' });
    console.log(allVariants);
    // start at 1 to skip the first variant which is this page
    for (let i = 1; i < allVariants.length; i++) {
      try {
        const id = allVariants[i];
        const url = await dependencies.createUrl({ id });
        await dependencies.goto({ url });
        await context.evaluate(scrollForIframe);
        await context.evaluate(collectEnhancedContent, [], 'iframe[id="iframe-AboutThisItem-marketingContent"]');
        await context.evaluate(addUrl);
        await context.extract(dependencies.productDetails, { transform: transformParam, type: 'APPEND' });
        const pageVariants = await getVariants();
        for (let j = 0; j < pageVariants.length; j++) {
          const pageVariant = pageVariants[j];
          if (allVariants.indexOf(pageVariant) === -1) {
            allVariants.push(pageVariant);
          }
        }
      } catch (exception) {
        console.log(exception);
      }
    }
  },
};
