const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createProject, getProjects, getProject,
  updateProject, deleteProject, addMember, removeMember
} = require('../controllers/projectController');

const taskRouter = require('./tasks');

const router = express.Router();
router.use(protect);

router.use('/:projectId/tasks', taskRouter);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .patch(updateProject)
  .delete(deleteProject);

router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
