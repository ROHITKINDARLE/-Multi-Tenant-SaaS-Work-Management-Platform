// projects/ProjectsPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Plus,
  Users,
  Calendar,
  Zap,
  TrendingUp,
  Shield,
  AlertCircle,
  X,
} from 'lucide-react';
import { Card, Button, Badge } from '@components/ui/BaseComponents';
import { ProjectStatus, Priority } from '../../types';
import { useWorkspaceStore } from '@stores/workspaceStore';
import { createProject, updateProject } from '@/services/projectService';

export const ProjectsPage: React.FC = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<any>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    projects,
    currentWorkspace,
    workspaces,
    loadProjects,
    loadWorkspaces,
    setCurrentWorkspace,
  } = useWorkspaceStore();

  useEffect(() => {
    // Load workspaces first
    loadWorkspaces().then(() => {
      console.log('Workspaces loaded');
    });
  }, []);

  useEffect(() => {
    console.log('Workspaces:', workspaces, 'Current workspace:', currentWorkspace);
    // If no workspace is selected but workspaces exist, select the first one
    if (!currentWorkspace && workspaces.length > 0) {
      console.log('Setting first workspace:', workspaces[0]);
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces, currentWorkspace, setCurrentWorkspace]);

  useEffect(() => {
    if (currentWorkspace) {
      loadProjects(currentWorkspace.id);
    }
  }, [currentWorkspace]);

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    if (!currentWorkspace) {
      alert('No workspace selected. Please select a workspace first.');
      return;
    }

    try {
      setIsCreating(true);
      console.log('Creating project:', projectName, 'in workspace:', currentWorkspace.id);
      
      const result = await createProject({
        name: projectName,
        workspaceId: currentWorkspace.id,
        description: projectDescription,
      });
      
      console.log('Project created successfully:', result);

      // Reload projects
      await loadProjects(currentWorkspace.id);

      // Clear form and close modal
      setProjectName('');
      setProjectDescription('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProjectDetails) return;

    try {
      setIsSaving(true);
      await updateProject(selectedProjectDetails.id, {
        name: selectedProjectDetails.name,
        description: selectedProjectDetails.description,
      });

      // Reload projects
      if (currentWorkspace) {
        await loadProjects(currentWorkspace.id);
      }

      setIsEditMode(false);
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    const colors: Record<
      ProjectStatus,
      'primary' | 'success' | 'warning' | 'danger'
    > = {
      planning: 'primary',
      active: 'success',
      on_hold: 'warning',
      completed: 'success',
      archived: 'danger',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Priority) => {
    const colors: Record<
      Priority,
      'primary' | 'success' | 'warning' | 'danger'
    > = {
      low: 'success',
      medium: 'primary',
      high: 'warning',
      critical: 'danger',
    };
    return colors[priority];
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle size={16} />;
      case 'high':
        return <Zap size={16} />;
      case 'medium':
        return <TrendingUp size={16} />;
      default:
        return <Shield size={16} />;
    }
  };

  /* =======================
     DERIVED STATS
     ======================= */
  const total = projects.length;
  const active = projects.filter((p) => p.status === 'active').length;
  const planning = projects.filter((p) => p.status === 'planning').length;
  const avgProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce((sum, p) => sum + (p.progress ?? 0), 0) /
            projects.length
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slide-in-down">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-slate-400 mt-2">
              Manage your workspace projects and team collaboration
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-2xl font-bold text-white">{total}</div>
          <p className="text-xs text-slate-400">Total Projects</p>
        </Card>
        <Card>
          <div className="text-2xl font-bold text-emerald-400">{active}</div>
          <p className="text-xs text-slate-400">Active</p>
        </Card>
        <Card>
          <div className="text-2xl font-bold text-amber-400">{planning}</div>
          <p className="text-xs text-slate-400">Planning</p>
        </Card>
        <Card>
          <div className="text-2xl font-bold text-purple-400">
            {avgProgress}%
          </div>
          <p className="text-xs text-slate-400">Avg Progress</p>
        </Card>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="group glass-dark rounded-2xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Header */}
            <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-600 relative" />

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <div className="flex justify-between gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {project.name}
                  </h3>
                  <Badge
                    variant={getPriorityColor(project.priority)}
                    className="flex items-center gap-1"
                  >
                    {getPriorityIcon(project.priority)}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {project.description}
                </p>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Progress</span>
                  <span className="text-indigo-400">
                    {project.progress ?? 0}%
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${project.progress ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-700">
                <Users size={14} />
                <span>{project.membersCount ?? 0}</span>
                <Calendar size={14} />
                <Badge
                  variant={getStatusColor(project.status)}
                  className="ml-auto"
                >
                  {project.status}
                </Badge>
              </div>

              {hoveredProject === project.id && (
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  onClick={() => {
                    setSelectedProjectDetails(project);
                    setShowDetailsModal(true);
                  }}
                >
                  View Details
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Create New Project</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Project description (optional)"
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleCreateProject}
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Project'}
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Project Details Modal */}
      {showDetailsModal && selectedProjectDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Project Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Project Header */}
              <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg -mx-6 -mt-6 mb-6" />

              {/* Project Info */}
              <div>
                {isEditMode ? (
                  <>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={selectedProjectDetails.name}
                      onChange={(e) => setSelectedProjectDetails({
                        ...selectedProjectDetails,
                        name: e.target.value
                      })}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors mb-4"
                    />
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={selectedProjectDetails.description || ''}
                      onChange={(e) => setSelectedProjectDetails({
                        ...selectedProjectDetails,
                        description: e.target.value
                      })}
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-white mb-2">{selectedProjectDetails.name}</h3>
                    <p className="text-slate-400">{selectedProjectDetails.description || 'No description provided'}</p>
                  </>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  <Badge variant={getStatusColor(selectedProjectDetails.status || 'planning')}>
                    {selectedProjectDetails.status || 'planning'}
                  </Badge>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Priority</p>
                  <Badge variant={getPriorityColor(selectedProjectDetails.priority || 'medium')}>
                    {selectedProjectDetails.priority || 'medium'}
                  </Badge>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Progress</p>
                  <p className="text-xl font-bold text-white">{selectedProjectDetails.progress ?? 0}%</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Team Members</p>
                  <div className="flex items-center gap-2">
                    <Users size={20} className="text-indigo-400" />
                    <p className="text-xl font-bold text-white">{selectedProjectDetails.membersCount ?? 0}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Overall Progress</span>
                  <span className="text-indigo-400">{selectedProjectDetails.progress ?? 0}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${selectedProjectDetails.progress ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Dates */}
              {selectedProjectDetails.deadline && (
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar size={18} />
                    <span className="text-sm">Deadline: {new Date(selectedProjectDetails.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {selectedProjectDetails.created_at && (
                <div className="text-xs text-slate-500">
                  Created: {new Date(selectedProjectDetails.created_at).toLocaleString()}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-slate-700">
                {isEditMode ? (
                  <>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => {
                        setIsEditMode(false);
                        setShowDetailsModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleUpdateProject}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setShowDetailsModal(false)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => setIsEditMode(true)}
                    >
                      Edit Project
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
