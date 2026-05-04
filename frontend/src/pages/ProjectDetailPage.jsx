import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { format, isPast } from 'date-fns'
import {
  ArrowLeft, Plus, Settings, Users, Trash2, X,
  Calendar, Flag, User, Tag, GripVertical,
  Circle, Timer, CheckCircle2, AlertCircle
} from 'lucide-react'
import api from '../utils/api'
import useAuthStore from '../store/authStore'

const STATUSES = [
  { key: 'todo', label: 'To Do', icon: Circle, color: '#ffffff30' },
  { key: 'in-progress', label: 'In Progress', icon: Timer, color: '#FCD34D' },
  { key: 'done', label: 'Done', icon: CheckCircle2, color: '#BFFF00' },
]

const PRIORITIES = ['low', 'medium', 'high', 'urgent']
const PRIORITY_COLORS = { low: '#38BDF8', medium: '#FCD34D', high: '#FF6B6B', urgent: '#EF4444' }

function TaskCard({ task, projectId, isAdmin }) {
  const queryClient = useQueryClient()
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done'

  const { mutate: updateStatus } = useMutation({
    mutationFn: (status) => api.patch(`/projects/${projectId}/tasks/${task._id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', projectId] }),
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  })

  const { mutate: deleteTask } = useMutation({
    mutationFn: () => api.delete(`/projects/${projectId}/tasks/${task._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      toast.success('Task deleted')
    },
  })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-ink-800 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all duration-200 group"
    >
      {/* Priority dot */}
      <div className="flex items-start gap-2 mb-3">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
          style={{ background: PRIORITY_COLORS[task.priority] || '#666' }}
        />
        <p className="text-sm text-white font-medium leading-snug flex-1">{task.title}</p>
        {isAdmin && (
          <button
            onClick={() => deleteTask()}
            className="opacity-0 group-hover:opacity-100 p-1 hover:text-coral text-white/30 transition-all rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-white/40 mb-3 line-clamp-2 ml-4">{task.description}</p>
      )}

      <div className="flex items-center justify-between ml-4">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className={`tag text-xs flex items-center gap-1 ${isOverdue ? 'text-coral bg-coral/10' : 'text-white/30 bg-white/5'}`}>
              <Calendar className="w-3 h-3" />
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
          <span className={`tag priority-${task.priority} text-xs`}>
            {task.priority}
          </span>
        </div>
        {task.assignedTo ? (
          <img
            src={task.assignedTo.avatar}
            alt={task.assignedTo.name}
            className="w-6 h-6 rounded-lg"
            title={task.assignedTo.name}
          />
        ) : (
          <div className="w-6 h-6 rounded-lg bg-ink-700 flex items-center justify-center">
            <User className="w-3 h-3 text-white/20" />
          </div>
        )}
      </div>

      {/* Status change buttons */}
      <div className="mt-3 ml-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {STATUSES.filter(s => s.key !== task.status).map(s => (
          <button
            key={s.key}
            onClick={() => updateStatus(s.key)}
            className="text-xs px-2 py-1 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all"
          >
            → {s.label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function CreateTaskModal({ projectId, members, onClose }) {
  const [form, setForm] = useState({
    title: '', description: '', assignedTo: '',
    priority: 'medium', dueDate: '', status: 'todo',
  })
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => api.post(`/projects/${projectId}/tasks`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      toast.success('Task created!')
      onClose()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create task'),
  })

  const handleSubmit = () => {
    if (!form.title.trim()) return toast.error('Title is required')
    mutate({ ...form, assignedTo: form.assignedTo || undefined })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold">New Task</h2>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="label block mb-2">Title *</label>
            <input
              className="input-field"
              placeholder="Task title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="label block mb-2">Description</label>
            <textarea
              className="input-field resize-none h-20"
              placeholder="Optional description..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label block mb-2">Priority</label>
              <select
                className="input-field"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p} style={{ background: '#1A1A26' }}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label block mb-2">Status</label>
              <select
                className="input-field"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                {STATUSES.map(s => (
                  <option key={s.key} value={s.key} style={{ background: '#1A1A26' }}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label block mb-2">Assign To</label>
              <select
                className="input-field"
                value={form.assignedTo}
                onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
              >
                <option value="" style={{ background: '#1A1A26' }}>Unassigned</option>
                {members.map(m => (
                  <option key={m.user._id} value={m.user._id} style={{ background: '#1A1A26' }}>
                    {m.user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label block mb-2">Due Date</label>
              <input
                type="date"
                className="input-field"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            className="btn-primary flex-1"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function AddMemberModal({ projectId, onClose }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`/projects/${projectId}/members`, { email, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      toast.success('Member added!')
      onClose()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add member'),
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="glass rounded-2xl p-7 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold">Add Member</h2>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label block mb-2">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="member@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label block mb-2">Role</label>
            <select
              className="input-field"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="member" style={{ background: '#1A1A26' }}>Member</option>
              <option value="admin" style={{ background: '#1A1A26' }}>Admin</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            className="btn-primary flex-1"
            disabled={!email || isPending}
            onClick={() => mutate()}
          >
            {isPending ? 'Adding...' : 'Add Member'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [activeTab, setActiveTab] = useState('board')

  const { data: projectData } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.get(`/projects/${id}`).then(r => r.data),
  })

  const { data: tasksData } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => api.get(`/projects/${id}/tasks`).then(r => r.data),
  })

  const project = projectData?.project
  const tasks = tasksData?.tasks || []
  const isAdmin = project?.members?.find(m => m.user._id === user?._id)?.role === 'admin'

  const tasksByStatus = STATUSES.reduce((acc, s) => {
    acc[s.key] = tasks.filter(t => t.status === s.key)
    return acc
  }, {})

  if (!project) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 w-64 skeleton rounded-xl" />
        <div className="grid grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Projects
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `${project.color}15` }}
            >
              <div className="w-4 h-4 rounded-full" style={{ background: project.color }} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">{project.name}</h1>
              {project.description && (
                <p className="text-white/40 text-sm mt-0.5">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={() => setShowAddMember(true)}
                  className="btn-ghost flex items-center gap-2 text-sm"
                >
                  <Users className="w-4 h-4" /> Add Member
                </button>
                <button
                  onClick={() => setShowCreateTask(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> New Task
                </button>
              </>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex -space-x-2">
            {project.members.map(m => (
              <img
                key={m.user._id}
                src={m.user.avatar}
                alt={m.user.name}
                title={`${m.user.name} (${m.role})`}
                className="w-8 h-8 rounded-xl border-2 border-ink-950"
              />
            ))}
          </div>
          <span className="text-xs text-white/30 ml-1">
            {project.members.length} member{project.members.length !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-white/20 font-mono ml-2">
            {tasks.length} tasks
          </span>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STATUSES.map((status) => {
          const Icon = status.icon
          const columnTasks = tasksByStatus[status.key] || []

          return (
            <div key={status.key} className="bg-ink-900/50 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-2.5 mb-4">
                <Icon className="w-4 h-4" style={{ color: status.color }} />
                <h3 className="font-medium text-sm text-white">{status.label}</h3>
                <span
                  className="ml-auto text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{ background: `${status.color}15`, color: status.color }}
                >
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[120px]">
                <AnimatePresence>
                  {columnTasks.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      projectId={id}
                      isAdmin={isAdmin}
                    />
                  ))}
                </AnimatePresence>

                {columnTasks.length === 0 && (
                  <div className="h-20 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center">
                    <p className="text-xs text-white/20">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {showCreateTask && (
          <CreateTaskModal
            projectId={id}
            members={project.members}
            onClose={() => setShowCreateTask(false)}
          />
        )}
        {showAddMember && (
          <AddMemberModal projectId={id} onClose={() => setShowAddMember(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
