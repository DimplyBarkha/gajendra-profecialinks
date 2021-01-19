const { transform } = require('../../../../sharedAmazon/transformNew');
/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    let scrollSelector = document.querySelector('div[id~="navFooter"]');
    let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
    let yPos = 0;
    while (scrollLimit && yPos < scrollLimit) {
      yPos = yPos + 350;
      window.scrollTo(0, yPos);
      scrollSelector = document.querySelector('div[id~="navFooter"]');
      scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  });
  try {
    await context.waitForSelector('div[cel_widget_id*="aplus"] img');
  } catch (error) {
    console.log('Enhanced content not loaded!!');
  }

  const getLbb = async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let manufacturerDescription = document.querySelector('.aplus-v2.desktop.celwidget');
    // @ts-ignore
    manufacturerDescription = manufacturerDescription !== null ? manufacturerDescription.innerText : '';
    addHiddenDiv('ii_manufacturerDescription', manufacturerDescription);
    const ship = document.evaluate('(//tr//td[contains(@class,"buybox-tabular-column") and ./span[contains(.,"Gönderici")]]/following-sibling::td/span/span)[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const sold = document.evaluate('(//tr//td[contains(@class,"buybox-tabular-column") and ./span[contains(.,"Satıcı")]]/following-sibling::td/span/span)[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    // @ts-ignore
    if (ship && ship.innerText && sold && sold.innerText) {
      // @ts-ignore
      const dt = (sold.innerText === ship.innerText ? `${sold.innerText} tarafından satılır ve gönderilir.` : `gönderilir tarafindan ${ship.innerText} ve satılır tarafindan ${sold.innerText}`);
      dt && addHiddenDiv('ii_shipping_info', dt);
    }
    const brandText = document.evaluate('//a[@id="bylineInfo"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    // @ts-ignore
    if (brandText && brandText.innerText) {
      // @ts-ignore
      addHiddenDiv('ii_brand_text', brandText.innerText);
    } else {
      const name = document.evaluate('//span[@id="productTitle"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // @ts-ignore
      if (name && name.innerText.includes('Dyson')) {
        addHiddenDiv('ii_brand_text', 'Dyson');
      } else {
        // @ts-ignore
        name && name.innerText && addHiddenDiv('ii_brand_text', name.innerText.split(' ')[0]);
      }
    }
    const variants = document.evaluate(' //li[@data-defaultasin]/@data-defaultasin | //*[contains(@id,"variation")]//option/@value | //*[contains(@id,"Swatches")]/ul/li//a[@id and contains(@href,"dp")]/@href', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const variantsArray = [];
    if (variants) {
      for (let i = 0; i < variants.snapshotLength; i++) {
        variantsArray.push(variants.snapshotItem(i).textContent.trim());
      }
      variantsArray && addHiddenDiv('ii_variants', variantsArray.join(' | '));
    }
    const description = document.evaluate('//*[@id="feature-bullets"]/ul/li[not(@id)]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const descArray = [];
    if (description) {
      for (let i = 0; i < description.snapshotLength; i++) {
        descArray.push(description.snapshotItem(i).textContent.trim());
      }
    }
    const descriptionOne = document.evaluate('//div[@id="productDescription"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (description) {
      // @ts-ignore
      descriptionOne && descriptionOne.innerText && descArray.push(`| ${descriptionOne.innerText.trim()}`);
      descArray && descArray[0] && addHiddenDiv('ii_description', `|| ${descArray.join(' || ').trim().replace(/\|\| \|/g, '|')}`);
    }
    const specifications = document.evaluate('//table[contains(@id,"productDetails_techSpec")]//tbody/tr', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const specArray = [];
    if (specifications) {
      for (let i = 0; i < specifications.snapshotLength; i++) {
        specArray.push(specifications.snapshotItem(i).textContent.trim().replace(/\n/g, ' ').replace(/\s+/g, ' : '));
      }
      specArray && specArray.length && addHiddenDiv('ii_spec', specArray.join(' || '));
    }
    // @ts-ignore
    const firstCheck = document.querySelector('#buyboxTabularTruncate-1 > span.a-truncate-cut') ? document.querySelector('#buyboxTabularTruncate-1 > span.a-truncate-cut').innerText : '';
    const otherSellers = document.querySelectorAll('div.a-box.mbc-offer-row.pa_mbc_on_amazon_offer');
    // @ts-ignore
    const price = document.querySelector('span#price_inside_buybox') ? (document.querySelector('span#price_inside_buybox').innerText).replace(/₺(.*)/, '$1') : '';
    if (firstCheck && price) {
      // @ts-ignore
      if (firstCheck !== 'Amazon.com.tr' && otherSellers) {
        otherSellers.forEach((seller) => {
          // @ts-ignore
          const sellerPrice = seller.querySelector('span.a-color-price') ? seller.querySelector('span.a-color-price').innerText : '';
          const priceNum = sellerPrice.replace(/₺(.*)/, '$1');
          const shipsFrom = seller.querySelector('span.mbcMerchantName');
          const soldBy = seller.querySelector('span.mbcMerchantName');
          // @ts-ignore
          if (shipsFrom && shipsFrom.innerText === 'Amazon.com.tr' && soldBy && soldBy.innerText === 'Amazon.com.tr' && priceNum > price) {
            addHiddenDiv('ii_lbb', 'YES');
            addHiddenDiv('ii_lbbPrice', `₺${priceNum}`);
          }
        });
      }
    }
  };

  try {
    await context.evaluate(getLbb);
  } catch (error) {
    console.log('Lbb extraction failed!!');
  }

  await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'amazon',
    transform,
    domain: 'amazon.com.tr',
  },
  implementation,
};
