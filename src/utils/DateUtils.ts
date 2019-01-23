export const epochToLocalTime = (utcSeconds: number) => {
  console.log('epochToLocalTime utcSeconds: ' + utcSeconds);

  const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(utcSeconds);

  console.log('epochToLocalTime result: ' + JSON.stringify(d));

  return d;
};

export const prettyPrintDate = (date: Date) => {
  let options = {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'};
  return date.toLocaleDateString('en-US', options);
};
