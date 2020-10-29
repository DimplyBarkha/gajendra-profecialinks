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
        row.description.forEach(item => {
          const locText = item.text;
          const length = locText.length;
          const startIdx = locText.indexOf('\n \n \n');
          let lastIdx = locText.lastIndexOf('\n \n \n');
          if (startIdx === lastIdx) lastIdx = length - 1;
          let firstStr = locText.substring(0, startIdx);
          firstStr = firstStr.replace(/\n \n/g, ' ');
          let secStr = locText.substring(startIdx, lastIdx);
          secStr = secStr.replace(/\n \n \n/g, ' || ');
          secStr = secStr.replace(/\n \n/g, ' || ');
          let lastString = locText.substring(lastIdx, length);
          lastString = lastString.replace(/\n \n \n/g, ' || ');
          lastString = lastString.replace(/\n \n/g, ' ');

          item.text = firstStr + secStr + lastString;
          // console.log(item.text);
        });
      }

      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach(item => {
          item.text = item.text.replace(/\n \n/g, ' | ');
          // console.log(item.text);
        });
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

    }
  return data;
};

module.exports = { transform };
