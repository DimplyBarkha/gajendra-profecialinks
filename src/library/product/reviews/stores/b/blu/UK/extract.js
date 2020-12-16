const transform = (data) => {
  const cleanUp = (data, context) => {
    const clean = text => text.toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  return cleanUp(data);
};

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'blu',
    transform,
    domain: 'blu.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies) => {
    const { productReviews } = dependencies;
    await context.evaluate(async () => {
      const popUps = document.querySelector('[data-testid="age-wall-button-accept"]');
      if (popUps) {
        document.getElementById('check').click();
        popUps.click();
        new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 5000);
        });
      }
    });
    new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
    return await context.extract(productReviews);
  },
};
