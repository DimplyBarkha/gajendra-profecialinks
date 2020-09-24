/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        const descs = [];
        let newTxt = '';
        let cnt = 0;
        row.description.forEach(item => {
          descs[0] = item;
          item.text = item.text.replace(/(\s?\n)+/g, ' ').trim();
          if (cnt > 0) newTxt = newTxt + '||' + item.text;
          else newTxt = newTxt + item.text;
          cnt++;
        });
        descs.forEach(item => {
          item.text = newTxt;
        });
        row.description = descs;
      }

      if (row.specifications) {
        const specs = [];
        let newTxt = '';
        let cnt = 0;
        row.specifications.forEach(item => {
          specs[0] = item;
          item.text = item.text.replace(/(\s?\n)+/g, ' ');
          if (cnt > 0) newTxt = newTxt + '|' + item.text;
          else newTxt = newTxt + item.text;
          cnt++;
        });

        specs.forEach(item => {
          item.text = newTxt;
        });
        row.specifications = specs;
      }

      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          const val = item.value;
          let newval = 0;
          if (val === 0) {
            newval = 0;
          } else if (val > 0 && val <= 20) {
            newval = 1;
          } else if (val > 20 && val <= 40) {
            newval = 2;
          } else if (val > 40 && val <= 60) {
            newval = 3;
          } else if (val > 60 && val <= 80) {
            newval = 4;
          } else if (val > 80 && val <= 100) {
            newval = 5;
          }
          item.value = newval;
          item.text = newval.toString();
        });
      }

      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          const locText = item.text;
          if (locText.indexOf('###') > 0) {
            item.text = locText.substring(0, locText.indexOf('###'));
          } else if (locText.indexOf('###') === 0) {
            item.text = locText.replace('###', '');
          }
        });
      }

      if (row.price) {
        row.price.forEach(item => {
          if (item.text) {
            item.text = item.text.replace(' ', '');
            item.text = item.text.replace('.', ',');
          }
        });
      }
      if (row.technicalInformationPdfPresent) {
        row.technicalInformationPdfPresent.forEach(item => {
          if (item.text && item.text.length > 0) {
            item.text = 'Yes';
          } else {
            item.text = 'No';
          }
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
