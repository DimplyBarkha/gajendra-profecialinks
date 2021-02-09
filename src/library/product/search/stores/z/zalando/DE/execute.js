async function implementation (inputs, parameters, context, dependencies) {
  const url = 'https://zalando.de/herren/?q={searchTerms}'.replace(
    '{searchTerms}',
    encodeURIComponent(inputs.keywords),
  );

  await dependencies.goto({ url, zipcode: inputs.zipcode });
  if (parameters.loadedSelector) {
    await context.waitForFunction(
      function (sel, xp) {
        return Boolean(
          document.querySelector(sel) ||
            document
              .evaluate(
                xp,
                document,
                null,
                XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
                null,
              )
              .iterateNext(),
        );
      },
      { timeout: 10000 },
      parameters.loadedSelector,
      parameters.noResultsXPath,
    );
  }

  // after the search results page and checking loadedSelector and noResultsXPath
  // changing language
  await context.evaluate(async () => {
    const languageOnPage = document.querySelector('html[lang][class]')
      ? document.querySelector('html[lang][class]').getAttribute('lang') : null;
    if (languageOnPage.includes('en')) {
      const lang = document.querySelector('div[class*="langNav"] a[href="#"]');
      if (lang !== null) {
        // @ts-ignore
        lang.click();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      };

      const langOpt = document.querySelector('label[for="de-m"]');
      if (langOpt !== null) {
        // @ts-ignore
        langOpt.click();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      };

      const langSave = document.querySelector('div[class*="modal"] button[class*="_buttonPrimary"]');
      if (langSave !== null) {
        // @ts-ignore
        langSave.click();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      };
    }
  });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const currentUrl = await context.evaluate(async () => {
    if (window !== undefined) { return window.location.href; }
  });
  const searchTerm = await context.evaluate(async () => {
    const url = window.location.href;
    if (url.includes('?q=') && url.includes('&_fm')) { return url.match(/q=(.+)&_fm/)[1]; };
    if (url.includes('?q=') && !url.includes('&_fm')) { return url.match(/q=(.+)/)[1]; }
  });
  // manually redirecting to searchUrls, because otherwise site is autoredirecting to searchUrls that are not correct with t1 file
  if (currentUrl.includes('?q=After%20Sun%20Gesicht') || currentUrl.includes('?q=After+Sun+Gesicht')) {
    await context.goto(`https://www.zalando.de/beauty-gesichtsmaske/?q=${searchTerm}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if (currentUrl.includes('Gesichtsbürste')) {
    await context.goto(`https://www.zalando.de/damen/?q=${searchTerm}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if ((currentUrl.includes('?q=lippenstift') || currentUrl.includes('?q=Lidschatten') || currentUrl.includes('?q=foundation') || currentUrl.includes('?q=wimpern') || currentUrl.includes('?q=highlighter') || currentUrl.includes('?q=Augenbrauen') || currentUrl.includes('beauty-augenbrauen/?q=') || currentUrl.includes('?q=concealer')) && !currentUrl.includes('?q=concealer+hell') && !currentUrl.includes('?q=wimperntusche') && !currentUrl.includes('?q=wimpernserum') && !currentUrl.includes('?q=wachstum')) {
    await context.goto(`https://www.zalando.de/alle/?q=${searchTerm}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if (currentUrl.includes('?q=augenbrauen%20farben')) {
    await context.goto(`https://www.zalando.de/beauty-damen/?q=${searchTerm}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if (currentUrl.includes('beauty-highlighter/?q') || currentUrl.includes('beauty-mascara/?q=wimperntusche') || currentUrl.includes('beauty-augenbrauengel/?q')) {
    await context.goto('https://www.zalando.de/herren/');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await context.goto(`https://www.zalando.de/herren/?q=${searchTerm}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if ((!currentUrl.includes('beauty-augenbrauen/?q=') && !currentUrl.includes('?q=Lidschatten&') && !currentUrl.includes('?q=Damen+sneaker') && !currentUrl.includes('?q=concealer+hell') && !currentUrl.includes('?q=wimpern+serum+wachstum')) && (currentUrl.includes('?q=primer&') || currentUrl.includes('?q=duschgel+frauen') || currentUrl.includes('?q=wimperntusche') || currentUrl.includes('?q=bronzer&') || currentUrl.includes('?q=Gesichtsspray') || currentUrl.includes('?q=Lippenpeeling&') || currentUrl.includes('?q=Lippenpflege&') || currentUrl.includes('kinderschuhe-klassische-sneaker') || currentUrl.includes('Wasserdichte+Jacke') || currentUrl.includes('damen/?q=') || currentUrl.includes('beauty-augencreme/?q') || currentUrl.includes('Lippenscrub') || currentUrl.includes('?q=argan%C3%B6l'))) {
    await context.goto(`https://www.zalando.de/herren/?q=${searchTerm}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return await context.evaluate(function (xp) {
    const r = document.evaluate(
      xp,
      document,
      null,
      XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
      null,
    );
    const e = r.iterateNext();
    return !e;
  }, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    domain: 'zalando.de',
    url: 'https://zalando.de/herren/?q={searchTerms}',
    loadedSelector: 'div[class*="cat_catalog"]',
    noResultsXPath: '//div[contains(@class, "noSearch")]//text()[contains(., "Du hast")] | //div[contains(@class, "404")] | //div[contains(@class, "error-page")]',
    zipcode: '',
  },
  implementation,
};
