/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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

  let manufacturerImages = [];
  const manufacturerDescription = [];
  const video = [];
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
          if (cnt > 0) newTxt = newTxt + ' | ' + item.text;
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
          if (item.text && item.text.length > 0 && item.text !== 'No') {
            item.text = 'Yes';
          } else {
            item.text = 'No';
          }
        });
      }

      if (row.manufacturerImages1) {
        manufacturerImages = [...manufacturerImages, ...row.manufacturerImages1];
        delete row.manufacturerImages1;
        row.manufacturerImages = manufacturerImages;
      }

      if (row.manufacturerDescription1) {
        row.manufacturerDescription1.forEach(item => {
          item.text = clean(item.text);
          manufacturerDescription[0] = item;
        });
        delete row.manufacturerDescription1;
        row.manufacturerDescription = manufacturerDescription;
      }

      if (row.video1) {
        row.video1.forEach(item => {
          item.text = clean(item.text);
          video[0] = item;
        });
        delete row.video1;
        row.videos = video;
      }

      if (row.additionalDescBulletInfo) {
        const info = [];
        const elem = []
        row.additionalDescBulletInfo.forEach(item => {
          info.push(clean(item.text))
          // item.text = clean(item.text);
          elem[0] = item;
        });
        row.additionalDescBulletInfo = [{text: info.join(' | '), xpath: elem[0].xpath}];
      }
      
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

module.exports = { transform };
