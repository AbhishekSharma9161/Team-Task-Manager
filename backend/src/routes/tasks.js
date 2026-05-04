const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createTask, getTasks, getTask, updateTask, deleteTask
} = require('../controllers/taskController');

const router = express.Router({ mergeParams: true });
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:taskId')
  .get(getTask)
  .patch(updateTask)
  .delete(deleteTask);

module.exports = router;
