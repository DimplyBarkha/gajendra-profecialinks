const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'galaxus',
    transform,
    domain: 'galaxus.ch',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }

      const searchUrl = window.location.href;
      const productList = document.querySelectorAll('article.panelProduct');

      productList && productList.forEach((item1) => {
        const doc = item1;
        addElementToDocument(doc, 'searchUrl', searchUrl);
      });
      // const dataUrl = 'https://www.galaxus.ch/api/graphql';
      // if (dataUrl) {
      //   const responseData = await fetch(dataUrl, {
      //     method: 'post',
      //     headers: {
      //       cookie: '_abck=636F9625463DE25209AE5D71B84EAA4C~-1~YAAQ269FQ5ECve5zAQAANRjYLwTaBKDTRR19ZAtuO0NHVLZ/xZ4BcYMz/Xy42uuTch9ta3O2HoCEfe6K7fs1SB3j4n33q5B66teogEHab4/31cmP+Yhg7j+3Izl01wirujkgAeWhvK+o4CGpFSZmHuRrOJlTIdimOCJW3TznlO5YY7ATit2qGAPUan/mMWtwIrzfmYkYQPUenslqlZb2rPr322WDEg9VrwXvqFsYrQGbhToD2gPI4RV1OLcvpKlvRVSuDkMWGfydy2z/eAZB8AGd6CBtnGzwE6W94KoBTZMC6kmEX2R0c/HE~-1~-1~-1; ai_user=p0M/9|2020-08-27T12:15:31.671Z; .bid=3a702b1e-4c32-461d-93c1-f89060301ff7; .cid=57f64739-df95-4132-a2ca-d5d7d6aef879; .z=go0EVoulistgeVlUBvoeyQ==; LoggedInUserId=NONE; DisplayCountryId=1; DisplayCurrencyId=1; DisplayCulture=en-US; DisplayLanguageId=2; .sum=ActiveShopListId=-1&DefaultPickupSiteId=-1&ProductListDisplayModeForProductList=Panel&SelectedUserMenuTab=None&vat=true; activeABTests=OSA-8162-testReportsHeader:0_lane:2; RecentlyVisitedProducts_=6293855,7999819,11861704,11035478,13015967; AKA_A2=A; ak_bmsc=E7C6A4081D97AA12B66C1D18F13AC70F17D46C1AB07D00000DA0595F0B4E2E54~plBu//EOFr00ZsrlMJVYfgu/FlY3ZkNAtZ3G+uG4Uq9sTWxzzSpvtl7bPcUk2J3eeg76lcv6d/9UmjR1U7aTi91AV1hg+rvlmcz45i1gR6Sv36FAACRGHcmGBVGU4cQwN01x2DkZZk9pMw/HnM1WMxQ1CnMkTBQsA25kLXr+zYZq2XpO7hCPdsp/T4X4XpkSj9VuhakXdfuw60BaJYQ8/yUC1+y2ZDuBsu86k21HSrDHQ=; bm_sz=9E033365BDB1FD5D177336683E7190C9~YAAQGmzUFwRAh210AQAAxTUZdgnT6SqJ6X83sw5AznPr26CDSlRPN0NXm9Cp9oSnmlZ/CAjYEkBXTnYlffSEbTSkS+9+E+o3CXv4p5g3tUU0gtK//g9w+CCYmyDJRc75oO9l8VSb1Bh6jU6zCWZJdYWPTcEnauCXdeeIHBIQv5X5ihyy9n4d93j5IRJf4foP; .sid=cdc9ddd3-f008-4902-8a2c-c8e19c5a7f6f; .sidexp=1599716400; .bidexp=1915242000; DisplayedMarketingTeasers=17064581=10.09.2020 09:10&17139023=10.09.2020 09:10&17146492=10.09.2020 09:10&17103952=10.09.2020 09:10&17099706=10.09.2020 09:10&17144281=10.09.2020 09:10&16333863=10.09.2020 09:10&17137742=10.09.2020 09:10&16669577=10.09.2020 09:10; ai_session=x4Y4L|1599709202090.91|1599709202090.91; bm_sv=3C65C64D5A3E7F1C271C5B3E0FB082F4~DBZFdG1tZkCRvIkoSNkrUXOP2OGazTr+Zyna/KHhD8AUnoIJDLH1Ht5O60PABKn739pi14+zQr8WENEu8IgUh3vX9rGQqtatCjyklJ3Rjg9+Zh1V0Fm8Jv5o9yUfK3tg7RVOm0PVtNc4gYZ44D72K3pemZ4km8vQN4CmdIlAHTw=',
      //     },
      //   }).then(res => res.text());
      //   const domParser = new DOMParser();
      //   const jsonData = domParser.parseFromString(responseData, 'text/html');
      //   console.log('responsee------>', responseData);
      // }
    });
    return await context.extract(productDetails, { transform });
  },
};
