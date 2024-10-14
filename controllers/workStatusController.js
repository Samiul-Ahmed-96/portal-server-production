import { ObjectId } from "mongodb";

// Get all work statuses
export const getAllWorkStatuses = async (req, res) => {
  const workStatusCollection = req.app.locals.db.collection("work-status-management");
  const cursor = workStatusCollection.find({});
  const workStatuses = await cursor.toArray();
  res.send({ status: true, data: workStatuses });
};

// Get a work status by ID
export const getWorkStatusById = async (req, res) => {
  const { id } = req.params;
  const workStatusCollection = req.app.locals.db.collection("work-status-management");
  const workStatus = await workStatusCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!workStatus) {
    return res
      .status(404)
      .send({ status: false, message: "Work status not found" });
  }
  res.send({ status: true, data: workStatus });
};

// Add a work status
export const addWorkStatus = async (req, res) => {
  const workStatusCollection = req.app.locals.db.collection("work-status-management");
  const newWorkStatus = req.body;
  const result = await workStatusCollection.insertOne(newWorkStatus);
  res.send({ status: true, data: result });
};

// Update a work status by ID
export const updateWorkStatus = async (req, res) => {
  const { id } = req.params;
  const updatedWorkStatus = req.body;
  const workStatusCollection = req.app.locals.db.collection("work-status-management");
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateTask = {
    $set: {
      task: updatedWorkStatus.task,
      date: updatedWorkStatus.date,
      hour: updatedWorkStatus.hour,
      workStatus: updatedWorkStatus.workStatus,
      description: updatedWorkStatus.description,
    },
  };
  const result = await workStatusCollection.updateOne(
    filter,
    updateTask,
    options
  );
  res.send({ status: true, data: result });
};

// Delete a work status by ID
export const deleteWorkStatus = async (req, res) => {
  const { id } = req.params;
  const workStatusCollection = req.app.locals.db.collection("work-status-management");
  const result = await workStatusCollection.deleteOne({
    _id: new ObjectId(id),
  });
  if (result.deletedCount > 0) {
    res.send({ status: true, message: "Work status deleted successfully" });
  } else {
    res.status(404).send({ status: false, message: "Work status not found" });
  }
};
