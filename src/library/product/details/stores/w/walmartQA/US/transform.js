
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.answerAuthor) {
        const text = row.answerAuthor.map(elm => elm.text.trim()).join(' | ');
        row.answerAuthor = [{ text }];
      }
      if (row.answerDate) {
        const text = row.answerDate.map(elm => elm.text.trim()).join(' | ');
        row.answerDate = [{ text }];
      }
      if (row.answerId) {
        const text = row.answerId.map(elm => elm.text.trim()).join(' | ');
        row.answerId = [{ text }];
      }
      if (row.answerText) {
        const text = row.answerText.map(elm => elm.text.trim()).join(' | ');
        row.answerText = [{ text }];
      }
    }
  }
  return data;
};

module.exports = { transform };
