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
        if (row.LastName) {
            row.LastName.forEach(item => {
              item.text = item.text.split(",").pop();
              item.text = item.text.replace(',', '').trim();
              item.text = item.text.split(" ").pop();
            });
          }
          if (row.DOB) {
            row.DOB.forEach(item => {
              item.text = item.text.replace(/\s*/g, '').trim();
              item.text = item.text.replace('DOB', '').trim();
            });
          }
          if (row.sourceName) {
            row.sourceName.forEach(item => {
              item.text = item.text.replace('Court', '').trim();
            });
          }
          if (row.Court) {
            row.Court.forEach(item => {
              item.text = item.text.replace('Court', '').trim();
            });
          }
          if (row.sourceState) {
            row.sourceState.forEach(item => {
              item.text = item.text.replace('Plaintiff', '').trim();
              item.text = item.text.split("State of ").pop();
            });
          }
          if (row.JudicialOfficer) {
            row.JudicialOfficer.forEach(item => {
              item.text = item.text.replace('Judicial Officer', '').trim();
            });
          }
          if (row.CaseStatus) {
            row.CaseStatus.forEach(item => {
              item.text = item.text.replace('Judicial Officer', '').trim();
            });
          }
          if (row.JudicialOfficer) {
            row.JudicialOfficer.forEach(item => {
              item.text = item.text.replace('Judicial Officer', '').trim();
            });
          }
          if (row.caseType) {
            row.caseType.forEach(item => {
              item.text = item.text.replace('Case Type', '').trim();
            });
          }
          if (row.SentenceYYYMMDDD) {
            row.SentenceYYYMMDDD.forEach(item => {
              item.text = item.text.replace('Start Date:', '').trim();
            });
          }
          if (row.ProbationYYYMMDDD) {
            row.ProbationYYYMMDDD.forEach(item => {
              item.text = item.text.replace('Start Date:', '').trim();
            });
          }
          if (row.Address1) {
            row.Address1.forEach(item => {
              item.text = item.text.replace('Plaintiff', '').trim();
            });
          }
          if (row.FirstName) {
            row.FirstName.forEach(item => {
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