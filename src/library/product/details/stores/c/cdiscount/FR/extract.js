const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // Using variant SKU array from 'prodSkus' to preform fetch for manufacturer information for each variant
  async function collectManuf (variants) {
    // Must first goto the scontent.webcollage to get credentials for next fetch
    await context.goto('https://scontent.webcollage.net#[!opt!]{"type":"js","init_js":""}[/!opt!]', { timeout: 20000, waitUntil: 'load', checkBlocked: true });
    const manufArray = [];
    // Looping through each variant SKU
    for (let i = 0; i < variants.length; i++) {
      const html = await context.evaluate(async function getEnhancedContent (variants, i) {
        // Recursive retry for fetches failures
        async function fetchRetry (url, n) {
          function handleErrors (response) {
            if (response.status === 200) {
              return response;
            } else {
              console.log('FETCH FAILED');
              if (n === 1) return 'Nothing Found';
              return fetchRetry(url, n - 1);
            }
          }
          const fetched = fetch(url).then(handleErrors).then(response => response.text()).catch(function () {
            console.log('FETCH FAILED');
            if (n === 1) return 'Nothing Found';
            return fetchRetry(url, n - 1);
          });
          return fetched;
        }
        return await fetchRetry(`https://scontent.webcollage.net/cdiscount-fr/power-page?ird=true&channel-product-id=${variants[i]}`, 10);
      }, variants, i);

      const regex = /html: "(.+)"\n\s\s\}\n\};/s;
      let text = 'Not Found';
      console.log('html -------> ', html);
      // Checking the output of fetchRetry, if the output contains an "html" object it is collected and stored in the manufArray
      if (html.match(regex)) {
        text = html.match(regex)[1];
      }
      // Trimming the object so that it can be appended to the DOM
      text = text.replace(/html: /g, '');
      manufArray.push(text);
    }
    return manufArray;
  }
  // Hardcoded as sku as of now as trying to solve the loading issue for this
  const htmlList = [];
  // const htmlList = await collectManuf(['DYS5025155028155']);

  await context.evaluate(async function (url, htmlList) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // addHiddenDiv('added-htmlList', htmlList[0]);

    console.log('page is loaded successfully....executing scrolling code');
    // Scrolling till specifications as manufacturer images are loaded on website after scrolling down
    await new Promise(resolve => setTimeout(resolve, 10000));
    async function scrollToLoadAplusImages () {
      let scrollSelector = document.querySelector('div[id="presContent"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('div[id="descContent"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    }
    await scrollToLoadAplusImages();
    console.log('scrolling code execution complete.....');

    // If images are present in description then add to manufacturerDescription else add to description
    const manufacturerImageFlag = document.querySelector('div[id="inpage_container"] img');
    const descriptionSelector = document.querySelector('div[id="inpage_container"]');
    let description = descriptionSelector ? descriptionSelector.innerText : '';
    description = description ? description.replace(/(\n\s*){1,}/g, ' || ') : '';
    // description = description ? description.replace(/\|\| Key Features/gm, 'Key Features') : '';
    if (manufacturerImageFlag) {
      addHiddenDiv('added-manufacturerDesc', description);
    } else {
      addHiddenDiv('added-description', description);
    }
  }, inputs.url, htmlList);
  await new Promise(resolve => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    transform,
    domain: 'cdiscount.com',
    zipcode: '',
  },
  implementation,
};
