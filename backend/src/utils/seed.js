const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/team-task-manager');
  console.log('Connected to MongoDB');

  // Clean up
  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});
  console.log('Cleaned existing data');

  // Create users
  const adminUser = await User.create({
    name: 'Alex Chen',
    email: 'admin@demo.com',
    password: 'password123',
  });

  const member1 = await User.create({
    name: 'Jordan Smith',
    email: 'jordan@demo.com',
    password: 'password123',
  });

  const member2 = await User.create({
    name: 'Riley Park',
    email: 'riley@demo.com',
    password: 'password123',
  });

  console.log('✅ Created 3 users');

  // Create projects
  const project1 = await Project.create({
    name: 'Product Redesign 2025',
    description: 'Complete overhaul of the main product UI and UX',
    color: '#BFFF00',
    createdBy: adminUser._id,
    members: [
      { user: adminUser._id, role: 'admin' },
      { user: member1._id, role: 'member' },
      { user: member2._id, role: 'member' },
    ],
  });

  const project2 = await Project.create({
    name: 'Backend Infrastructure',
    description: 'Migrate services to microservices architecture',
    color: '#A78BFA',
    createdBy: adminUser._id,
    members: [
      { user: adminUser._id, role: 'admin' },
      { user: member1._id, role: 'member' },
    ],
  });

  console.log('✅ Created 2 projects');

  // Create tasks
  const taskData = [
    { title: 'Design new dashboard layout', description: 'Create wireframes and high-fidelity mockups', status: 'done', priority: 'high', assignedTo: member1._id, project: project1._id, dueDate: new Date('2025-01-15') },
    { title: 'Implement component library', description: 'Build reusable UI components in Storybook', status: 'in-progress', priority: 'high', assignedTo: member1._id, project: project1._id, dueDate: new Date('2025-02-01') },
    { title: 'User testing sessions', description: 'Conduct 5 user testing sessions for new designs', status: 'todo', priority: 'medium', assignedTo: member2._id, project: project1._id, dueDate: new Date('2025-02-15') },
    { title: 'Write design documentation', description: 'Document all design decisions and patterns', status: 'todo', priority: 'low', assignedTo: member2._id, project: project1._id },
    { title: 'Animation system', description: 'Create consistent motion design system', status: 'todo', priority: 'medium', assignedTo: member1._id, project: project1._id, dueDate: new Date('2025-01-10') },
    { title: 'Set up Kubernetes cluster', description: 'Configure K8s for production deployment', status: 'done', priority: 'urgent', assignedTo: member1._id, project: project2._id, dueDate: new Date('2025-01-20') },
    { title: 'Migrate auth service', description: 'Extract authentication into standalone service', status: 'in-progress', priority: 'high', assignedTo: adminUser._id, project: project2._id, dueDate: new Date('2025-02-10') },
    { title: 'API Gateway setup', description: 'Configure API gateway with rate limiting', status: 'todo', priority: 'medium', assignedTo: member1._id, project: project2._id, dueDate: new Date('2025-02-20') },
  ];

  for (const t of taskData) {
    await Task.create({ ...t, createdBy: adminUser._id });
  }

  console.log('✅ Created 8 tasks');
  console.log('\n🌱 Seed complete!');
  console.log('Login credentials:');
  console.log('  Admin: admin@demo.com / password123');
  console.log('  Member: jordan@demo.com / password123');
  console.log('  Member: riley@demo.com / password123');
  
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
