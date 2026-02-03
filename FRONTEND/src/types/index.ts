// User and Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  organizationId: string;
  createdAt: Date;
  lastLogin?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CONTRIBUTOR = 'contributor',
  VIEWER = 'viewer',
}

export interface AuthToken {
  access: string;
  refresh: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  plan: SubscriptionPlan;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionPlan {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  members: WorkspaceMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;
  joinedAt: Date;
}

export enum WorkspaceRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  owner: string;
  status: ProjectStatus;
  priority: Priority;
  startDate?: Date;
  endDate?: Date;
  members: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
}

export enum ProjectRole {
  LEAD = 'lead',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  workspaceId: string;
  assignee?: string;
  reporter: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  startDate?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  dependencies: string[];
  subtasks: SubTask[];
  attachments: Attachment[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

export enum TaskStatus {
  BACKLOG = 'backlog',
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  BLOCKED = 'blocked',
  DONE = 'done',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Workflow Types
export interface Workflow {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
  automations: Automation[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowState {
  id: string;
  name: string;
  color: string;
  category: StateCategory;
  isInitial: boolean;
  isFinal: boolean;
}

export enum StateCategory {
  TO_DO = 'to_do',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  BLOCKED = 'blocked',
}

export interface WorkflowTransition {
  id: string;
  fromStateId: string;
  toStateId: string;
  requiresApproval: boolean;
  allowedRoles: WorkspaceRole[];
}

export interface Automation {
  id: string;
  workflowId: string;
  trigger: AutomationTrigger;
  action: AutomationAction;
  conditions: AutomationCondition[];
  isActive: boolean;
}

export enum AutomationTrigger {
  STATE_CHANGE = 'state_change',
  ASSIGNMENT = 'assignment',
  DUE_DATE_APPROACHING = 'due_date_approaching',
  TASK_AGING = 'task_aging',
  DEPENDENCY_COMPLETED = 'dependency_completed',
}

export enum AutomationAction {
  NOTIFY = 'notify',
  REASSIGN = 'reassign',
  ESCALATE = 'escalate',
  AUTO_CLOSE = 'auto_close',
  ADD_LABEL = 'add_label',
}

export interface AutomationCondition {
  field: string;
  operator: string;
  value: any;
}

// Analytics Types
export interface ExecutionMetrics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  completionRate: number;
  avgCompletionTime: number;
  tasksAgingCount: number;
  overdueTasks: number;
}

export interface WorkloadMetrics {
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
  utilizationRate: number;
  byTeamMember: TeamMemberWorkload[];
}

export interface TeamMemberWorkload {
  userId: string;
  name: string;
  assignedTasks: number;
  completedTasks: number;
  capacity: number;
  utilizationRate: number;
}

export interface HealthMetrics {
  taskThroughput: DailyMetric[];
  stateDistribution: StateMetric[];
  priorityDistribution: PriorityMetric[];
  burndown: BurndownPoint[];
}

export interface DailyMetric {
  date: string;
  value: number;
}

export interface StateMetric {
  state: string;
  count: number;
  percentage: number;
}

export interface PriorityMetric {
  priority: Priority;
  count: number;
}

export interface BurndownPoint {
  date: string;
  remaining: number;
  ideal: number;
}

// Dashboard Types
export interface Dashboard {
  id: string;
  userId: string;
  workspaceId: string;
  name: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  createdAt: Date;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  config: Record<string, any>;
  position: { x: number; y: number; w: number; h: number };
}

export enum WidgetType {
  TASK_OVERVIEW = 'task_overview',
  WORKLOAD = 'workload',
  EXECUTION_HEALTH = 'execution_health',
  BURNDOWN = 'burndown',
  RECENT_ACTIVITY = 'recent_activity',
  TEAM_PERFORMANCE = 'team_performance',
  BOTTLENECK_ANALYSIS = 'bottleneck_analysis',
  DELAY_PREDICTOR = 'delay_predictor',
}

// Activity and Audit Types
export interface ActivityLog {
  id: string;
  userId: string;
  organizationId: string;
  workspaceId?: string;
  projectId?: string;
  taskId?: string;
  action: ActivityAction;
  entityType: string;
  entityId: string;
  previousValue?: Record<string, any>;
  newValue?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export enum ActivityAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  ASSIGN = 'assign',
  STATE_CHANGE = 'state_change',
  COMMENT = 'comment',
  SHARE = 'share',
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
