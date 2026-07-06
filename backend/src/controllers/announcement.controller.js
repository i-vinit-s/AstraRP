const slugify = require("slugify");

const Announcement = require("../models/Announcement");
const asyncHandler = require("../utils/asyncHandler");

const activityService = require("../services/activity.service");
const botService = require("../services/bot.service");

const { getIO } = require("../socket");

exports.getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find()
    .populate("author", "username globalName avatar")
    .sort({
      pinned: -1,
      createdAt: -1,
    });

  res.json({
    success: true,
    count: announcements.length,
    announcements,
  });
});

exports.getAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id).populate(
    "author",
    "username globalName avatar",
  );

  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: "Announcement not found.",
    });
  }

  res.json({
    success: true,
    announcement,
  });
});

exports.createAnnouncement = asyncHandler(async (req, res) => {
  const { title, content, type, color, pinned, published, image } = req.body;

  const announcement = await Announcement.create({
    title,
    slug: `${slugify(title, {
      lower: true,
      strict: true,
    })}-${Date.now()}`,

    content,
    type,
    color,
    pinned,
    published,
    image,
    author: req.user._id,
  });

  await announcement.populate("author", "username globalName avatar");

  await activityService.createActivity({
    type: "announcement_created",
    actor: req.user._id,
    metadata: {
      announcement: announcement._id,
    },
  });

  try {
    const messageId = await botService.sendAnnouncement(announcement);

    announcement.discordMessageId = messageId;

    await announcement.save();
  } catch (err) {
    console.error(err);
  }

  getIO().emit("announcement:new", announcement);

  res.status(201).json({
    success: true,
    announcement,
  });
});

exports.updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: "Announcement not found.",
    });
  }

  Object.assign(announcement, req.body);

  await announcement.save();

  await announcement.populate("author", "username globalName avatar");

  await activityService.createActivity({
    type: "announcement_updated",
    actor: req.user._id,
    metadata: {
      announcement: announcement._id,
    },
  });

  try {
    await botService.updateAnnouncement(announcement);
  } catch (err) {
    console.error(err);
  }

  getIO().emit("announcement:updated", announcement);

  res.json({
    success: true,
    announcement,
  });
});

exports.deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return res.status(404).json({
      success: false,
      message: "Announcement not found.",
    });
  }

  try {
    await botService.deleteAnnouncement(
      announcement.discordMessageId,
      announcement.category,
    );
  } catch {}

  await announcement.deleteOne();

  await activityService.createActivity({
    type: "announcement_deleted",
    actor: req.user._id,
    metadata: {
      title: announcement.title,
    },
  });

  getIO().emit("announcement:deleted", {
    id: req.params.id,
  });

  res.json({
    success: true,
  });
});