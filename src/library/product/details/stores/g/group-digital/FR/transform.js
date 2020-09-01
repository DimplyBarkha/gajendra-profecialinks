/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
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

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.name) {
        let specs = '';
        row.name.forEach(item => {
          specs += ` ${item.text.trim()}`;
        });
        row.name = [
          {
            text: specs.trim(),
          },
        ];
      }
      if (row.name && row.brandText) {
        row.nameExtended = [
          { text: row.brandText[0].text + ' - ' + row.name[0].text },
        ];
      }
      if (row.description) {
        let specs = '';
        row.description.forEach(item => {
          specs += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.description = [
          {
            text: cleanUp(specs.slice(0, -3)),
          },
        ];
      }
      if (row.specifications) {
        let specs = '';
        row.specifications.forEach(item => {
          specs += `${item.text} || `;
        });
        row.specifications = [
          {
            text: cleanUp(specs.slice(0, -3)),
          },
        ];
      }

      if (row.image) {
        let specs = '';
        row.image.forEach(item => {
          specs += `${item.text.replace('thumbnail', 'image').replace('120x', '800x')}`;
        });
        row.image = [
          {
            text: specs,
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages.forEach((item, index) => {
          row.alternateImages.splice(index, 1, { text: `${item.text.replace('thumbnail', 'image').replace('120x', '800x')}` });
        });
      }
      if (row.aggregateRating) {
        const txt = Number(row.aggregateRating[0].text) / 20;
        row.aggregateRating = [
          {
            text: txt,
          },
        ];
      }
      if (row.shippingInfo) {
        let specs = '';
        row.shippingInfo.forEach(item => {
          specs += `${item.text} `;
        });
        row.shippingInfo = [
          {
            text: specs,
          },
        ];
      }
      if (row.weightGross) {
        let specs = '';
        row.weightGross.forEach(item => {
          specs += `${item.text.replace(':', '')}`;
        });
        row.weightGross = [
          {
            text: specs.trim(),
          },
        ];
      }
      if (row.weightNet) {
        let specs = '';
        row.weightNet.forEach(item => {
          specs += `${item.text.replace(':', '')}`;
        });
        row.weightNet = [
          {
            text: specs.trim(),
          },
        ];
      }
      if (row.shippingWeight) {
        let specs = '';
        row.shippingWeight.forEach(item => {
          specs += `${item.text.replace(':', '')}`;
        });
        row.shippingWeight = [
          {
            text: specs.trim(),
          },
        ];
      }
      if (row.shippingDimensions) {
        let specs = '';
        row.shippingDimensions.forEach(item => {
          specs += `${item.text.replace(':', '')}`;
        });
        row.shippingDimensions = [
          {
            text: specs.trim(),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
