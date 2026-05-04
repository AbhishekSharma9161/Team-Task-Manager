import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { format, isPast } from 'date-fns'
import { ArrowLeft, Calendar, Flag, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import api from '../utils/api'
import useAuthStore from '../store/authStore'

const PRIORITY_COLORS = { low: '#38BDF8', medium: '#FCD34D', high: '#FF6B6B', urgent: '#EF4444' }

export default function TaskDetailPage() {
  const { projectId, taskId } = useParams()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => api.get(`/projects/${projectId}/tasks/${taskId}`).then(r => r.data),
  })

  const { mutate: updateStatus } = useMutation({
    mutationFn: (status) => api.patch(`/projects/${projectId}/tasks/${taskId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      toast.success('Status updated')
    },
  })

  const task = data?.task
  if (isLoading) return <div className="p-8"><div className="h-64 skeleton rounded-2xl" /></div>
  if (!task) return <div className="p-8 text-white/40">Task not found</div>

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done'

  return (
    <div className="p-8 max-w-2xl">
      <Link
        to={`/projects/${projectId}`}
        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Project
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-7">
        <div className="flex items-start gap-3 mb-6">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
            style={{ background: PRIORITY_COLORS[task.priority] }}
          />
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-white">{task.title}</h1>
            {task.description && (
              <p className="text-white/50 mt-2 text-sm leading-relaxed">{task.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-ink-800 rounded-xl p-4">
            <p className="label mb-2">Status</p>
            <div className="flex gap-2 flex-wrap">
              {['todo', 'in-progress', 'done'].map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={`tag text-xs px-3 py-1 rounded-lg border transition-all ${
                    task.status === s
                      ? s === 'done' ? 'bg-acid/20 text-acid border-acid/30' :
                        s === 'in-progress' ? 'bg-amber/20 text-amber border-amber/30' :
                        'bg-white/10 text-white border-white/20'
                      : 'border-white/10 text-white/30 hover:text-white'
                  }`}
                >
                  {s === 'todo' ? 'To Do' : s === 'in-progress' ? 'In Progress' : 'Done'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-ink-800 rounded-xl p-4">
            <p className="label mb-2">Priority</p>
            <span
              className="tag text-xs px-3 py-1 rounded-lg capitalize"
              style={{ background: `${PRIORITY_COLORS[task.priority]}15`, color: PRIORITY_COLORS[task.priority] }}
            >
              {task.priority}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {task.assignedTo && (
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-white/30" />
              <div className="flex items-center gap-2">
                <img src={task.assignedTo.avatar} alt={task.assignedTo.name} className="w-6 h-6 rounded-lg" />
                <span className="text-sm text-white">{task.assignedTo.name}</span>
              </div>
            </div>
          )}

          {task.dueDate && (
            <div className={`flex items-center gap-3 ${isOverdue ? 'text-coral' : 'text-white/50'}`}>
              {isOverdue ? <AlertCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
              <span className="text-sm">
                {isOverdue ? 'Overdue — ' : 'Due '}
                {format(new Date(task.dueDate), 'MMMM d, yyyy')}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 text-white/30">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm">Created by {task.createdBy?.name}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
