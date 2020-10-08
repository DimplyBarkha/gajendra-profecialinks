const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'stakelums',
    transform: cleanUp,
    domain: 'stakelums.ie',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;

    await context.evaluate(async function () {
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const imageXpath = '//div[@id="product-page"]//div[@id="product-images"]//div[@class="big-image "]//img/@src';
      const image = getAllXpath(imageXpath, 'nodeValue');
      addHiddenDiv('add_image', image);
      const imageAltXpath = '//div[@id="product-images"]//div[contains(@class,"big-image")]//a/img/@alt';
      const imageAlt = getAllXpath(imageAltXpath, 'nodeValue');
      if (imageAlt != null) {
        if (imageAlt.toString().includes('product')) {
          addHiddenDiv('add_imageAlt', 'hproductname');
        } else {
          addHiddenDiv('add_imageAlt', imageAlt);
        }
      }
      const metaKeywordsXpath = '//meta[contains(@name, "Keywords")]/@content';
      const metaKeywords = getAllXpath(metaKeywordsXpath, 'nodeValue');
      addHiddenDiv('add_metaKeywords', metaKeywords);
      const nameExtendedXpath = '//*[@class="page-title"]';
      const nameExtended = getAllXpath(nameExtendedXpath, 'innerText');
      addHiddenDiv('add_nameExtended', nameExtended);
      const priceXpath = '//span[@class="product-price"]';
      const price = getAllXpath(priceXpath, 'innerText');
      if (price != null) {
        const priceData = price.toString().trim().replace('(Price includes VAT)', '');
        addHiddenDiv('add_price', priceData);
      }
      const listpriceXpath = '//span[@class="rrp-price"]';
      const listprice = getAllXpath(listpriceXpath, 'innerText');
      if (listprice != null) {
        const listPriceData = listprice.toString().trim().split(' ');
        addHiddenDiv('add_listprice', listPriceData[1]);
      }
      const productReviewXpath = "//div[@class='product_review']//span/@class";
      const productReview = getAllXpath(productReviewXpath, 'nodeValue');
      const ratingCount = parseInt(productReview.toString().substring(productReview.toString().lastIndexOf('_') + 1));
      if (ratingCount !== 0 && ratingCount > 9) {
        addHiddenDiv('aggregate_rating', ratingCount / 10);
      } else {
        addHiddenDiv('aggregate_rating', ratingCount);
      }
      addHiddenDiv('added_variantCount', 0);
      const descriptionXpath = "//div[@class='product_review']/following-sibling::p";
      const description = getXpath(descriptionXpath, 'innerText');
      const additionalDescriptionXpath = "//div[@id='specificationTab']/p";
      const additionalDescription = getAllXpath(additionalDescriptionXpath, 'innerText').join('|');
      // check Weight from Specification
      const weightSpecification = document.querySelectorAll('.inpage_selector_specification .flix-std-table .flix-std-specs-table .flix-title');
      let weight = '';
      weightSpecification.forEach((item) => {
        if (item.textContent.includes('kg')) {
          weight = item.textContent;
          addHiddenDiv('product_weight', weight);
        }
      });
      if (weight === '') {
        const shippingWeight = document.querySelectorAll('.inpage_selector_specification .flix-std-specs-table .flix-title');
        shippingWeight.forEach((item) => {
          if (item.textContent.includes('KG') || item.textContent.includes('kg')) {
            weight = item.textContent;
          }
        });
        if (weight !== '') {
          addHiddenDiv('product_weight', weight);
        }
      }
      if (weight === '') {
        // weightXpath
        const weightXpathOption1 = getXpath("//div[@id='specificationTab']//table/tbody/tr[2]/td[2]/p[text()]", 'innerText');
        const weightXpathOption2 = getXpath("//div[@id='specificationTab']//p[@class='product-specificationlabel-top'][5]", 'innerText');
        const weightXpathOption3 = getXpath("//div[@class='tabs-content']//p[contains(text(),'Weight')]", 'innerText');
        if (weightXpathOption1 !== null) {
          addHiddenDiv('product_weight', weightXpathOption1 + ' Kg');
        } else if (weightXpathOption2 !== null) {
          const weightData = weightXpathOption2.toString().trim().split(':');
          addHiddenDiv('product_weight', weightData[1]);
        } else if (weightXpathOption3 !== null) {
          const weightData = weightXpathOption3.toString().trim().split(':');
          addHiddenDiv('product_weight', weightData[1]);
        }
      }
      // Manufacture Description
      const manufacturerDescriptionXpathOption = getAllXpath("//div[contains(@id,'inpage_container')]//div[(contains(@class,'flix-d-p') or contains(@class,'flix-std-desc')) and not(contains(@class,'flix-title')or contains(@class,'flix-caveat-desc'))]", 'innerText');
      if (manufacturerDescriptionXpathOption.length > 0) {
        addHiddenDiv('added_manufacturerDescription', manufacturerDescriptionXpathOption);
      }
      // shipping_Weight
      const shippingweightXpathOption = getXpath('//div[@id="specificationTab"]//table/tbody/tr[3]/td[2]/p[text()]', 'innerText');
      if (shippingweightXpathOption != null) {
        addHiddenDiv('shipping_weight', shippingweightXpathOption);
        addHiddenDiv('addgross_weight', shippingweightXpathOption);
      }
      // Dimension
      const dimensionXpathOption = getXpath('//div[@id="specificationTab"]//table/tbody/tr[5]/td[2]/p[text()]', 'innerText');
      if (dimensionXpathOption !== null) {
        const dimensionList = dimensionXpathOption.split('/');
        addHiddenDiv('product_dimension', dimensionList[0] + 'x' + dimensionList[1] + 'x' + dimensionList[2]);
      }
      // Specification Xpath
      const specificationsXpathOption1 = getAllXpath("//table[@class='flix-std-specs-table']/tbody/tr/td", 'innerText');
      const specificationsXpathOption2 = getAllXpath("//div[@id='specificationTab']//table/tbody/tr", 'innerText');
      const specificationsXpathOption3 = getAllXpath("//div[@id='specificationTab']//p[@class='product-specificationlabel-top']", 'innerText');
      if (specificationsXpathOption1.length > 0) {
        addHiddenDiv('added_specifications', specificationsXpathOption1.join('||'));
      } else if (specificationsXpathOption2.length > 0) {
        addHiddenDiv('added_specifications', specificationsXpathOption2.join('||'));
      } else if (specificationsXpathOption3.length > 0) {
        addHiddenDiv('added_specifications', specificationsXpathOption3.join('||'));
      }
      // product Information and additional Description
      const additionalXpathOption1 = getAllXpath("//div[@id='specificationTab']/ul/li", 'innerText');
      let finalAdditionalDescription;
      if (additionalXpathOption1.length > 0) {
        // addHiddenDiv('product_other_information',additional_description+"|"+additional_xpath_option1.join('|'));
        finalAdditionalDescription = description + '|' + additionalDescription + '|' + additionalXpathOption1.join('|');
      } else {
        // addHiddenDiv('product_other_information',additional_description);
        finalAdditionalDescription = description + '|' + additionalDescription;
      }
      const additionalDescriptionList = finalAdditionalDescription.split('|');
      additionalDescriptionList.forEach(function (description) {
        addHiddenDiv('additional_description', description);
      });
      // Video
      const videoUrlPath = getXpath("//div[@class='fullJwPlayerWarp']//input[@class='flix-jw']/@value", 'nodeValue');
      if (videoUrlPath && typeof videoUrlPath === 'string') {
        var videoUrlObj = JSON.parse(videoUrlPath);
        addHiddenDiv('added_video_url', 'http:' + videoUrlObj.playlist[0].file);
      }
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
    });
    return await context.extract(productDetails, { transform: parameters.transform });
  },
};
