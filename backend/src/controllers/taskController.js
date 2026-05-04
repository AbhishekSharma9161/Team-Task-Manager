const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, status, tags } = req.body;
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Only admins can create tasks
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only admins can create tasks.' });
    }

    const task = await Task.create({
      title, description, assignedTo, priority, dueDate, status, tags,
      project: projectId,
      createdBy: req.user._id,
    });

    await task.populate([
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
    ]);

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assignedTo } = req.query;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const filter = { project: projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Members only see their assigned tasks
    if (!project.isAdmin(req.user._id)) {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort('-createdAt');

    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name color');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    const project = await Project.findById(task.project);
    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    const project = await Project.findById(task.project);
    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const isAdmin = project.isAdmin(req.user._id);
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ success: false, message: 'You can only update tasks assigned to you.' });
    }

    // Members can only update status
    if (!isAdmin && isAssignee) {
      const { status } = req.body;
      task.status = status || task.status;
    } else {
      const { title, description, assignedTo, priority, dueDate, status, tags } = req.body;
      Object.assign(task, { title, description, assignedTo, priority, dueDate, status, tags });
    }

    await task.save();
    await task.populate([
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
    ]);

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    const project = await Project.findById(task.project);
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only admins can delete tasks.' });
    }

    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
