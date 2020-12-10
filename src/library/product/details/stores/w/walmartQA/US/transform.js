
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
    // .replace(/"\s{1,}/g, '"')
    // .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  function decode (str) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec);
    });
  }

  for (const { group } of data) {
    for (const row of group) {
      if (row.answerAuthor) {
        const text = row.answerAuthor.map(elm => elm.text.trim()).join(' | ');
        row.answerAuthor = [{ text }];
      }
      if (row.answerDate) {
        row.answerDates = row.answerDate;
        const text = row.answerDate.map(elm => elm.text.trim()).join(' | ');
        row.answerDate = [{ text }];
        row.answerDateText = row.answerDate;
      }
      if (row.answerId) {
        const text = row.answerId.map(elm => elm.text.trim()).join(' | ');
        row.answerId = [{ text }];
      }
      if (row.answerText) {
        const text = row.answerText.map(elm => elm.text.trim()).join(' | ');
        row.answerText = [{ text }];
      }
      if (row.helpfulCount) {
        const text = row.helpfulCount.map(elm => elm.text.trim()).join(' | ');
        row.helpfulCount = [{ text }];
      }
      if (row.notHelpfulCount) {
        const text = row.notHelpfulCount.map(elm => elm.text.trim()).join(' | ');
        row.notHelpfulCount = [{ text }];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = el.text ? clean(decode(el.text)) : el.text;
      }));
    }
  }
  return data;
};

module.exports = { transform };
