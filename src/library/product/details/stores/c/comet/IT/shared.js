
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          item.text = item.text.replace(/(.*)/, 'https:$1');
        });
      }
      // if (row.alternateImages) {
      //   row.alternateImages.forEach(item => {
      //     item.text = item.text.replace(/\/hd_[\d]+x_/g, '');
      //   });
      // }
      // if (row.variantId) {
      //   row.variantId.forEach(item => {
      //     item.text = item.text.replace(/.*\/(.*?)\/p/g, '$1');
      //   });
      // }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = item.text.replace(/\n/gm, ' ').replace(/\s{2,}/gm, ' ').trim();
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace(/\./gm, ',');
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.match(/([\d]+)/) ? item.text.match(/([\d]+)/)[0] : '';
        });
      }
      if (row.mpc) {
        row.mpc.forEach(item => {
          const text = item.text.split(':');
          item.text = text[1] ? text[1] : '';
        });
      }
      if (row.videos) {
        row.videos.forEach(item => {
          const videoJSON = JSON.parse(item.text.replace(/\\"/gm, '"'));
          if (videoJSON) {
            item.text = (videoJSON.playlist && videoJSON.playlist[0] && videoJSON.playlist[0].file) ? 'https:' + videoJSON.playlist[0].file : '';
          }
        });
      }
      if (row.shippingDimensions) {
        let text = '';
        row.shippingDimensions.forEach((item, index) => {
          text += item.text.trim() + ' x ';
        });
        row.shippingDimensions = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
    }
  }

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

module.exports = { transform };
