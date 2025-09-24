import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Plus, Edit, Trash2, X, Calendar, User, Search, Filter } from 'lucide-react'

const Projects = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    endDate: '',
    priority: 'medium',
    status: 'pending'
  })

  useEffect(() => {
    fetchProjects()
    if (user?.role !== 'user') {
      fetchUsers()
    }
  }, [user])

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects')
      setProjects(response.data.projects)
      setFilteredProjects(response.data.projects)
    } catch (error) {
      toast.error('Error fetching projects')
    } finally {
      setLoading(false)
    }
  }

  // Filter projects based on search and filters
  useEffect(() => {
    let filtered = projects

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter(project => project.priority === priorityFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, statusFilter, priorityFilter])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users')
      // Filter out inactive users, admins, and current user
      setUsers(response.data.users.filter(u => 
        u.isActive && 
        u.role !== 'admin' && 
        u._id !== user.id
      ))
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const submitData = { ...formData }
      if (submitData.endDate) {
        submitData.endDate = new Date(submitData.endDate).toISOString()
      }

      if (editingProject) {
        // Update project
        await axios.put(`/api/projects/${editingProject._id}`, submitData)
        toast.success('Project updated successfully')
      } else {
        // Create project
        await axios.post('/api/projects', submitData)
        toast.success('Project created successfully')
      }
      
      fetchProjects()
      closeModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      assignedTo: project.assignedTo._id,
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      priority: project.priority,
      status: project.status
    })
    setShowModal(true)
  }

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${projectId}`)
        toast.success('Project deleted successfully')
        fetchProjects()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete project')
      }
    }
  }

  const handleStatusUpdate = async (projectId, newStatus) => {
    try {
      await axios.put(`/api/projects/${projectId}`, { status: newStatus })
      toast.success('Project status updated')
      fetchProjects()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProject(null)
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      endDate: '',
      priority: 'medium',
      status: 'pending'
    })
  }

  const canCreateProject = user?.role === 'admin'
  const canEditProject = (project) => {
    if (user?.role === 'admin') return true
    if (user?.role === 'manager') return true
    if (user?.role === 'user') return project.assignedTo._id === user.id
    return false
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge-pending'
      case 'in-progress': return 'badge-in-progress'
      case 'completed': return 'badge-completed'
      case 'cancelled': return 'badge-cancelled'
      default: return 'badge-pending'
    }
  }

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high': return 'badge-cancelled'
      case 'medium': return 'badge-pending'
      case 'low': return 'badge-completed'
      default: return 'badge-pending'
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Project Management
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.role === 'admin' 
                ? 'Create and assign projects to managers' 
                : user?.role === 'manager'
                ? 'Your assigned projects - break them into tasks for your team'
                : 'Your assigned projects'
              }
            </p>
          </div>
          
          {canCreateProject && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              <Plus size={16} />
              New Project
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search projects..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Plus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">
              {projects.length === 0 
                ? `No projects found. ${canCreateProject ? 'Create your first project to get started!' : ''}`
                : 'No projects match your current filters.'
              }
            </p>
            {projects.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                  setPriorityFilter('')
                }}
                className="btn btn-secondary mt-4"
              >
                <Filter size={16} />
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {project.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {project.description.length > 60 
                            ? `${project.description.substring(0, 60)}...` 
                            : project.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.assignedTo.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {project.assignedTo.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user?.role === 'user' && project.assignedTo._id === user.id ? (
                        <select
                          value={project.status}
                          onChange={(e) => handleStatusUpdate(project._id, e.target.value)}
                          className="form-select text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                          {project.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getPriorityBadgeClass(project.priority)}`}>
                        {project.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-2" />
                        {project.endDate 
                          ? new Date(project.endDate).toLocaleDateString()
                          : 'No due date'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {canEditProject(project) && (
                          <button
                            onClick={() => handleEdit(project)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {(user?.role === 'admin' || user?.role === 'manager') && (
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                  rows="3"
                  required
                />
              </div>

              {(user?.role === 'admin' || user?.role === 'manager') && (
                <div>
                  <label className="form-label">Assign To</label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="">Select a user</option>
                    {users.map(userItem => (
                      <option key={userItem._id} value={userItem._id}>
                        {userItem.name} ({userItem.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="form-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Due Date (Optional)</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects