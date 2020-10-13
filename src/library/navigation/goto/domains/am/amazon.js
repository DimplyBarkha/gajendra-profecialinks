async function implementation ({ url, zipcode, inputs }, { addressRegExp, zipRegExp, countryCode, domain, extractor }, context, { customGoto }) {
  const input = { _url: url, domain, context, asin: (inputs.id || inputs.keywords), extractor };
  // Do we have a way to get extractor id during the running?
  if (input.asin) {
    console.log('calling custom goto function');
    await customGoto(input);
  } else {
    throw new Error('ASIN not provided.');
  }
};

module.exports = {
  dependencies: {
    customGoto: 'action:navigation/goto/domains/am/amazonCustomGoto',
  },
  implementation,
};
