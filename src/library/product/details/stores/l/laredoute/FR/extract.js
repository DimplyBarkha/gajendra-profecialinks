const { transform } = require('./format');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { helperModule: { Helpers }, productDetails } = dependencies;
  const helper = new Helpers(context);
  await helper.ifThereClickOnIt('#footer_tc_privacy_button', { wait: 30000, click: 3000 });
  await helper.ifThereClickOnIt('div.productDescriptionShowMore-container', { wait: 30000, click: 3000 });
  // pop up is not allowing us to scroll.
  await helper.ifThereClickOnIt('.popin-btn-close.close', 20000);
  await helper.ifThereClickOnIt('#btn-close', 35000);
  await helper.ifThereClickOnIt('button[id="popin_tc_privacy_button"]', 8000);

  const applyScroll = async function (timeout) {
    let loopCounter = 0;
    let scrollTop = 0;
    const waitingTime = 500;
    const limit = Math.ceil(timeout / waitingTime);
    const increment = 1000;
    while (loopCounter < limit && scrollTop < 10000) {
      scrollTop += increment;
      loopCounter += 1;
      await context.evaluate((scrollTop) => {
        window.scroll(0, scrollTop);
      }, scrollTop);
      await new Promise(resolve => setTimeout(resolve, waitingTime));
    }
  };
  await applyScroll(10000);
  await helper.ifThereClickOnIt('button[id*=productDescriptionShowMore]', 5000);
  await helper.ifThereClickOnIt('div.flixmedia_expandBtn.flixmedia_expandBtn--more', 5000);

  async function scrollToRec(node) {
    await context.evaluate(async (node) => {
      const element = document.querySelector(node) || null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 5000);
        });
      }
    }, node);
  }
  await scrollToRec('#footer');
  const cssEnhancedContentContainer = '#pdpFlixmediaZone'
  await context.waitForSelector(cssEnhancedContentContainer, { timeout: 10000 }).catch(error => console.log('Enhanced content not loaded : #pdpFlixmediaZone'));
  await context.evaluate(async (css) => {
    const node = document.querySelector(css);
    node ? node.removeAttribute('style') : console.log('Selector not found: CSS => ', css);
  }, cssEnhancedContentContainer);

  await context.reload()
  await context.waitForNavigation({ waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 30000));
  try {
    await context.waitForSelector('#inpage_container', { timeout: 30000 });
    console.log('Inpage container loaded successfully')
    await applyScroll(5000);
  } catch (er) {
    console.log("Couldn't find the enhanced content expand button");
  }
  try {
    await context.waitForSelector('div.flixmedia_expandBtn.flixmedia_expandBtn--more', { timeout: 30000 });
    await helper.ifThereClickOnIt('div.flixmedia_expandBtn.flixmedia_expandBtn--more', 60000);
    console.log('see more button is clicked successfully');
  } catch (e) {
    console.log('some error occured while clicking the see more button')
  }

  await new Promise(resolve => setTimeout(resolve, 60000));

  await helper.ifThereClickOnIt('#footer_tc_privacy_button', { wait: 30000, click: 3000 });
  await helper.ifThereClickOnIt('div.productDescriptionShowMore-container', { wait: 30000, click: 3000 });
  // pop up is not allowing us to scroll.
  await helper.ifThereClickOnIt('.popin-btn-close.close', 20000);
  await helper.ifThereClickOnIt('#btn-close', 35000);
  await helper.ifThereClickOnIt('button[id="popin_tc_privacy_button"]', 8000);

  const variantArray = await context.evaluate(async function () {
    if (document.querySelector('#productList')) {
      throw new Error('Not a product page');
    }
    if (document.querySelectorAll('div.clearfix.custom-dropdown-content button')) {
      const variantArray = document.querySelectorAll('div.clearfix.custom-dropdown-content button');
      return variantArray;
    }
  });
  if (variantArray) {
    for (let i = 0; i < variantArray.length; i++) {
      variantArray[i].click();
      await context.waitForSelector('div.pdp-filter-thumbnail');
      await context.extract(productDetails, { transform }, { type: 'APPEND' });
    }
  }

  await helper.ifThereClickOnIt('button[id*=productDescriptionShowMore]', 5000);
  // await helper.ifThereClickOnIt('div.flixmedia_expandBtn.flixmedia_expandBtn--more', 5000);

  // async function scrollToRec(node) {
  //   await context.evaluate(async (node) => {
  //     const element = document.querySelector(node) || null;
  //     if (element) {
  //       element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  //       await new Promise((resolve) => {
  //         setTimeout(resolve, 5000);
  //       });
  //     }
  //   }, node);
  // }
  // await scrollToRec('#footer');

  await context.evaluate(async function () {
    const specificationsXpath = '//div[@id=\'mainProductDescription\']//b[contains(text(),\'Spécifications\') or contains(text(),"Caractéristiques") or contains(text(),\'Informations produit\')]/following-sibling::text()|//h2[contains(text(),\'Caractéristiques détaillées\')]/following-sibling::node()|text()|//div[@id=\'mainProductDescription\']//text()[contains(.,"Dimensions")]//following-sibling::text()[not(//div[@id=\'mainProductDescription\']//b[contains(text(),\'Spécifications\') or contains(text(),"Caractéristiques") or contains(text(),\'Informations produit\')]/following-sibling::text()|//h2[contains(text(),\'Caractéristiques détaillées\')]/following-sibling::node()|text())] | //tr[contains(.,"Dimensions")]/following-sibling::tr[following::tr[contains(.,"Contenu du carton")]] | //tr[contains(.,"Dimensions")] | //div[contains(@class,"specification")]/div[@class="flix-std-container-fluid"]';
    function _x(STR_XPATH, context) { // gets nodes using xpath
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
    const specificationsText = [];
    _x(specificationsXpath, document).forEach(q => { specificationsText.push(q.textContent); });
    document.body.insertAdjacentHTML('afterbegin', `<div id="specifications" style="display : none">${specificationsText.join(' ')}</div>`);
  });

  // sometimes enhanced content does not load, and sometimes it loads but is hidden
  // const cssEnhancedContentContainer = '#pdpFlixmediaZone'
  // await context.waitForSelector(cssEnhancedContentContainer, { timeout: 10000 }).catch(error => console.log('Enhanced content not loaded : #pdpFlixmediaZone'));
  // await context.evaluate(async (css) => {
  //   const node = document.querySelector(css);
  //   node ? node.removeAttribute('style') : console.log('Selector not found: CSS => ', css);
  // }, cssEnhancedContentContainer);

  await context.waitForXPath('//div[@id="pdpFlixmediaZone" and not(contains(@style,"none"))]', { timeout: 30000 })
    .catch(() => {
      console.log('===== The enhanced content did not load or is not present.');
    });
  // await helper.ifThereClickOnIt('div.flixmedia_expandBtn.flixmedia_expandBtn--more', 6000);
  // await applyScroll(5000);
  // await context.reload()
  // await context.waitForNavigation({ waitUntil: 'networkidle0' });
  // await new Promise(resolve => setTimeout(resolve, 30000));
  // try {
  //   await context.waitForSelector('#inpage_container', { timeout: 30000 });
  //   console.log('Inpage container loaded successfully')
  // } catch (er) {
  //   console.log("Couldn't find the enhanced content expand button");
  // }
  // try {
  //   await context.waitForSelector('div.flixmedia_expandBtn.flixmedia_expandBtn--more', { timeout: 30000 });
  //   await helper.ifThereClickOnIt('div.flixmedia_expandBtn.flixmedia_expandBtn--more', 60000);
  //   console.log('see more button is clicked successfully');
  // } catch (e) {
  //   console.log('some error occured while clicking the see more button')
  // }

  // await new Promise(resolve => setTimeout(resolve, 60000));

  await context.evaluate(async function () {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const isVisible = (element) => document.querySelector(element) ? !!(document.querySelector(element).offsetWidth || document.querySelector(element).offsetHeight) : false;

    const content = {};
    content.description = document.querySelector('#inpage_container') && isVisible('#inpage_container') ? document.querySelector('#inpage_container').innerText : '';
    addHiddenDiv('manufacturerDescription', content.description);
    content.images = [];
    const imagesNodes = document.querySelectorAll('#inpage_container img');
    imagesNodes.forEach(q => {
      if (q.hasAttribute('srcset')) {
        // content.images.push(q.getAttribute('srcset'));
        addHiddenDiv('manfacturerImage', q.getAttribute('srcset'));
      } else if (q.hasAttribute('data-flixsrcset')) {
        let imageString = q.getAttribute('data-flixsrcset');
        let imageArray = imageString.split(',');
        let imageUrl = imageArray && imageArray[imageArray.length - 1];
        let imageLink = imageUrl.trim() && imageUrl.trim().split(' ') && imageUrl.trim().split(' ')[0];
        addHiddenDiv('manfacturerImage', imageLink);
      }
    });
    content.videos = [];
    const videoNodes = document.querySelectorAll('#inpage_container iframe');
    videoNodes.forEach(q => {
      if (q.hasAttribute('src')) {
        // content.videos.push(q.getAttribute('src'));
        addHiddenDiv('videos', q.getAttribute('src'));
      }
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'laredoute',
    transform,
    domain: 'laredoute.fr',
    zipcode: '',
  },
  implementation,
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    helperModule: 'module:helpers/helpers',
  },
};
