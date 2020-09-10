const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'expert',
    transform: transform,
    domain: 'expert.ie',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    let content = null;
    let image = null;

    async function addHiddenInfo (elementID, content) {
      await context.evaluate(async function (elementID, content) {
        const newDiv = document.createElement('div');
        newDiv.id = elementID;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }, elementID, content);
    }

    async function addHiddenArrayList (elementID, value) {
      await context.evaluate(async function (elementID, value) {
        const htmlString = `<span style="display:none" id="added_${elementID}" ></span>`;
        const root = document.body;
        root.insertAdjacentHTML('beforeend', htmlString);
        const innerHTML = value.reduce((acc, val) => {
          return `${acc}<li>${val}</li>`;
        }, '<ul>') + '</ul>';
        document.querySelector(`#added_${elementID}`).innerHTML = innerHTML;
      }, elementID, value);
    }

    await context.evaluate(async function () {
      var elmnt = document.querySelector('div.page-wrapper, div.footer-main');
      elmnt.scrollIntoView();
    });



    const link = await context.evaluate(async function () {
      return window.location.href;
    });

    const apiManufCall = await context.evaluate(async function () {
      if (document.querySelector('iframe#loadbeeTabContent')) {
        return document.querySelector('iframe#loadbeeTabContent').getAttribute('src');
      } else if (document.querySelector('iframe#eky-dyson-iframe')) {
        return document.querySelector('iframe#eky-dyson-iframe').getAttribute('src');
      } else if (document.querySelector('div#flix-minisite > a')) {
        const url = document.querySelector('div#flix-minisite > a').getAttribute('onclick');
        const productURL = (window.location.href).replace('https://', '');
        const distributorID = document.querySelector('script[data-flix-inpage="flix-inpage"]') ? document.querySelector('script[data-flix-inpage="flix-inpage"]').getAttribute('data-flix-distributor') : '';
        // var requestOptions = {
        //   method: 'GET',
        //   // headers: myHeaders,
        //   redirect: 'follow'
        // };
        // fetch("https://media.flixcar.com/delivery/js/minisite/8721/en/ean/5025155037256/null/310725-01?d=8721&l=en&ean=5025155037256&sku=310725-01&dom=flix-minisite&fl=em&ssl=1&type=.json", requestOptions)
        //   .then(response => response.text())
        //   .then(result => console.log(result))
        //   .catch(error => console.log('error', error));

        // 'https://media.flixcar.com/delivery/minisite/show/8721/en/1501393%3Fpn=https%253A//www.expert.ie/dyson-airwrap-complete-hair-styler-310725-01.html'
        // 'https://media.flixcar.com/delivery/minisite/show/8721/en/1501393//www.expert.ie/dyson-airwrap-complete-hair-styler-310725-01.html
        // `https://media.flixcar.com/delivery/minisite/show/8721/en/1501393%3Fpn=https%253A//${productURL}`;

        const flickSplitURL = url.split('_FFOpenWin("').length ? (url.split('_FFOpenWin("')[1]) : '';
        const flickURL = flickSplitURL.split(')')[0];
        return 'https:' + flickURL;
      }
      return null;
    });

    if (apiManufCall) {
      await context.goto(apiManufCall);
      const text = await context.evaluate(async function () {
        return document.querySelector('body').innerText;
      });
      content = text;
      const images = await context.evaluate(async function () {
        const images = document.querySelectorAll('body img');
        const imagesSrc = [];
        [...images].forEach((element) => {
          imagesSrc.push(element.getAttribute('src'));
        });
        return imagesSrc;
      });
      image = images;
      await context.goto(link);
      addHiddenInfo('ii_manufContent', content);
      if (image.length) {
        addHiddenArrayList('ii_manufImg', image);
        // image.forEach((element, index) => {
        //   addHiddenInfo('ii_manufImg'+index, element);
        // });
      }
    }

    const termAndCond = await context.evaluate(async function () {
      return document.querySelector('div.footer-online-shopping-part div.footer-slide li a[href*="term-conditions"]');
    });

    addHiddenInfo('ii_termCond', termAndCond ? 'Yes' : 'No');


    return await context.extract(productDetails, { transform: transformParam });
  },
};
