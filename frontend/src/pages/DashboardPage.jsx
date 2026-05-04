import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { format, isPast } from 'date-fns'
import { 
  CheckCircle2, Clock, AlertTriangle, FolderOpen, 
  TrendingUp, Users, Zap, ArrowUpRight
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'
import api from '../utils/api'
import useAuthStore from '../store/authStore'

const PRIORITY_COLORS = {
  low: '#38BDF8',
  medium: '#FCD34D',
  high: '#FF6B6B',
  urgent: '#EF4444',
}

const STATUS_COLORS = ['#32324A', '#FCD34D', '#BFFF00']

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-5 relative overflow-hidden group"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{ background: `radial-gradient(ellipse at top left, ${color}08, transparent 60%)` }}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="label mb-2">{label}</p>
          <p className="font-display text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </motion.div>
  )
}

function TaskRow({ task }) {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done'
  
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
        task.status === 'done' ? 'bg-acid' :
        task.status === 'in-progress' ? 'bg-amber' : 'bg-white/20'
      }`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{task.title}</p>
        <p className="text-xs text-white/30 mt-0.5">
          {task.project?.name} 
          {task.dueDate && (
            <span className={isOverdue ? 'text-coral ml-2' : 'ml-2'}>
              {isOverdue ? '⚠ ' : ''}
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
        </p>
      </div>
      {task.assignedTo && (
        <img
          src={task.assignedTo.avatar}
          alt={task.assignedTo.name}
          className="w-6 h-6 rounded-lg flex-shrink-0"
          title={task.assignedTo.name}
        />
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then(r => r.data),
  })

  const stats = data?.stats || {}
  const statusChartData = [
    { name: 'To Do', value: stats.todoTasks || 0 },
    { name: 'In Progress', value: stats.inProgressTasks || 0 },
    { name: 'Done', value: stats.doneTasks || 0 },
  ]

  const priorityData = (data?.priorityBreakdown || []).map(p => ({
    name: p._id,
    value: p.count,
    fill: PRIORITY_COLORS[p._id] || '#666',
  }))

  const userTaskData = (data?.tasksPerUser || []).slice(0, 6).map(u => ({
    name: u.name?.split(' ')[0] || 'Unknown',
    tasks: u.count,
  }))

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 skeleton rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="label mb-1">Overview</p>
        <h1 className="font-display text-3xl font-bold">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          <span className="text-acid">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-white/40 mt-1">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderOpen} label="Projects" value={stats.totalProjects || 0} color="#A78BFA" delay={0.05} />
        <StatCard icon={Zap} label="Total Tasks" value={stats.totalTasks || 0} color="#BFFF00" delay={0.1} />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.doneTasks || 0} color="#BFFF00" delay={0.15} />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdueTasks || 0} color="#FF6B6B" delay={0.2} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title text-base">Task Status</h2>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {statusChartData.map((_, index) => (
                  <Cell key={index} fill={STATUS_COLORS[index]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1A1A26',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  fontFamily: 'Cabinet Grotesk',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-2">
            {statusChartData.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[i] }} />
                <span className="text-xs text-white/50">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tasks per User */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title text-base">Tasks per Member</h2>
            <Users className="w-4 h-4 text-white/30" />
          </div>
          {userTaskData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={userTaskData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Cabinet Grotesk' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Cabinet Grotesk' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#1A1A26',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    fontFamily: 'Cabinet Grotesk',
                  }}
                />
                <Bar dataKey="tasks" fill="#BFFF00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-white/20 text-sm">
              No task data yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title text-base">Recent Tasks</h2>
            <Clock className="w-4 h-4 text-white/30" />
          </div>
          {data?.recentTasks?.length > 0 ? (
            <div>
              {data.recentTasks.map(task => (
                <TaskRow key={task._id} task={task} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/20 text-sm">
              No tasks yet
            </div>
          )}
        </motion.div>

        {/* Priority Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title text-base">Priority Breakdown</h2>
            <TrendingUp className="w-4 h-4 text-white/30" />
          </div>
          {priorityData.length > 0 ? (
            <div className="space-y-4">
              {priorityData.map(item => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm capitalize" style={{ color: item.fill }}>{item.name}</span>
                    <span className="text-sm text-white/50 font-mono">{item.value}</span>
                  </div>
                  <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / (stats.totalTasks || 1)) * 100}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: item.fill }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/20 text-sm">
              No priority data yet
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
