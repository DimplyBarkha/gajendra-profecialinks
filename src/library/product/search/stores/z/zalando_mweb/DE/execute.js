module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'zalando_mweb',
    domain: 'zalando.de',
    // url: 'https://m.zalando.de/herren/?q={searchTerms}',
    url: 'https://m.zalando.de/alle/?q={searchTerms}',
    loadedSelector: 'script[id="z-nvg-cognac-props"]',
    noResultsXPath: '//span[contains(text(), "Versuche es mit einem anderen Suchbegriff oder prüfe die Schreibweise")]',
    zipcode: '',
  },
  implementation: async (inputs, { url, loadedSelector, noResultsXPath }, context, dependencies) => {
    const { keywords, query } = inputs;
    const destinationUrl = url.replace('{searchTerms}', encodeURIComponent(keywords)).replace('{queryParams}', query);

    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(90000);
    await dependencies.goto({ ...inputs, url: destinationUrl });

    try {
      await context.click('div#uc-banner-modal button[id="uc-btn-accept-banner"]');
      await context.waitForNavigation();
    } catch (err) {
      console.log('Failed to close cookies popup');
    }

    // checking for selected language and changing to German if required
    const englishSelected = await context.evaluate(async () => !!document.querySelector('a[title="Choose language"]'));
    if (englishSelected) {
      console.log('Changing language');
      await context.click('a[title="Choose language"]');
      await context.waitForSelector('div.z-navicat-header_modalContent', { timeout: 10000 });
      const changingLanguage = await context.evaluate(async () => {
        const deutschLabel = document.evaluate(
          '//label[@class="z-navicat-header_radioItem"][contains(. , "Deutsch")]',
          document,
          null,
          XPathResult.ANY_UNORDERED_NODE_TYPE,
          null,
        ).singleNodeValue;
        if (deutschLabel) {
          deutschLabel.click();
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return !!document.querySelector('div.z-navicat-header_modalContent button[class*="Primary"]');
        }
      });
      if (changingLanguage) {
        await context.click('div.z-navicat-header_modalContent button[class*="Primary"]');
        try {
          await context.waitForSelector('a[title="Sprache auswählen"]', { timeout: 30000 });
          await context.waitForFunction(() => !!window.location.href.match(/(.+m.zalando.de\/).+?(\/.+)/), {
            timeout: 10000,
          });
        } catch (err) {
          console.log('Failed waiting for language to change.');
        }
      }
      console.log('Finished changing language');
    }

    // This part was added in case we wanted to extract women products as well.
    const currentUrl = await context.evaluate(async () => window.location.href);
    console.log(`Current URL: ${currentUrl}`);
    const newUrl = currentUrl.match(/(.+m.zalando.de\/).+?(\/.+)/)
      ? `${currentUrl.match(/(.+m.zalando.de\/).+?(\/.+)/)[1]}alle${currentUrl.match(/(.+m.zalando.de\/).+?(\/.+)/)[2]}`
      : currentUrl;
    console.log(`New URL: ${newUrl}`);
    await dependencies.goto({ ...inputs, url: newUrl });

    if (loadedSelector) {
      await context.waitForFunction(
        function (sel, xp) {
          return Boolean(
            document.querySelector(sel) ||
              document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(),
          );
        },
        { timeout: 10000 },
        loadedSelector,
        noResultsXPath,
      );
    }
    console.log(`noResultsXPath: ${noResultsXPath}`);
    return await context.evaluate(
      (xp) => !document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext(),
      noResultsXPath,
    );
  },
};
