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
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let desc = '';
        row.description.forEach(item => {
          desc += `${item.text}`;
        });
        row.description = [
          {
            text: desc.replace(/\n \n/g, ' || '),
          },
        ];
      }
      if (row.specifications) {
        let desc = '';
        row.specifications.forEach(item => {
          desc += `${item.text}`;
        });
        row.specifications = [
          {
            text: desc.replace(/\n \n/g, ' || '),
          },
        ];
      }
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          const locText = item.text;
          if (locText.indexOf('###') > 0) {
            item.text = locText.substring(0, locText.indexOf('###'));
          } else if (locText.indexOf('###') === 0) {
            item.text = locText.replace('###', '');
          }
          console.log(item.text);
        });
      }
      if (row.videos) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.videos.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + '|';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.videos = nDesc;
      }
      if (row.variants) {
        const nvariants = [];
        let newText = '';
        row.variants.forEach(item => {
          nvariants[0] = item;
          newText = newText + item.text.replace('/item', '').replace('.html', '') + '|';
        });
        console.log(newText);
        nvariants.forEach(item => {
          if (newText.length > 0) newText = newText.substring(0, newText.length - 1);
          item.text = newText;
        });
        row.variants = nvariants;
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
