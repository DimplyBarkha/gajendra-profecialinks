
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '" ')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  data.forEach((obj) =>
    obj.group.forEach((row) =>
      Object.keys(row).forEach((header) =>
        row[header].forEach((el) => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );
  const concatFunction = (item, index) => {
    let text = '';
    if ((index + 1) % 2 === 0) {
      text += ` ${item.text}`;
    } else {
      text += ` || ${item.text}`;
    }
    return text;
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item, i) => {
          text += concatFunction(item, i);
        });
        row.specifications = [
          {
            text: text.replace(new RegExp('(\\s\\|\\|\\s)(.+)', 'g'), '$2'),
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = row.description.map(elm => elm.text).join(' ');
        });
        row.description = [{ text }];
      }
      if (row.shippingDimensions) {
        let text = '';
        row.shippingDimensions.forEach(item => {
          text = row.shippingDimensions.map(elm => elm.text).join(' ');
        });
        row.shippingDimensions = [{ text }];
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = row.manufacturerDescription.map(elm => elm.text).join(' ');
        });
        row.manufacturerDescription = [{ text }];
      }
      if (row.price) {
        let text = '';
        row.price.forEach(item => {
          text = row.price.map(elm => elm.text).join(' ').replace('.', ',');
        });
        row.price = [{ text }];
      }
      // if (row.videos) {
      //   let text = '';
      //   row.videos.forEach(item => {
      //     text = row.videos.map(elm => elm.text).join(' ').replace(new RegExp('(.+file":"[^"])(.+mp4)(","image.+)', 'g'), '$2');
      //   });
      //   row.videos = [{ text }];
      // }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach((item, i) => {
          text += concatFunction(item, i);
        });
        row.additionalDescBulletInfo = [
          {
            text: text.replace(new RegExp('(\\s\\|\\|\\s)(.+)', 'g'), '$2'),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
