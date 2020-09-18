// const { implementation } = require('../../../../sharedAmazon/variantExtract');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants, Helpers: { Helpers }, AmazonHelp: { AmazonHelp } } = dependencies;

  const helpers = new Helpers(context);
  const amazonHelp = new AmazonHelp(context, helpers);

  // try {
    await context.waitForXPath('//span[@cel_widget_id="MAIN-SEARCH_RESULTS"]//span[@data-component-type="s-product-image"]//a[contains(@class, "a-link-normal")]/@href');
  // } catch (error) {
    // throw new Error('No product avail for this location');
  // }
  const link = await context.evaluate(async function () {
    const linkNode = document.querySelector('span[cel_widget_id="MAIN-SEARCH_RESULTS"] a.a-link-normal');
    const link = (linkNode !== null) ? linkNode.getAttribute('href') : null;
    return link;
  });

  if (link && link.toString().includes('almBrandId')) {
    try {
      await context.goto('https://www.amazon.com/' + link, {
        timeout: 45000, waitUntil: 'load', checkBlocked: true,
      });
    } catch (err) {
        await context.goto('https://www.amazon.com/' + link, {
          timeout: 45000, waitUntil: 'load', checkBlocked: true,
        });
      }
    }
            // catch (err) {
  //       throw new Error('Can\'t go to link');
  //     }
  //   }
  // } else {
  //   throw new Error('Not found in Amazon Fresh');
  // }

  await context.evaluate(function () {
    function getVariants () {
      const variantList = [];
      const variantCards = document.querySelectorAll('li[data-defaultasin]');
      const variantDropdown = document.querySelectorAll('[id*="variation"] option');
      const variantBooks = document.querySelectorAll('[id*="Swatches"]>ul>li a[id][href*="dp"]');

      if (variantBooks) {
        for (let i = 0; i < variantBooks.length; i++) {
          const element = variantBooks[i];
          if (element == null) {
            continue;
          }
          const vasinRaw = element.getAttribute('href');
          if (vasinRaw !== '') {
            const regex = /\/dp\/([A-Za-z0-9]{10,})/s;
            const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          }
        }
      }
      if (variantDropdown) {
        for (let i = 0; i < variantDropdown.length; i++) {
          const element = variantDropdown[i];
          if (element == null) {
            continue;
          }
          const vasinRaw = element.getAttribute('value');
          if (vasinRaw !== '') {
            const regex = /[0-9]{1,},([0-9a-zA-Z]{10,})/s;
            const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          }
        }
      }
      if (variantCards) {
        for (let i = 0; i < variantCards.length; i++) {
          const element = variantCards[i];
          if (element == null) {
            continue;
          }
          let vasin = element.getAttribute('data-dp-url');
          if (vasin && vasin.includes('/dp/') && vasin.includes('/ref=')) {
            const vasinArr = vasin.split('/dp/');
            vasin = vasinArr.length === 2 ? vasinArr[1].split('/ref=')[0] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          } else {
            vasin = element.getAttribute('data-defaultasin');
          }
        }
      }
      return variantList;
    }

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }

    const url = window.location.href;
    console.log('url!');
    console.log(url);
    console.log(url.split('/dp/')[1]);
    console.log(url.split('/dp/')[1].split('/ref=sr'));
    const splits = url && url.split('/dp/')[1] ? url.split('/dp/')[1].split('/ref=sr') : [];
    const mainId = (splits.length > 1) ? splits[splits.length - 2] : '';
    addHiddenDiv('ii_variant', mainId);

    const allVariants = [...new Set(getVariants())];
    for (let i = 0; i < allVariants.length; i++) {
      const id = allVariants[i];
      addHiddenDiv('ii_variant', id);
    }
  });
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    transform: null,
    domain: 'amazon.com',
    zipcode: '90210',
  },
  dependencies: {
    variants: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/variantsExtract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
