
const { transform } = require('./shared');
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
  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const description = document.querySelectorAll("div[class*='product-features_seoDescription'] p");
    let value = '';
    description.forEach((node) => {
      // @ts-ignore
      value += ' || ' + node.innerText;
    });
    const descriptionBottom = document.querySelector("div[role*='treeitem']") ? document.querySelector("div[role*='treeitem']") : null;
    let valueBottom = '';
    if (descriptionBottom) {
      // @ts-ignore
      valueBottom += descriptionBottom.innerText;
    }
    value = value.replace(/\n/, ' ').replace(/\s{2,/, ' ').trim();
    valueBottom = valueBottom.replace(/\n/, ' ').replace(/\s{2,/, ' ').trim();
    if (value && valueBottom) {
      addHiddenDiv('ii_desc', value + ' | ' + valueBottom);
    } else {
      value && addHiddenDiv('ii_desc', value);
      valueBottom && addHiddenDiv('ii_desc', valueBottom);
    }
    const specification = document.querySelector("div[data-automation-id*='characteristics-title']");
    if (specification) {
      // @ts-ignore
      await specification.click();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    // nameExtended
    // @ts-ignore
    const brand = document.querySelector("h2[class*='brand-name_brandName'] a") ? document.querySelector("h2[class*='brand-name_brandName'] a").innerText : '';
    // @ts-ignore
    const title = document.querySelector("h1[data-testid*='product-details-header']") ? document.querySelector("h1[data-testid*='product-details-header']").innerText : '';
    let nameExtended = '';
    if (brand && title) {
      nameExtended = brand + ' - ' + title;
    } else {
      nameExtended = title;
    }
    addHiddenDiv('ii_name', title);
    addHiddenDiv('ii_nameExtended', nameExtended);
    const image = document.querySelector("div[data-automation-id*='hero-image'] img") ? document.querySelector("div[data-automation-id*='hero-image'] img").getAttribute('src') : '';
    image && addHiddenDiv('ii_image', image);
    const imageAlt = document.querySelector("div[data-automation-id*='hero-image'] img") ? document.querySelector("div[data-automation-id*='hero-image'] img").getAttribute('alt') : '';
    image && addHiddenDiv('ii_imageAlt', imageAlt);
    // Video
    var VideoNode = document.querySelectorAll('div[class*="image-picker_thumb"] div[data-automation-id*="video"]');
    VideoNode.forEach(item => {
      item.click();
      const link = document.querySelector("div[class*='image-picker_webVideoWrapper'] iframe") ? document.querySelector("div[class*='image-picker_webVideoWrapper'] iframe").src : '';
      link && addHiddenDiv('ii_video', link);
    });
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'walmart',
    transform,
    domain: 'walmart.com.mx',
    zipcode: '',
  },
  implementation,
};
