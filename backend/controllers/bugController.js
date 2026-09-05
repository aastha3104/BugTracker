import Bug from "../models/Bug.js";

const nextBugId = async () => {
  const existingBugs = await Bug.find({ id: /^BUG-\\d+$/ }).select("id").lean();
  const latestNumber = existingBugs.reduce((highest, bug) => {
    const number = Number(bug.id.replace("BUG-", ""));
    return Number.isNaN(number) ? highest : Math.max(highest, number);
  }, 0);
  return `BUG-${String(latestNumber + 1).padStart(3, "0")}`;
};

export async function getBugs(req, res, next) {
  try {
    const filter = req.auth.role === "admin" ? {} : { reportedBy: req.auth.id };
    const bugs = await Bug.find(filter).populate("reportedBy", "name email").sort({ createdAt: -1 });
    res.json(bugs);
  } catch (error) {
    next(error);
  }
}

export async function getBug(req, res, next) {
  try {
    const filter = req.auth.role === "admin"
      ? { id: req.params.id }
      : { id: req.params.id, reportedBy: req.auth.id };
    const bug = await Bug.findOne(filter).populate("reportedBy", "name email");
    if (!bug) return res.status(404).json({ message: "Bug not found" });
    res.json(bug);
  } catch (error) {
    next(error);
  }
}

export async function createBug(req, res, next) {
  try {
    const allowedFields = (({ title, description, priority, severity, status, assignedTo, steps }) => ({
      title, description, priority, severity, status, assignedTo, steps,
    }))(req.body);
    const bug = await Bug.create({
      ...allowedFields,
      id: await nextBugId(),
      reportedBy: req.auth.role === "user" ? req.auth.id : null,
    });
    res.status(201).json(await bug.populate("reportedBy", "name email"));
  } catch (error) {
    next(error);
  }
}

export async function updateBug(req, res, next) {
  try {
    const { title, description, priority, severity, status, assignedTo, steps } = req.body;
    const filter = req.auth.role === "admin"
      ? { id: req.params.id }
      : { id: req.params.id, reportedBy: req.auth.id };
    const bug = await Bug.findOneAndUpdate(
      filter,
      { title, description, priority, severity, status, assignedTo, steps },
      { new: true, runValidators: true }
    );
    if (!bug) return res.status(404).json({ message: "Bug not found" });
    res.json(await bug.populate("reportedBy", "name email"));
  } catch (error) {
    next(error);
  }
}

export async function deleteBug(req, res, next) {
  try {
    const filter = req.auth.role === "admin"
      ? { id: req.params.id }
      : { id: req.params.id, reportedBy: req.auth.id };
    const bug = await Bug.findOneAndDelete(filter);
    if (!bug) return res.status(404).json({ message: "Bug not found" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
