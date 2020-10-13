async function implementation ({ url, zipcode, inputs }, { addressRegExp, zipRegExp, countryCode, domain, extractor }, context, { customGoto }) {
  const input = { _url: url, domain, context, asin: (inputs.id || inputs.keywords), extractor };
  // Do we have a way to get extractor id during the running?
  await customGoto(input);
};

module.exports = {
  dependencies: {
    customGoto: 'action:navigation/goto/domains/am/amazonCustomGoto',
  },
  implementation,
};
