exports.canCreateNewApplication = (application) => {
  if (!application) {
    return {
      allowed: true,
    };
  }

  if (application.status === "draft") {
    return {
      allowed: false,
      reason: "Draft application already exists.",
    };
  }

  if (application.status === "pending") {
    return {
      allowed: false,
      reason: "Application is already pending.",
    };
  }

  if (application.status === "accepted") {
    return {
      allowed: false,
      reason: "User is already whitelisted.",
    };
  }

  if (application.status === "rejected") {
    const cooldownEnds = new Date(application.reviewedAt);

    cooldownEnds.setDate(cooldownEnds.getDate() + 3);

    if (Date.now() >= cooldownEnds.getTime()) {
      return {
        allowed: true,
      };
    }

    return {
      allowed: false,
      reason: "Cooldown active.",
      cooldownEnds,
    };
  }

  return {
    allowed: false,
  };
};
