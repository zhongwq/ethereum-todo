const lodash = require('lodash');

module.exports = {
  getEvents: function (tx, filter) {
    const logs = tx.logs;
    const events = lodash.filter(logs, filter);
    return events;
  }
}