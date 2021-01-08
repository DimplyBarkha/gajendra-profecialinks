module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'hepsiburada.com',
    timeout: 50000,
    country: 'TR',
    store: 'hepsiburada',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 30000));
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    async function getHtml(url) {
      const element = document.querySelectorAll('div.flix-std-table div.flix-std-content');
      let inBox = [];
      if (element) {
        for (let i = 0; i < element.length; i++) {
          inBox.push(element[i].textContent.replace(/\s\s/g, ''));
        }
      }
      return inBox;
    }

    async function inBoxUrl(url) {
      //const inBoxImageSelector = 'div.inpage_selector_InTheBox div.flix-background-image img';
      const element = document.querySelectorAll('div.inpage_selector_InTheBox div.flix-background-image img');
      //const element = document.querySelectorAll(inBoxImageSelector);
      let inBox = [];
      if (element) {
        for (let i = 0; i < element.length; i++) {
          inBox.push(element[i].dataset.flixsrcset.match(/^(\/\/)(.+)(.jpg)(.200w)/)[2]);
        }
      }
      return inBox;
    }

    async function addHtml(html, id) {
      const div = document.createElement('div');
      div.setAttribute('id', id);
      div.innerHTML = html;
      const scripts = div.getElementsByTagName('script');
      let i = scripts.length;
      while (i--) {
        scripts[i].parentNode.removeChild(scripts[i]);
      }
      document.body.append(div);
    }

    async function getEnhancedContentLink() {
      try {
        const element = document.querySelector('#flix-iframe');
        return element.src;
      } catch (err) {
        console.log('failed to get gtin', err);
        return false;
      }
    }

    async function addEnhancedContent() {
      const enhancedContentLink = await context.evaluate(getEnhancedContentLink);
      if (enhancedContentLink) {
        await context.goto(enhancedContentLink, {
          timeout,
          waitUntil: 'load',
          checkBlocked: true,
          block_ads: false,
        });
        await new Promise((resolve, reject) => setTimeout(resolve, 10000));
        await context.waitForSelector('div.inpage_selector_InTheBox div.flix-background-image img', { timeout: 90000 });
        const html = await context.evaluate(getHtml, enhancedContentLink);
        const inBoxManufactureUrl = await context.evaluate(inBoxUrl, enhancedContentLink);
        await context.goto(url);
        await context.evaluate(addHtml, html, 'inboxtext');
        await context.evaluate(addHtml, inBoxManufactureUrl, 'inboxurl');
      }
    }
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    url = url + '#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]';
    await context.captureRequests();
    await context.goto(url, {
      timeout,
      waitUntil: 'load',
      checkBlocked: true,
    });
    await addEnhancedContent();
  },
};
