/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {  
    const cleanUp = (data, context) => {
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
    for (const { group } of data) {
      for (let row of group) {
        if (row.lastName) {
            row.lastName.forEach(item => {
              item.text = item.text.split(",").pop();
              item.text = item.text.replace(',', '').trim();
              item.text = item.text.split(" ").pop();
            });
          }
          if (row.dob) {
            row.dob.forEach(item => {
              item.text = item.text.replace(/\s*/g, '').trim();
              item.text = item.text.replace('DOB', '').trim();
            });
          }
          if (row.sourceName) {
            row.sourceName.forEach(item => {
              item.text = item.text.replace('Court', '').trim();
            });
          }
          if (row.court) {
            row.court.forEach(item => {
              item.text = item.text.replace('Court', '').trim();
            });
          }
          if (row.sourceState) {
            row.sourceState.forEach(item => {
              item.text = item.text.replace('Plaintiff', '').trim();
              item.text = item.text.split("State of ").pop();
            });
          }
          if (row.judicialOfficer) {
            row.judicialOfficer.forEach(item => {
              item.text = item.text.replace('Judicial Officer', '').trim();
            });
          }
          if (row.caseStatus) {
            row.caseStatus.forEach(item => {
              item.text = item.text.replace('Judicial Officer', '').trim();
            });
          }
          if (row.caseType) {
            row.caseType.forEach(item => {
              item.text = item.text.replace('Case Type', '').trim();
            });
          }
          if (row.sentenceDate) {
            row.sentenceDate.forEach(item => {
              item.text = item.text.replace('Start Date:', '').trim();
            });
          }
          if (row.probationDate) {
            row.probationDate.forEach(item => {
              item.text = item.text.replace('Start Date:', '').trim();
            });
          }
          if (row.address1) {
            row.address1.forEach(item => {
              item.text = item.text.replace('Plaintiff', '').trim();
            });
          }
          if (row.firstName) {
            row.firstName.forEach(item => {
              item.text = item.text.split(",").pop();
              item.text = item.text.replace(',', '').trim();
              item.text = item.text.replace(/\/s.*/, '').trim();
            });
          }
      }
    }
    return cleanUp(data);
  };
module.exports = { transform };