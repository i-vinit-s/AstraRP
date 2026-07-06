const Activity = require("../models/Activity");

exports.createActivity = async ({
  type,
  actor = null,
  target = null,
  application = null,
  metadata = {},
}) => {
  return Activity.create({
    type,
    actor,
    target,
    application,
    metadata,
  });
};
