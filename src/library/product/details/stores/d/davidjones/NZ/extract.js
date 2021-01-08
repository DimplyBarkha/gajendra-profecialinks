const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'davidjones',
    transform,
    domain: 'davidjones.com',
    zipcode: '',
  },
  implementation: async (
    { url },
    { country, domain, transform },
    context,
    { productDetails }
  ) => {
    try {
      await context.evaluate(() => {
        function addHiddenDiv(id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        if (document.querySelector('div[class*="long-description"]')) {
          let desc = document.querySelector('div[class*="long-description"]')
            .innerHTML;
          desc = desc
            .replace(/<li.*?>/gm, ' || ')
            .replace(/<.*?>/gm, '')
            .replace(/&nbsp;/g, '')
            .trim();
          addHiddenDiv('customDescription', desc);
          // const bulletExceptLast = desc.replace(/.*?(\|\|.*\|\|).*/g, '$1')
          // let bulletLast = ''
          // const lengthL = bulletExceptLast.match(/\|\|$/) ? bulletExceptLast.match(/\|\|$/).length : 0
          // if (lengthL) {
          //   const remainingPart = desc.replace(/.*?(\|\|.*\|\|)(.*)/g, '$2').split('.') || []
          //   bulletLast = remainingPart && remainingPart.length ? remainingPart[0] : ''
          // }
          // const descriptionBullet = bulletExceptLast + bulletLast
          // const descriptionBulletCount = descriptionBullet.match(/\|\|/g) ? descriptionBullet.match(/\|\|/g).length : 0
          // if (descriptionBulletCount) {
          //   addHiddenDiv('bulletsFromDescription', descriptionBullet)
          //   addHiddenDiv('bulletsFromDescriptionCount', descriptionBulletCount)
          // }
        }
      });
    } catch (e) {
      console.log(e);
    }

    // Product Specifications
    try {
      await context.evaluate(() => {
        const specsEndString = document.evaluate(
          `//div[contains(@class,"long-description")]//strong[contains(.,"Specifications") or contains(.,"specifications")]//following-sibling::strong[1]`,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue.textContent;

        if (specsEndString.length === 0) {
          try {
            const specsEndString2 = document.evaluate(
              `//div[contains(@class,"long-description")]//strong[contains(.,"Specifications") or contains(.,"specifications")]//following-sibling::strong/strong[1]`,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue.textContent;

            addSpecifications(specsEndString2);
          } catch (err) {
            console.log(err)
          }
        } else {
          addSpecifications(specsEndString);
        }


        function addSpecifications(specsEndString) {
          const specificationsXpath = `//div[contains(@class,"long-description")]//strong[contains(.,"Specifications") or contains(.,"specifications")]//following-sibling::text()[not(preceding-sibling::strong[contains(.,"${specsEndString}")])]`;
          const specificationsArray = document.evaluate(
            specificationsXpath,
            document,
            null,
            XPathResult.ANY_TYPE,
            null
          );

          let spec = specificationsArray.iterateNext();
          let finalSpecificationsArray = [];
          let finalSpecifications;

          while (spec) {
            if (spec.textContent) finalSpecificationsArray.push(spec.textContent);
            spec = specificationsArray.iterateNext();
          }

          if (finalSpecificationsArray.length > 0) finalSpecifications = finalSpecificationsArray.join(' | ');

          const htmlString = `<span style="display:none" id="productSpecifications" ></span>`;
          const root = document.body;
          root.insertAdjacentHTML('beforeend', htmlString);
          // const innerHTML =
          //   finalSpecifications.reduce((acc, val) => {
          //     return `${acc}<li>${val}</li>`;
          //   }, '<ul>') + '</ul>';
          document.querySelector('#productSpecifications').innerHTML = finalSpecifications;
        }
      });
    } catch (e) {
      console.log(e);
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  },
};
