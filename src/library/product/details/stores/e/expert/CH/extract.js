const { cleanUp } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
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
      console.log('Value::', value);
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
    clickXpath("//div[contains(@id,'description')]//button[contains(.,'Mehr anzeigen')]");
    clickXpath("//div[contains(@id,'specifications')]//button[contains(.,'Mehr anzeigen')]");
    clickXpath("//div[contains(@id,'returnsAndWarranty')]//button[contains(.,'Mehr anzeigen')]");
    let id = findXpath('//script[contains(@type,\'application/ld+json\') and contains(.,\'"@type":"Product"\')]');

    id = id.replace(/.*(?:"sku":(.*?),.*)/, '$1');
    addHiddenDiv('ii_sku', id);

    const variantCount = findXpathArr('//div[contains(@id,\'Farbvariante\')]//a[contains(@class,\'styled\')]/@href');
    console.log('var::', variantCount.length);
    if (variantCount) {
      addHiddenDiv('ii_varInfo', findXpath('//table[(./thead[contains(.,\'Farbe\')])]//tbody//td[contains(.,\'Farbgruppe\')]/following-sibling::td'));
      addHiddenDiv('ii_firstVariant', id);
    }
    findXpathArr('//div[contains(@id,\'slide\')][position()>1]//picture[contains(@class,\'mediaPicture\')]//source[1]/@srcset | //div[contains(@id,\'slide\')][last()]//img/@src').forEach(item => {
      addHiddenDiv('ii_images', item.split(' ')[0]);
    });
    findXpathArr('//div[contains(@id,\'Farbvariante\')]//a[contains(@class,\'styled\')]/@href').forEach(item => {
      addHiddenDiv('ii_variants', item.replace(/.*-(\d+).*/, '$1'));
    });
    findAndFormatArr('//div[contains(@id,\'specifications\')]//td', 'ii_specs');
    findAndFormatArr('//table[(./thead[contains(.,\'Verpackungsdimensionen\')])]//tbody//td', 'ii_shippingDimensions');
    findAndFormatArr('//table[(./thead[contains(.,\'Farbe\')])]//tbody//td', 'ii_color');
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
