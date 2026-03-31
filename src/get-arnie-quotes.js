const { httpGet } = require('./mock-http-interface');

const getArnieQuotes = async (urls) => {
  //get all promises for the urls
  const quotePromises = urls.map(url => httpGet(url));

  //await for all promises to resolve (including rejects)
  const quotes = await Promise.allSettled(quotePromises);

  //map the results to the requirement format
  //assumes that returned response is alwauys in the format { status: number, body: stringified of { message: string } }
  return quotes.map((quote) => {
    //if the promise was rejected, return the failure message
    if (quote.status === 'rejected') {
      return { 'FAILURE': 'Your request has been terminated' };
    }

    //otherwise, parse the response
    const quoteValue = quote.value;

    if (quoteValue.status === 200) {
      return { 'Arnie Quote': JSON.parse(quoteValue.body).message };
    } else {
      return { 'FAILURE': JSON.parse(quoteValue.body).message };
    }
  });
};

module.exports = {
  getArnieQuotes,
};
