import Bug from "../models/Bug.js";
import User from "../models/User.js";

export async function getUsers(req, res, next) {
  try {
    const users = await User.aggregate([
      { $project: { password: 0 } },
      { $lookup: { from: "bugs", localField: "_id", foreignField: "reportedBy", as: "reportedBugs" } },
      { $project: { name: 1, email: 1, role: 1, createdAt: 1, bugCount: { $size: "$reportedBugs" } } },
      { $sort: { createdAt: -1 } },
    ]);
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUserStats(req, res, next) {
  try {
    const [total, open, inProgress, resolved, recent] = await Promise.all([
      Bug.countDocuments({ reportedBy: req.auth.id }),
      Bug.countDocuments({ reportedBy: req.auth.id, status: "Open" }),
      Bug.countDocuments({ reportedBy: req.auth.id, status: "In Progress" }),
      Bug.countDocuments({ reportedBy: req.auth.id, status: "Resolved" }),
      Bug.find({ reportedBy: req.auth.id }).sort({ createdAt: -1 }).limit(5),
    ]);
    res.json({ total, open, inProgress, resolved, recent });
  } catch (error) {
    next(error);
  }
}