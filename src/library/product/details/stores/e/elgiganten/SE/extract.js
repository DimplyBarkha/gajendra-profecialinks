const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('div#coiOverlay:not([style*="none"])');
    await context.click('div#coiOverlay:not([style*="none"]) button.coi-banner__accept[aria-label*="JAG"]');
  } catch (error) {
    console.log('cookie pop up not loded', error);
  }
  const hasBtn = await context.evaluate(async function () {
    return Boolean(document.querySelector('button.coi-banner__accept'));
  });

  if (hasBtn) {
    try {
      await context.click('button.coi-banner__accept');
    } catch (exception) {
      console.log('Unable to click accept button');
    }
  }
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);

  try {
    await context.waitForSelector('div.recommended-products', { timeout: 35000 });
  } catch (error) {
    console.log('No recommended products ');
  }

  // need to check if this is a listing page or not

  let thisIsListingPage = false;
  let prodRowSel = 'div[id*="searchProductsInfo"] div[class*="product-list"] div[class="mini-product-content"]';
  try {
    await context.waitForSelector(prodRowSel);
    thisIsListingPage = true;
  } catch(err) {
    console.log('got some error while waiting for listing page', err.message);
  }
  console.log('thisIsListingPage', thisIsListingPage);

  if(thisIsListingPage) {

    await context.evaluate(async (prodRowSel, idToCheck) => {
      console.log('we need to check prodRowSel', prodRowSel);
      console.log('idToCheck', idToCheck);
      let allProds = document.querySelectorAll(prodRowSel);
      let prodFound = false;
      if(allProds && allProds.length > 0) {
        console.log('got these many prods', allProds.length);
        for(let i = 0; i < allProds.length; i++) {
          let thisProd = allProds[i];
          let thisIdElm = thisProd.querySelector('div[class*="product-number sku"]');
          let thisId = '';
          if(thisIdElm) {
            thisId = thisIdElm.innerText;
            console.log('thisId', thisId);
            if(thisId.toString() === idToCheck.toString()) {
              let prodNameElm = thisProd.querySelector('a[class*="product-name"]');
              if(prodNameElm) {
                prodNameElm.click();
                prodFound = true;
                await new Promise(resolve => setTimeout(resolve, 10000));
                break;
              }
            }
          }
        }

        console.log('prodFound', prodFound);

      } else {
        console.log('do not have any product here in this page');
      }

    }, prodRowSel, inputs.id);

  }

  let detailsPageSel = 'div.product-detail-page';
  try {
    await context.waitForSelector(detailsPageSel);
    console.log('got the prod page');
  } catch(err) {
    console.log('got some error while waiting for details page', err.message);
    try {
      await context.waitForSelector(detailsPageSel);
      console.log('got the prod page');
    } catch(error) {
      console.log('got some error while waiting for details page', error.message);
    }
  }

  async function scrollToRec (node) {
    await context.evaluate(async function (node) {
      var element = (document.querySelector(node)) ? document.querySelector(node) : null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 7000);
        });
      }
    }, node);
  }
  await scrollToRec('section.article-page');
  await scrollToRec('div.recommended-products');
  try {
    await context.waitForSelector('iframe.videoly-box', { timeout: 30000 });
  } catch (error) {
    console.log('No video ');
  }
  await context.evaluate(async () => {
    function addHiddenDiv (vidurl, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('data-vidurl', vidurl);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    if (document.querySelector('section.section.product-more-info')) {
      // @ts-ignore
      document.querySelector('li#tab-specs').click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else if (document.querySelector('div.tab-specs-row')) {
      // @ts-ignore
      document.querySelector('li#tab-more-info').click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const sku = document.querySelector('p[data-product-sku]') ? document.querySelector('p[data-product-sku]').getAttribute('data-product-sku'): null;
    // @ts-ignore
    const name = document.querySelector('h1.product-title') ? document.querySelector('h1.product-title').innerText : null;
    const vidApiUrl = `https://dapi.videoly.co/1/videos/0/407/?SKU=${sku}&productTitle=${name}&hn=www.elgiganten.se`;
    let videoApi = {};
    try {
      videoApi = await fetch(vidApiUrl,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          method: 'GET',
        },
      ).then(x => x.json());
    } catch(err) {
      console.log('got some error while getting data from api', err.message);
    }

    if(videoApi.hasOwnProperty('items')) {
      const video = videoApi.items;
      let videoUrl;
      video.forEach(vid => {
        videoUrl = `https://youtu.be/${vid.videoId}`;
        addHiddenDiv('vidURL', videoUrl);
      });
    } else {
      console.log('there is not items attr in api response - need to check how to fetch the api');
    }
    
  });
  try {
    await context.click('[data-template="ProductMoreInformationTab"]');
    await context.click('data-template="ProductSpecificationTab"');
  } catch (err) {
    console.log('Error while clicking more');
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'elgiganten',
    transform: transform,
    domain: 'elgiganten.se',
    zipcode: '',
  },
  implementation,
};
