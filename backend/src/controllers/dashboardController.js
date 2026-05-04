const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's projects
    const userProjects = await Project.find({ 'members.user': userId });
    const projectIds = userProjects.map(p => p._id);

    // All tasks in user's projects (admin sees all, member sees assigned)
    const isGlobalAdmin = userProjects.some(p => p.isAdmin(userId));
    
    let taskFilter = { project: { $in: projectIds } };
    
    // For dashboard, show tasks relevant to user
    const myTaskFilter = { project: { $in: projectIds }, assignedTo: userId };

    const [
      totalTasks,
      todoTasks,
      inProgressTasks,
      doneTasks,
      myTasks,
      overdueTasks,
    ] = await Promise.all([
      Task.countDocuments(taskFilter),
      Task.countDocuments({ ...taskFilter, status: 'todo' }),
      Task.countDocuments({ ...taskFilter, status: 'in-progress' }),
      Task.countDocuments({ ...taskFilter, status: 'done' }),
      Task.countDocuments(myTaskFilter),
      Task.countDocuments({
        ...taskFilter,
        status: { $ne: 'done' },
        dueDate: { $lt: new Date() },
      }),
    ]);

    // Tasks per user (for admins)
    const tasksPerUser = await Task.aggregate([
      { $match: taskFilter },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmpty: true } },
      {
        $project: {
          _id: 1,
          count: 1,
          name: { $ifNull: ['$user.name', 'Unassigned'] },
          avatar: '$user.avatar',
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Recent tasks
    const recentTasks = await Task.find(taskFilter)
      .populate('assignedTo', 'name avatar')
      .populate('project', 'name color')
      .sort('-createdAt')
      .limit(5);

    // Priority breakdown
    const priorityBreakdown = await Task.aggregate([
      { $match: taskFilter },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalProjects: userProjects.length,
        totalTasks,
        todoTasks,
        inProgressTasks,
        doneTasks,
        myTasks,
        overdueTasks,
      },
      tasksPerUser,
      recentTasks,
      priorityBreakdown,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
