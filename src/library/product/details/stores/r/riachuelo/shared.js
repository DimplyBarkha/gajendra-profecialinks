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
      try {
        if (row.aggregateRating) {
          let text = '';
          row.aggregateRating.forEach(item => {
            text = item.text.replace(',', '.');
          });
          row.aggregateRating = [{ text }];
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
        row = cleanUp(row);
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  return data;
}
module.exports = { transform };
