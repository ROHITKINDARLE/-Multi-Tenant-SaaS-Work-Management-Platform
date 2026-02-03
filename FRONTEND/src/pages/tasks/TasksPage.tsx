// tasks/TasksPage.tsx
import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import { Button, Badge } from '@components/ui/BaseComponents';
import { Plus, X } from 'lucide-react';
import { useWorkspaceStore } from '@stores/workspaceStore';
import { getWorkflowStates, getWorkflowTransitions } from '@services/workflowService';
import { Priority } from '../../types';

export const TasksPage: React.FC = () => {
  const {
    tasks,
      projects,
    selectedProject,
      currentWorkspace,
      workspaces,
      loadWorkspaces,
      loadProjects,
    loadTasks,
      setSelectedProject,
      setCurrentWorkspace,
    updateTaskWorkflowState,
    addTask,
  } = useWorkspaceStore();

  const [workflowStates, setWorkflowStates] = useState<any[]>([]);
  const [validTransitions, setValidTransitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>(Priority.MEDIUM);
  const [isCreating, setIsCreating] = useState(false);

  // Load workflow states and transitions
  useEffect(() => {
    const loadWorkflow = async () => {
      try {
        console.log('Loading workflow states and transitions...');
        const states = await getWorkflowStates();
        const transitions = await getWorkflowTransitions();
        console.log('Loaded states:', states);
        console.log('Loaded transitions:', transitions);
        setWorkflowStates(states || []);
        setValidTransitions(transitions || []);
      } catch (err) {
        console.error('Error loading workflow:', err);
      } finally {
        setLoading(false);
      }
    };
    loadWorkflow();
  }, []);

  // Load workspaces and select first if none
  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  useEffect(() => {
    if (!currentWorkspace && workspaces.length > 0) {
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces, currentWorkspace, setCurrentWorkspace]);

  // Load projects from current workspace
  useEffect(() => {
    if (currentWorkspace) {
      loadProjects(currentWorkspace.id);
    }
  }, [currentWorkspace, loadProjects]);

  // Auto-select first project if none selected
  useEffect(() => {
    if (!selectedProject && projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject, setSelectedProject]);

  // Load tasks for selected project
  useEffect(() => {
    if (selectedProject) {
      loadTasks(selectedProject.id);
    }
  }, [selectedProject, loadTasks]);

  const handleCreateTask = async () => {
    if (!taskTitle.trim() || !selectedProject) return;

    setIsCreating(true);
    try {
      const todoState = workflowStates.find(s => s.name === 'Todo');
      await addTask({
        title: taskTitle,
        description: taskDescription,
        projectId: selectedProject.id,
        status: todoState?.id || workflowStates[0]?.id,
        priority: taskPriority as Priority,
      });

      // Reset form
      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority(Priority.MEDIUM);
      setShowCreateModal(false);

      // Reload tasks
      loadTasks(selectedProject.id);
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const canTransition = (fromState: string, toState: string) => {
    if (!validTransitions || validTransitions.length === 0) return true;
    return validTransitions.some(
      (t) => t.from_state === fromState && t.to_state === toState
    );
  };

  const getTaskStateId = (status: string | null | undefined) => {
    if (!status) {
      return workflowStates[0]?.id || '';
    }
    const directMatch = workflowStates.find((s) => s.id === status);
    if (directMatch) return directMatch.id;

    const normalized = status.replace(/_/g, ' ').toLowerCase();
    const nameMatch = workflowStates.find(
      (s) => s.name.toLowerCase() === normalized
    );
    return nameMatch?.id || status;
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    // Check if transition is valid
    if (!canTransition(source.droppableId, destination.droppableId)) {
      console.warn(`Cannot transition from ${source.droppableId} to ${destination.droppableId}`);
      return;
    }

    // Update task status
    try {
      await updateTaskWorkflowState(draggableId, destination.droppableId);
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const getStateColor = (stateName: string) => {
    const colorMap: Record<string, string> = {
      'Todo': 'bg-slate-700',
      'In Progress': 'bg-blue-700',
      'Done': 'bg-green-700',
      'In Review': 'bg-purple-700',
    };
    return colorMap[stateName] || 'bg-slate-700';
  };

  if (loading) {
    return (
      <div className="text-slate-400">
        Loading workflow states…
      </div>
    );
  }

  if (workflowStates.length === 0) {
    return (
      <div className="text-slate-400">
        No workflow states configured. Please set up workflow states first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Tasks</h1>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedProject?.id || ''}
            onChange={(e) => {
              const project = projects.find(p => p.id === e.target.value);
              setSelectedProject(project || null);
            }}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
          >
            <option value="" disabled>Select Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <Button 
            onClick={() => setShowCreateModal(true)}
            disabled={!selectedProject}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            New Task
          </Button>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Create New Task</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Priority
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
                >
                  <option value={Priority.LOW}>Low</option>
                  <option value={Priority.MEDIUM}>Medium</option>
                  <option value={Priority.HIGH}>High</option>
                  <option value={Priority.CRITICAL}>Critical</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateTask}
                  disabled={!taskTitle.trim() || isCreating}
                  className="flex-1"
                >
                  {isCreating ? 'Creating...' : 'Create Task'}
                </Button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {workflowStates.map((state) => (
            <Droppable droppableId={state.id} key={state.id}>
              {(provided: any, snapshot: any) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`w-96 flex-shrink-0 rounded-lg p-4 ${
                    snapshot.isDraggingOver ? 'bg-slate-700/50' : 'bg-slate-800/30'
                  }`}
                >
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${getStateColor(state.name)}`}
                    />
                    {state.name}
                    <span className="ml-auto text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                      {tasks.filter((t) => getTaskStateId(t.status) === state.id).length}
                    </span>
                  </h3>

                  {tasks
                    .filter((t) => getTaskStateId(t.status) === state.id)
                    .map((task, idx) => (
                      <Draggable
                        draggableId={task.id}
                        index={idx}
                        key={task.id}
                      >
                        {(provided: any, snapshot: any) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 mb-3 bg-slate-700 rounded-lg border border-slate-600 hover:border-indigo-500 transition-all ${
                              snapshot.isDragging ? 'shadow-lg bg-slate-600' : ''
                            }`}
                          >
                            <p className="text-white text-sm font-medium mb-2">
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-slate-400 text-xs mb-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <Badge variant="primary">
                                {task.priority || 'Medium'}
                              </Badge>
                              {task.assignee && (
                                <span className="text-xs text-slate-400">
                                  {task.assignee}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {tasks.filter((t) => getTaskStateId(t.status) === state.id).length === 0 && (
                    <div className="text-slate-500 text-sm text-center py-8">
                      No tasks
                    </div>
                  )}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
