// @ts-nocheck
const { transform } = require('./transform');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const selectors = {
    isVariants: 'div[class*="product-attributes"]',
    isColors: '.product-attributes__color-item',
    isSizes: '.product-attributes__item-select',
    targetDiv: 'body > #product-wrapper',
    targetScroll: '.dyProductContainer',
    targetManufScroll: '#wrp_flixmedia, .features-wrapper',
  };

  try {
    await context.waitForSelector(selectors.isVariants);
    await context.evaluate((selectors) => {
      let firstVariant = '';
      const div = document.querySelector(selectors.targetDiv);
      const isColors = document.querySelector(selectors.isColors);
      const isSizes = document.querySelector(selectors.isSizes);
      if (isColors) {
        firstVariant = isColors.getAttribute('data-action-id').replace(/(.+-)(\d+)(.html)/, '$2');
        div.setAttribute('first-variant', firstVariant);
      }
      if (!isColors && isSizes) {
        firstVariant = isSizes.querySelector('option').getAttribute('data-action-id').replace(/(.+-)(\d+)(.html)/, '$2');
        div.setAttribute('first-variant', firstVariant);
      }
    }, selectors);
  } catch (e) {
    console.log('No variants present for this product');
  }
  const currentUrl = await context.evaluate(() => {
    return window.location.href;
  });
  if (currentUrl.search('mediamarkt.com.tr') !== -1) {
    try {
      await context.waitForXPath('//div[contains(@class,"inpage_selector_feature") or contains(@class,"inpage_selector_gallery")]//img | //div[@id="rcm-container"]//img | //div[@class="flix-tech-spacs"]//img', { timeout: 60000 });
    } catch (e) {
      console.log('Enhanced content is not present or it didn\'t load');
    }
    try {
      await context.evaluate((selectors) => {
        const dt = [...document.querySelectorAll('.product-details dt')];
        const dd = [...document.querySelectorAll('.product-details dd')];
        const headers = [];
        const values = [];
        dt.forEach(dt => {
          headers.push(dt.innerText);
        });
        dd.forEach(dd => {
          values.push(dd.innerText);
        });
        const isTooltip = document.querySelector('a.tooltip.enhanced');
        if (isTooltip) {
          let tooltip = [...document.querySelectorAll('.tooltip-header')];
          tooltip.forEach(t => {
            t.remove();
          });
          tooltip = [...document.querySelectorAll('.tooltip-wrapper')];
          tooltip.forEach(t => {
            t.remove();
          });
        }
        const specs1 = document.evaluate(
          '//div[@id="features"]//dt[contains(.,"Özel Nitelikler")]/following-sibling::dd[1]',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        ).singleNodeValue;
        const specs2 = document.evaluate(
          '//div[@id="features"]//dt[contains(.,"Programlar")]/following-sibling::dd[1]',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        ).singleNodeValue;
        let text = '';
        for (let i = 0; i < headers.length; i++) {
          if (headers[i] === 'Özel Nitelikler:' && specs1) {
            values[i] = specs1.textContent;
          }
          if (headers[i] === 'Programlar:' && specs2) {
            values[i] = specs2.textContent;
          }
          text += text ? ` ${headers[i]} ${values[i]}` : `${headers[i]} ${values[i]}`;
        }
        document.querySelector(selectors.targetDiv).setAttribute('additional-description', text);
      }, selectors);
    } catch (e) {
      console.log(e.message);
    }
  } else if (currentUrl.search('mediamarkt.es') !== -1) {
    // For enhanced content present in iframe
    try {
      await context.waitForSelector('iframe#loadbeeIframeId');
      const iframeUrl = await context.evaluate(() => document.querySelector('iframe#loadbeeIframeId').getAttribute('src'));
      await context.goto(iframeUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      await context.waitForSelector('.main-content, .a-plus-content img');
      const aplus = await context.evaluate(() => {
        const images = document.evaluate(
          '//div[@class="gallery"]//div[contains(@class, "thumbnail")]/@data-pic-url | //div[@class="a-plus-content"]/div[contains(@class,"a-plus-box-main")]/img/@src | //div[contains(@class,"productBanner")]//img/@src | //div[contains(@class, "lb_gallery_thumbnail")]/@img | //div[contains(@class,"main-content")]//p/@style',
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        );
        let img = '';
        for (let i = 0; i < images.snapshotLength; i++) {
          let item = images.snapshotItem(i).textContent;
          if (item.includes('background-image')) {
            item = item.replace(/(.+'|")(.+)('|")(.+)/, '$2');
          }
          img = img + (img ? ' | ' : '') + item;
        }
        return img;
      });
      const eDescription = await context.evaluate(() => {
        const desc = document.evaluate(
          '//div[@class="product-details"] | //div[@class="a-plus-content"]/div[contains(@class,"a-plus-box-main")]/div | //div[@id="attributes"]//div[contains(@class,"attribute")] | //div[contains(@class,"introtext")] | //div[@class="grid-item"] | //h4[contains(@class,"panel-title")][contains(.,"técnicos")]/../following-sibling::div//div[contains(@class,"panel-heading")] | //td[contains(@class, "attributesName")] | //td[contains(@class, "attributesValue")]',
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        );
        let text = '';
        for (let i = 0; i < desc.snapshotLength; i++) {
          const item = desc.snapshotItem(i).textContent;
          text = text + (text ? ' ' : '') + item;
        }
        return text;
      });
      const videos = await context.evaluate(() => {
        const video = document.evaluate(
          '//video/@src',
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        );
        let vid = '';
        for (let i = 0; i < video.snapshotLength; i++) {
          const item = video.snapshotItem(i).textContent;
          vid = vid + (vid ? ' | ' : '') + item;
          vid = 'https:' + vid;
        }
        return vid;
      });
      await context.goto(currentUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      const variables = {
        sel: selectors,
        images: aplus,
        desc: eDescription,
        vid: videos,
      };
      await context.evaluate((variables) => {
        document.querySelector(variables.sel.targetDiv).setAttribute('aplus-images', variables.images);
        document.querySelector(variables.sel.targetDiv).setAttribute('aplus-description', variables.desc);
        document.querySelector(variables.sel.targetDiv).setAttribute('aplus-videos', variables.vid);
      }, variables);
    } catch (e) {
      console.log(e.message);
    }

    try {
      await context.evaluate((selectors) => {
        const desc = document.evaluate(
          '//article[@class="description"]/*[not(@id="featuresComponent")][not(contains(text(),"Descripción"))] | //article[@class="description"]/text()',
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        );
        let text = '';
        let t = '';
        let z = '';
        for (let i = 0; i < desc.snapshotLength; i++) {
          const item = desc.snapshotItem(i);
          if (item.nodeName === 'UL') {
            const lis = [...item.querySelectorAll('li')];
            lis.forEach(li => {
              t = t + (t ? ' || ' : '') + li.innerText;
            });
            z = ' || ' + t;
          } else if (item.nodeName === '#text') {
            z = item.data;
          } else {
            z = item.innerText;
          }
          text = text + (text ? ' ' : '') + z;
        }
        text = text.replace(/undefined/gs, '');
        document.querySelector(selectors.targetDiv).setAttribute('additional-description', text);
      }, selectors);
    } catch (e) {
      console.log(e.message);
    }
    await context.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      async function infiniteScroll () {
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
    });
    try {
      await context.waitForNavigation({ waitUntil: 'networkidle0' });
      const delay = t => new Promise(resolve => setTimeout(resolve, t));
      await delay(60000);
      const targetScroll = await context.evaluate((selectors) => {
        return Boolean(document.querySelector(selectors.targetManufScroll));
      }, selectors);
      if (targetScroll) {
        await context.evaluate((selectors) => {
          document.querySelector(selectors.targetManufScroll).scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }, selectors);
        const delay = t => new Promise(resolve => setTimeout(resolve, t));
        await delay(60000);
        await context.waitForSelector('#inpage_container', { timeout: 60000 });
        await context.click('#more_flixmedia', { timeout: 60000 });
        await context.waitForSelector('#wrp_flixmedia img', { timeout: 60000 });
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  try {
    await context.evaluate((selectors) => {
      const specs = [...document.querySelectorAll('#features .specification')];
      let headers = [];
      let values = [];
      const getElementsText = (el) => {
        let t = '';
        t += t ? ` ${el.innerText}` : el.innerText;
        const subEls = el.querySelectorAll('a > span.tooltip_content *');
        Array.from(subEls).forEach(e => {
          t += ` ${e.innerText}`;
        });
        return t.trim();
      };
      for (const spec of specs) {
        headers = headers.concat(Array.from(spec.querySelectorAll('dt')).map(getElementsText));
        values = values.concat(Array.from(spec.querySelectorAll('dd')).map(getElementsText));
      }
      const totalLen = headers.length;
      let text = '';
      for (let i = 0; i < totalLen; i++) {
        text += text ? ` | ${headers[i]} ${values[i]}` : `${headers[i]} ${values[i]}`;
      }
      document.querySelector(selectors.targetDiv).setAttribute('specs', text);
    }, selectors);
  } catch (e) {
    console.log(e.message);
  }

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'TR',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.com.tr',
    zipcode: '',
  },
  implementation,
};
