const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bedbathbeyond',
    transform: cleanUp,
    domain: 'bedbathbeyond.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    const extractSingleProductData = async () => {
      await context.evaluate(async () => {
        const descriptionElement = document.querySelector(
          'div#overview div[itemprop="description"]',
        );
        const descriptionLiElements = document.querySelectorAll(
          'div#overview ul li',
        );
        let descriptionText = descriptionElement
          ? descriptionElement.innerHTML
          : '';
        const descriptionLiTexts = [];
        descriptionLiElements.forEach((li) => {
          // @ts-ignore
          descriptionLiTexts.push(li.innerText ? li.innerText : '');
        });
        descriptionText += ' || ' + descriptionLiTexts.join(' || ');

        document
          .querySelector('body')
          .setAttribute('description', descriptionText);
      });

      await context.click('div#pdpNavigations a[href="#reviews"]');
      await context.waitForNavigation();
      const isLoadMoreButton = await context.evaluate(async () => {
        return document.querySelector('div#wc-read-button') !== null;
      });
      if (isLoadMoreButton) {
        await context.click('div#wc-read-button');
      }
      const isLoadMoreButton2 = await context.evaluate(async () => {
        return document.querySelector('div[class*="ShowMore"] button') !== null;
      });
      if (isLoadMoreButton2) {
        await context.click('div[class*="ShowMore"] button');
      }
      await context.waitForNavigation();
      await context.evaluate(async () => {
        const manufacturerDescElements = document.querySelectorAll(
          'div[class*="wc-rich-content-description"]',
        );
        const manufacturerDescArray = [];
        manufacturerDescElements.forEach((desc) => {
          manufacturerDescArray.push(desc.innerHTML);
        });
        const manufacturerDescText = manufacturerDescArray.join(' ');
        document
          .querySelector('body')
          .setAttribute('manufacturerdescription', manufacturerDescText);
      });
      // await context.click('img[class*="ProductMediaCarouselStyle"]');
      await context.extract(productDetails, { transform }, 'MERGE_ROWS');
    };

    // checking if product has variants
    const checkIfProductHasVariantsAndClickThem = async () => {
      var variantElements = await context.evaluate(async () => {
        var variants = [];
        document
          .querySelectorAll('div#multiSkuContainer ul li')
          .forEach((variant) => {
            variants.push(variant.innerHTML);
          });
        return variants;
      });
      if (variantElements && variantElements.length > 1) {
        for (let i = 0; i < variantElements.length; i++) {
          // if (variantElements[i + 1] === undefined) {
          //   return await context.extract(productDetails, { transform }, 'MERGE_ROWS');
          // }
          // await context.click(variantElements[i]);
          await context.evaluate((i) => {
            document
              // @ts-ignore
              .querySelectorAll('div#multiSkuContainer ul li button')[i].click();
            // i++;
          }, i);

          // wait for extraction
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await context.waitForNavigation();
          await extractSingleProductData();
        }
      } else {
        await extractSingleProductData();
      }
    };

    // checking if extractor is on a collection site and if so redirecting it to each product to extract data
    const isCollectionTabPresent = await context.evaluate(async () => {
      const collectionTabXPath = '//div[@id="pdpNavigations"]//a[contains(text(), "Collection Items")]';
      return (
        document
          .evaluate(
            collectionTabXPath,
            document,
            null,
            XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
            null,
          )
          .iterateNext() !== null
      );
    });
    if (isCollectionTabPresent) {
      await context.click('div#pdpNavigations a[href="#productitemlist"]');
      await context.waitForSelector('div#productitemlist img');
      const isLoadMoreCollectioItemsButton = await context.evaluate(
        async () => {
          return (
            document.querySelector(
              'div#productitemlist div#showMore button',
            ) !== null
          );
        },
      );
      if (isLoadMoreCollectioItemsButton) {
        await context.click('div#productitemlist div#showMore button');
      }
      await context.waitForNavigation();

      var collectionItemLinks = await context.evaluate(async () => {
        var links = [];
        document
          .querySelectorAll('div#productitemlist h3 a')
          .forEach((title) => {
            links.push(
              `https://www.bedbathandbeyond.com${title.getAttribute('href')}`,
            );
          });
        return links;
      });
      collectionItemLinks.forEach(async (collectionProduct) => {
        await context.goto(collectionProduct);
        await checkIfProductHasVariantsAndClickThem();
      });
    } else {
      await checkIfProductHasVariantsAndClickThem();
    }

    // return await context.extract(productDetails, { transform }, 'MERGE_ROWS');
  },
};
