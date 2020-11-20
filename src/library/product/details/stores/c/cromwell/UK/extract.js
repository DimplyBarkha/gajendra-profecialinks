const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'cromwell',
    transform: transform,
    domain: 'cromwell.co.uk',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.evaluate(async () => {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      async function infiniteScroll() {
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
      function getSingleText(xpath, document) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (element && element.singleNodeValue) {
          const nodeElement = element.singleNodeValue;
          return nodeElement && nodeElement.textContent.trim().length > 1 ? nodeElement.textContent : '';
        } else {
          return '';
        }
      }
      const variantIdXpath = '//li[@class="ProductFurtherInfo_attrTable__item"]//div[@class="ProductFurtherInfo_attrTable__item__info"]//strong[contains(text(),"MFR Part No.")]//following-sibling::span//div';
      addHiddenDiv('variant_id_Text', getSingleText(variantIdXpath, document));

      const packSizeXpath = '//li[@class="ProductFurtherInfo_attrTable__item"]//div[@class="ProductFurtherInfo_attrTable__item__info"]//strong[contains(text(),"Pack Quantity")]//following-sibling::span';
      addHiddenDiv('pack_size_Text', getSingleText(packSizeXpath, document));

      const mpcXpath = '//li[@class="ProductFurtherInfo_attrTable__item"]//div[@class="ProductFurtherInfo_attrTable__item__info"]//strong[contains(text(),"MFR Part No.")]//following-sibling::span//div';
      addHiddenDiv('mpc_Text', getSingleText(mpcXpath, document));

      const firstVariantXpath = '//li[@class="ProductFurtherInfo_attrTable__item"]//div[@class="ProductFurtherInfo_attrTable__item__info"]//strong[contains(text(),"MFR Part No.")]//following-sibling::span//div';
      addHiddenDiv('first_variant_Text', getSingleText(firstVariantXpath, document));

      const variantInformationXpath = '//li[@class="ProductFurtherInfo_attrTable__item"]//div[@class="ProductFurtherInfo_attrTable__item__info"]//strong[contains(text(),"Colour")]//following-sibling::span';
      addHiddenDiv('variant_information_Text', getSingleText(variantInformationXpath, document));

      const additionalDescBulletInfoXpath = '//ul[@class="ProductFurtherInfo_attrTable"]';
      addHiddenDiv('additional_desc_bullet_info_Text', getSingleText(additionalDescBulletInfoXpath, document));

      const colorXpath = '//li[@class="ProductFurtherInfo_attrTable__item"]//div[@class="ProductFurtherInfo_attrTable__item__info"]//strong[contains(text(),"Colour")]//following-sibling::span';
      addHiddenDiv('color_Text', getSingleText(colorXpath, document));
      const variantTab = document.evaluate("//div[@class='ProductTabs']//div[contains(@class, 'product-details')]//ul[contains(@class, 'react-tabs')]//li[contains(text(), 'Product Variants')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (variantTab && variantTab.singleNodeValue) {
        variantTab.singleNodeValue.click();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
