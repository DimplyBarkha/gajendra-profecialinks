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
    await dependencies.goto({ ...inputs, url: destinationUrl });

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
        await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
      }
      console.log('Finished changing language');
    }

    // This part was added in case we wanted to extract women products as well.
    let newUrl = await context.evaluate(async () => window.location.href);
    console.log(`Current URL: ${newUrl}`);
    newUrl = newUrl.match(/(.+m.zalando.de\/).+?(\/.+)/)
      ? `${newUrl.match(/(.+m.zalando.de\/).+?(\/.+)/)[1]}alle${newUrl.match(/(.+m.zalando.de\/).+?(\/.+)/)[2]}`
      : newUrl;
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
