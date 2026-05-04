import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Plus, FolderKanban, ArrowRight, Users, CheckCircle2, X, Palette } from 'lucide-react'
import api from '../utils/api'

const PROJECT_COLORS = [
  '#BFFF00', '#38BDF8', '#A78BFA', '#FF6B6B',
  '#FCD34D', '#34D399', '#F97316', '#EC4899',
]

function CreateProjectModal({ onClose }) {
  const [form, setForm] = useState({ name: '', description: '', color: '#BFFF00' })
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => api.post('/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created!')
      onClose()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create project'),
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass rounded-2xl p-7 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold">New Project</h2>
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="label block mb-2">Project Name</label>
            <input
              className="input-field"
              placeholder="e.g., Product Redesign"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="label block mb-2">Description</label>
            <textarea
              className="input-field resize-none h-24"
              placeholder="What's this project about?"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="label block mb-2">
              <Palette className="w-3 h-3 inline mr-1" />
              Color
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {PROJECT_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setForm(f => ({ ...f, color }))}
                  className="w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{
                    background: color,
                    outline: form.color === color ? `2px solid ${color}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            className="btn-primary flex-1"
            disabled={!form.name.trim() || isPending}
            onClick={() => mutate(form)}
          >
            {isPending ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProjectCard({ project, index }) {
  const progress = project.taskCount > 0
    ? Math.round((project.completedCount / project.taskCount) * 100)
    : 0

  const userRole = project.members.find(m => m.user._id === project.createdBy?._id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/projects/${project._id}`}
        className="block glass rounded-2xl p-5 hover:border-white/10 transition-all duration-200 group"
        style={{ borderColor: `${project.color}20` }}
      >
        {/* Top */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${project.color}15` }}
          >
            <FolderKanban className="w-5 h-5" style={{ color: project.color }} />
          </div>
          <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-200" />
        </div>

        <h3 className="font-display font-semibold text-white text-lg mb-1 truncate">
          {project.name}
        </h3>
        {project.description && (
          <p className="text-sm text-white/40 mb-4 line-clamp-2">{project.description}</p>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-white/30">Progress</span>
            <span className="font-mono" style={{ color: project.color }}>{progress}%</span>
          </div>
          <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: project.color }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="font-mono">{project.completedCount}/{project.taskCount} tasks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {project.members.slice(0, 3).map(m => (
                <img
                  key={m.user._id}
                  src={m.user.avatar}
                  alt={m.user.name}
                  className="w-6 h-6 rounded-lg border-2 border-ink-900 object-cover"
                  title={m.user.name}
                />
              ))}
              {project.members.length > 3 && (
                <div className="w-6 h-6 rounded-lg border-2 border-ink-900 bg-ink-700 flex items-center justify-center">
                  <span className="text-xs text-white/50">+{project.members.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [showCreate, setShowCreate] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
  })

  const projects = data?.projects || []

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="label mb-1">Workspace</p>
          <h1 className="font-display text-3xl font-bold">Projects</h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 skeleton rounded-2xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="w-16 h-16 bg-ink-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderKanban className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="font-display text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-white/40 mb-6">Create your first project to get started</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Project
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  )
}
