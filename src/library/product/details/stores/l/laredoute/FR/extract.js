const { transform } = require('./format');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    //pop up is not allowing us to scroll.
    try {
      await context.waitForSelector('.popin-btn-close.close', {timeout: 20000});
    } catch(er) {}
    const clossePopUp = await context.evaluate(async function() {
      console.log("trying to close pop");
      const popUpSelector = '.popin-btn-close.close';
      if(document.querySelector(popUpSelector)) {
        document.querySelector(popUpSelector).click();
      }
    });
    
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
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
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

  try {
    await context.click('button[id*=productDescriptionShowMore]');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.click('div.flixmedia_expandBtn.flixmedia_expandBtn--more');
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  } catch (e) {
    console.log("some error occurred while clicking show more button")
  }

  await context.evaluate(async function () {
    let specificationsXpath = `//div[@id='mainProductDescription']//b[contains(text(),'Spécifications') or contains(text(),"Caractéristiques") or contains(text(),'Informations produit')]/following-sibling::text()|//h2[contains(text(),'Caractéristiques détaillées')]/following-sibling::node()|text()|//div[@id='mainProductDescription']//text()[contains(.,"Dimensions")]//following-sibling::text()[not(//div[@id='mainProductDescription']//b[contains(text(),'Spécifications') or contains(text(),"Caractéristiques") or contains(text(),'Informations produit')]/following-sibling::text()|//h2[contains(text(),'Caractéristiques détaillées')]/following-sibling::node()|text())] | //tr[contains(.,"Dimensions")]/following-sibling::tr[following::tr[contains(.,"Contenu du carton")]] | //tr[contains(.,"Dimensions")]`;
    function _x(STR_XPATH, context) { //gets nodes using xpath
      var xresult = document.evaluate(
        STR_XPATH,
        context,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      var xnodes = [];
      var xres;
      while ((xres = xresult.iterateNext())) {
        xnodes.push(xres);
      }
      return xnodes;
    }
    let specificationsText = [];
    _x(specificationsXpath, document).forEach(q => { specificationsText.push(q.textContent) });
    document.body.insertAdjacentHTML("afterbegin", `<div id="specifications" style="display : none">${specificationsText.join(" ")}</div>`)
  });
  try {
    await context.waitForXPath('//div[@id="pdpFlixmediaZone" and not(contains(@style,"none"))]', { timeout: 30000 });
  } catch (er) {
    console.log("Couldn't find the enhanced content expand button");
  }
  await context.evaluate(async function () {
    let buttonExpand = document.evaluate('//div[contains(@class,"flixmedia_expandBtn") and contains(.,"Voir plus de contenu")]', document).iterateNext();
    if (buttonExpand) {
      buttonExpand.click();
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const desc = document.querySelector("div#mainProductDescription");
    if (desc) {
      const specDesc = desc.innerText;
      if (specDesc.includes('Dans la boîte')) {
        let inTheBoxText = specDesc.match(/Dans la boîte\s:(.+)/gm) ? specDesc.match(/Dans la boîte\s:(.+)/gm)[0] : '';
        inTheBoxText = inTheBoxText.replace(/Dans la boîte\s:/gm, '');
        addHiddenDiv('ii_inTheBoxText', inTheBoxText);
      }
    }
  });

  const enhancedContent = await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let content = {};
    content.description = document.querySelector("#inpage_container") ? document.querySelector("#inpage_container").innerText : "";
    addHiddenDiv('manufacturerDescription', content.description);
    content.images = [];
    let imagesNodes = document.querySelectorAll("#inpage_container img");
    imagesNodes.forEach(q => {
      if (q.hasAttribute('srcset')) {
        //content.images.push(q.getAttribute('srcset'));
        addHiddenDiv('manfacturerImage', q.getAttribute('srcset'));
      }
    });
    content.videos = [];
    let videoNodes = document.querySelectorAll("#inpage_container iframe");
    videoNodes.forEach(q => {
      if (q.hasAttribute('src')) {
        //content.videos.push(q.getAttribute('src'));
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
};
