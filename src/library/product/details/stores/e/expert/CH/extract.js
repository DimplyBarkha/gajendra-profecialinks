const { cleanUp } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // Loading issue of warranty and youtube videos
  await context.waitForSelector('#portalVariables');
  await context.evaluate(async () => {
    async function infiniteScroll () {
      let prevScroll = document.documentElement.scrollTop;
      while (true) {
        window.scrollBy(0, document.documentElement.clientHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const currentScroll = document.documentElement.scrollTop;
        if (currentScroll === prevScroll) {
          break;
        }
        prevScroll = currentScroll;
      }
    }
    await infiniteScroll();
  });
  // await context.waitForMutuation('body', { timeout: 30000 });
  await context.waitForXPath("//div[contains(@id,'returnsAndWarranty')]//button[contains(.,'Mehr anzeigen')] | //div[contains(@class,'lineSeparator') and (.//*[contains(@id,'returnsAndWarranty')])]//button[contains(.,'Mehr anzeigen')]");
  try {
    await context.waitForXPath("//div[contains(@id,'youtube')]//img/@srcset | //div[contains(@class,'lineSeparator') and (.//*[contains(@id,'youtube')])]//div[contains(@class,'expandablePanel')]//img/@srcset");
  } catch (e) {
    console.log('Youtube Videos not found', e);
  }
  // End
  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    function findXpath (xpath) {
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const productDetails = element.textContent;
      return productDetails;
    }
    function findXpathArr (xpath) {
      const element = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
      let node = element.iterateNext();
      const value = [];
      while (node) {
        value.push(node.textContent);
        node = element.iterateNext();
      }
      return value;
    }
    function clickXpath (xpath) {
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // @ts-ignore
      element && element.click();
    }
    function findAndFormatArr (xpath, id) {
      const values = findXpathArr(xpath);
      if (values) {
        let text = '';
        values.forEach((item, index) => {
          if (index % 2 === 0) {
            text += item.trim() + ' : ';
          } else {
            text += item.trim() + ' || ';
          }
        });
        addHiddenDiv(id, text.slice(0, -4));
      };
    }
    clickXpath("//div[contains(@id,'description')]//button[contains(.,'Mehr anzeigen')] | //div[contains(@class,'lineSeparator') and (.//*[contains(@id,'description')])]//button[contains(.,'Mehr anzeigen')]");
    await new Promise(resolve => setTimeout(resolve, 100));
    clickXpath("//div[contains(@id,'specifications')]//button[contains(.,'Mehr anzeigen')] | //div[contains(@class,'lineSeparator') and (.//*[contains(@id,'specifications')])]//button[contains(.,'Mehr anzeigen')]");
    await new Promise(resolve => setTimeout(resolve, 100));
    clickXpath("//div[contains(@id,'returnsAndWarranty')]//button[contains(.,'Mehr anzeigen')] | //div[contains(@class,'lineSeparator') and (.//*[contains(@id,'returnsAndWarranty')])]//button[contains(.,'Mehr anzeigen')]");
    await new Promise(resolve => setTimeout(resolve, 100));
    // eslint-disable-next-line quotes
    let id = findXpath(`//script[contains(@type,'application/ld+json') and contains(.,'"@type":"Product"')]`);
    id = id.replace(/.*(?:"sku":(.*?),.*)/, '$1');
    addHiddenDiv('ii_sku', id);
    // eslint-disable-next-line quotes
    let categoryNode = findXpath(`//script[contains(@type,'application/ld+json') and contains(.,'"@type":"BreadcrumbList"')]`);
    categoryNode = JSON.parse(categoryNode) ? JSON.parse(categoryNode) : {};
    const category = [];
    categoryNode && categoryNode.itemListElement && categoryNode.itemListElement.forEach(item => {
      item.name && category.push(item.name);
    });
    const brand = findXpath("//meta[contains(@property,'og:brand')]/@content");
    brand && category.push(brand);
    console.log('Category::', category);
    category.forEach(item => {
      addHiddenDiv('ii_category', item);
    });
    const variantCount = findXpathArr('//div[contains(@id,\'Farbvariante\')]//a[contains(@class,\'styled\')]/@href');
    console.log('variant count::', variantCount.length);
    if (variantCount.length > 0) {
      addHiddenDiv('ii_varInfo', findXpath('//table[(./thead[contains(.,\'Farbe\')])]//tbody//td[contains(.,\'Farbgruppe\')]/following-sibling::td'));
      addHiddenDiv('ii_firstVariant', id);
    }
    findXpathArr('//div[contains(@id,\'slide\')][position()>1]//picture[contains(@class,\'mediaPicture\')]//source[1]/@srcset | //div[contains(@id,\'slide\') and (./div[contains(@class,\'mediaVideo\')])]//img/@src').forEach(item => {
      addHiddenDiv('ii_images', item.split(' ')[0]);
    });
    findXpathArr("//div[contains(@id,'Farbvariante')]//a[contains(@class,'styled')]/@href").forEach(item => {
      addHiddenDiv('ii_variants', item.replace(/.*-(\d+).*/, '$1'));
    });
    findAndFormatArr("//div[contains(@id,'specifications')]//td | //div[contains(@class,'lineSeparator') and (.//*[contains(@id,'specifications')])]//div[contains(@class,'expandablePanel')]//td ", 'ii_specs');
    findAndFormatArr('//table[(./thead[contains(.,\'Verpackungsdimensionen\')])]//tbody//td', 'ii_shippingDimensions');
    findAndFormatArr("//table[(./thead[contains(.,'Farbe')])]//tbody//td", 'ii_color');
    // video link
    const videoArr = [];
    findXpathArr("//div[contains(@id,'youtube')]//img/@srcset | //div[contains(@class,'lineSeparator') and (.//*[contains(@id,'youtube')])]//div[contains(@class,'expandablePanel')]//img/@srcset | //div[contains(@id,'slide') and (./div[contains(@class,'mediaVideo')])]//img/@src").forEach(item => {
      const links = item.split(' ')[0];
      const video = links.match('vi/(.*?)/') && links.match('vi/(.*?)/')[1] ? 'https://www.youtube.com/embed/' + links.match('vi/(.*?)/')[1] + '?enablejsapi=1&origin=https%3A%2F%2Fwww.digitec.ch&widgetid=3' : '';
      videoArr.push(video);
    });
    addHiddenDiv('ii_video', videoArr.join(' | '));
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'expert',
    transform: cleanUp,
    domain: 'digitec.ch',
    zipcode: '',
  },
  implementation,
};
