const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'bedbathbeyond',
    transform: cleanUp,
    domain: 'bedbathbeyond.ca',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    // checking if on a product page
    const isOnProductPage = await context.evaluate(async () => {
      return document.querySelector('img[class*="ProductMediaCarouselStyle"]') !== null;
    });
    if (!isOnProductPage) {
      return;
    }

    // extracting data for a single product
    const extractSingleProductData = async () => {
      var previousVariantSkus = await context.evaluate(async () => {
        return document
          .querySelector('body')
          .getAttribute('previousvariantsku');
      });
      const currentVariantSku = await context.evaluate(async () => {
        return document.querySelector('span[itemprop="sku"]')
          ? document
            .querySelector('span[itemprop="sku"]')
            .getAttribute('content')
          : null;
      });
      if (
        previousVariantSkus !== null &&
        previousVariantSkus.includes(currentVariantSku)
      ) {
        return;
      }
      await context.evaluate(async (previousVariantSkus) => {
        previousVariantSkus += document
          .querySelector('span[itemprop="sku"]')
          .getAttribute('content');
        document
          .querySelector('body')
          .setAttribute('previousvariantsku', previousVariantSkus);
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
      }, previousVariantSkus);

      await context.click('div#pdpNavigations a[href="#reviews"]');
      await context.waitForNavigation();
      await context.evaluate(async () => {
        if (document.querySelector('div#wc-read-button') !== null) {
          // @ts-ignore
          document.querySelector('div#wc-read-button').click();
        }
        if (document.querySelector('div[class*="ShowMore"] button') !== null) {
          // @ts-ignore
          document.querySelector('div[class*="ShowMore"] button').click();
        }
      });
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
      await context.click('img[class*="ProductMediaCarouselStyle"]');
      await context.waitForNavigation();
      await context.evaluate(async () => {
        if (
          document.querySelector('img[class*="ProductMediaCarouselStyle"]') !==
          null
        ) {
          document
            .querySelector('img[class*="ProductMediaCarouselStyle"]')
          // @ts-ignore
            .click();
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const previousImgDataElements = document.querySelectorAll(
            'div[altimagesdata]',
          );
          previousImgDataElements.forEach((element) => element.remove());
          const altImages = document.querySelectorAll('div#rclModal ul img');
          altImages.forEach((image) => {
            const imgDataElement = document.createElement('div');
            imgDataElement.setAttribute('style', 'display: none');
            document.querySelector('body').append(imgDataElement);
            imgDataElement.setAttribute(
              'altimagesdata',
              image.getAttribute('src'),
            );
          });
          if (
            document.querySelector(
              'div#rclModal button[aria-label="close"]',
            ) !== null
          ) {
            document
              .querySelector('div#rclModal button[aria-label="close"]')
            // @ts-ignore
              .click();
          }
        }
      });


      async function scrollToRec (node) {
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
      await scrollToRec('footer');
      await scrollToRec('div[certonaidentifier^="recommendation"]');
      await scrollToRec('div#viewItem-PDP');
      // await this.context.evaluate(async () => {
      //   await new Promise((resolve) => setTimeout(resolve, 5000));
  
      //   async function infiniteScroll () {
      //     let prevScroll = document.documentElement.scrollTop;
      //     while (true) {
      //       window.scrollBy(0, document.documentElement.clientHeight);
      //       await new Promise(resolve => setTimeout(resolve, 1000));
      //       const currentScroll = document.documentElement.scrollTop;
      //       if (currentScroll === prevScroll) {
      //         break;
      //       }
      //       prevScroll = currentScroll;
      //     }
      //   }
      //   await infiniteScroll();
      //   await new Promise((resolve) => setTimeout(resolve, 8000));
      // });
      await context.extract(productDetails, { transform });
    };

    // iterating through variants
    const clickAllVariants = async (variantsArr, variantSelector) => {
      for (let i = 0; i < variantsArr.length; i++) {
        await context.evaluate(
          (i, variantSelector) => {
            document
              // @ts-ignore
              .querySelectorAll(variantSelector)[i].click();
          },
          i,
          variantSelector,
        );
        await context.waitForNavigation();
        await context.evaluate(async (i) => {
          if (i === 0) {
            const firstVariant = document
              .querySelector('span[itemprop="sku"]')
              .getAttribute('content');
            const firstVariantAttribute = document
              .querySelector('body')
              .getAttribute('firstvariant');
            if (firstVariantAttribute === null) {
              document
                .querySelector('body')
                .setAttribute('firstvariant', firstVariant);
            }
          }
        }, i);
        await extractSingleProductData();
      }
    };

    // checking if a product has variants and navigating to them
    const checkIfProductHasVariantsAndClickThem = async () => {
      const variantCategoryAmount = await context.evaluate(async () => {
        return document.querySelectorAll('div#multiSkuContainer ul').length;
      });
      var variantElements = await context.evaluate(async () => {
        var variants = [];
        document
          .querySelectorAll('div#multiSkuContainer > div:last-of-type ul li')
          .forEach((variant) => {
            variants.push(variant.innerHTML);
          });
        return variants;
      });
      if (variantCategoryAmount > 1) {
        const firstCategoryVariants = await context.evaluate(async () => {
          var firstVariants = [];
          document
            .querySelectorAll('div#multiSkuContainer > div:first-of-type ul li')
            .forEach((variant) => {
              firstVariants.push(variant.innerHTML);
            });
          return firstVariants;
        });
        for (let j = 0; j < firstCategoryVariants.length; j++) {
          await context.evaluate((j) => {
            document
              .querySelectorAll(
                'div#multiSkuContainer > div:first-of-type ul li button',
                // @ts-ignore
              )[j].click();
          }, j);
          await context.waitForNavigation();
          await clickAllVariants(
            variantElements,
            'div#multiSkuContainer > div:last-of-type ul li button',
          );
        }
      } else if (variantCategoryAmount === 1) {
        await clickAllVariants(
          variantElements,
          'div#multiSkuContainer > div:last-of-type ul li button',
        );
      } else {
        await extractSingleProductData();
      }
    };

    // checking if extractor is on a collection page and if so redirecting it to each product to extract data
    const isCollectionTabPresent = await context.evaluate(async () => {
      const collectionTabXPath =
        '//div[@id="pdpNavigations"]//a[contains(text(), "Collection Items")]';
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
              `https://www.bedbathandbeyond.ca${title.getAttribute('href')}`,
            );
          });
        return links;
      });
      for (let i = 0; i < collectionItemLinks.length; i++) {
        await context.goto(collectionItemLinks[i]);
        await checkIfProductHasVariantsAndClickThem();
      }
    } else {
      await checkIfProductHasVariantsAndClickThem();
    }
  },
};
