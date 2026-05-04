const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const project = await Project.create({
      name,
      description,
      color: color || '#6366f1',
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
    });

    await project.populate('members.user', 'name email avatar');
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id })
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort('-createdAt');

    // Add task counts
    const projectsWithCounts = await Promise.all(projects.map(async (p) => {
      const taskCount = await Task.countDocuments({ project: p._id });
      const completedCount = await Task.countDocuments({ project: p._id, status: 'done' });
      return {
        ...p.toJSON(),
        taskCount,
        completedCount,
      };
    }));

    res.json({ success: true, projects: projectsWithCounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only admins can update projects.' });
    }

    const { name, description, color, status } = req.body;
    Object.assign(project, { name, description, color, status });
    await project.save();
    await project.populate('members.user', 'name email avatar');

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only admins can delete projects.' });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only admins can add members.' });
    }

    const { email, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (project.isMember(user._id)) {
      return res.status(409).json({ success: false, message: 'User is already a member.' });
    }

    project.members.push({ user: user._id, role: role || 'member' });
    await project.save();
    await project.populate('members.user', 'name email avatar');

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only admins can remove members.' });
    }

    const { userId } = req.params;
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot remove yourself.' });
    }

    project.members = project.members.filter(m => m.user.toString() !== userId);
    await project.save();
    await project.populate('members.user', 'name email avatar');

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
