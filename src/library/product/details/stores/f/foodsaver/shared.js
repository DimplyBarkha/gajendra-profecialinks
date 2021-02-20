/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    console.log('INSIDE OF CLEANUP');
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '');

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (let row of group) {
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
      if (row.description) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.description.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + '||';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.description = nDesc;

        row = cleanUp(row);
      }
      if (row.specifications) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.specifications.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + '||';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.specifications = nDesc;
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
      if (row.availabilityText) {
        for (const item of row.availabilityText) {
          if (item.text.includes('In Stock')) {
            item.text = 'In Stock';
          } else {
            item.text = 'Out of Stock';
          }
        }
      }
    }
  }
  return data;
};

module.exports = { transform };
