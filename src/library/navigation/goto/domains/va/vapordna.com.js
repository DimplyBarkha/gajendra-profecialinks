
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'vapordna.com',
    timeout: 50000,
    country: 'US',
    store: 'vapordna',
    zipcode: "''",
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

    await context.evaluate(async function () {
      var button = document.querySelector('div#age-check-prompt button#submit_birthdate');
      button.click();

      if (url.includes("search?")) {
        let scrolltop = document.getElementById("PageContainer").scrollTop;
        var btn = document.querySelector('div.ais-infinite-hits--showmore > button');

        if (!btn.disabled) {
          //get total results found
          var totalPages = document.getElementsByClassName('ais-stats--nb-results')[0].innerText;
          totalPages = totalPages.match(/\d+/)[0]

          //48 resuls are per page, so calculate number of click required to load all products
          var clickCount = Math.floor(totalPages / 48);
          for (var i = 0; i < clickCount; i++) {
            document.querySelector('div.ais-infinite-hits--showmore > button').click();
            await new Promise(r => setTimeout(r, 1000));
          }
        }
      }
    });
  },
};
