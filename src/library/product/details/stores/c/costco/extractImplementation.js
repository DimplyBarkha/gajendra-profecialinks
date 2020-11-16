const implementation = async (inputs, parameters, context, dependencies) => {
  const timeout = 20000;

  try {
    await context.click('input[name="view-more"]');
  } catch (err) {
    console.log('Error while expanding the enhanced content.');
  }

  try {
    await context.waitForSelector('button[data-wc-open-content-tag="360-view"]', { timeout })
  } catch (err) {
    console.log('360 button did not load.');
  }

  await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });

  await context.evaluate(function () {
    console.log('Scrolling to the bottom of page.');
    document.querySelector('#footer-widget').scrollIntoView({ behavior: 'smooth' })
  });

  await context.waitForNavigation({ timeout, waitUntil: 'networkidle0' });

  await context.evaluate(function () {
    const addElement = (id, content) => {
      const el = document.createElement('div');

      el.id = id;
      el.innerText = content;

      document.body.appendChild(el);
    };

    const populateSpecs = () => {
      const specs = document.querySelectorAll('.product-info-specs .row');
      let text = '';
      Array.from(specs).forEach(spec => {
        const el1 = spec.querySelector('div:nth-child(1)');
        const el2 = spec.querySelector('div:nth-child(2)');
        text += text ? ` || ${el1.textContent} : ${el2.textContent}` : `${el1.textContent} : ${el2.textContent}`
      });

      return text;
    };

    const buildDescription = () => {
      const descXpath = '//ul[@class="pdp-features"]/li | //h3[contains(text(), "Product Details")]/following-sibling::div[@class="product-info-description" and not(div[@id="wc-power-page"])]';
      const descNodes = document.evaluate(descXpath, document.body, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

      let el = descNodes.iterateNext();
      let text = '';

      while (el) {
        const listItems = el.querySelectorAll('*');
        if (el.nodeName.toLowerCase() === 'li') {
          text += `||${el.textContent}`;
        } else if (listItems && listItems.length) {
          listItems.forEach(list => {
            if (list.nodeName.toLowerCase() === 'li') {
              text += `||${list.textContent}`;
            } else {
              text += text ? ` ${list.textContent}` : list.textContent;
            }
          });
        } else if (el.nodeName.toLowerCase() !== 'li' && el.nodeName.toLowerCase() !== 'ul') {
          text += text ? `${el.textContent}` : el.textContent;
        }
        el = descNodes.iterateNext();
      }

      return text;
    };

    const bulletsCount = document.evaluate('count(//ul[@class="pdp-features"]/li | //h3[contains(text(), "Product Details")]/following-sibling::div[@class="product-info-description" and not(div[@id="wc-power-page"])]//li)', document).numberValue;
    const availability = window.products ? window.products[0][0].inventory : ""
    const threeSixtyImage = document.evaluate('boolean(//button[@aria-label="Press to open 360 View"] | //div[@class="wc-mediaGalleryThreeSixty"])', document).booleanValue;
    console.log('threeSixtyImage', threeSixtyImage);
    addElement('threeSixtyImage', threeSixtyImage ? 'Yes' : 'No');
    addElement('bulletsCount', bulletsCount);
    addElement('specifications', populateSpecs());
    addElement('description', buildDescription());
    addElement('availability', availability);
  });

  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.extract(productDetails, { transform });
};

module.exports = { implementation };