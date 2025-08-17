// Local Database Management System
// Manages all data with localStorage persistence

// Types definitions
export interface User {
  id: string
  name: string
  email: string
  role?: string
  avatar?: string
  department?: string
  phone?: string
  bio?: string
  isActive: boolean
  createdAt: string
  lastActive: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  startDate: string
  endDate?: string
  budget?: number
  category: string
  tags: string[]
  teamMembers: string[] // User IDs
  managerId: string // User ID
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  projectId: string
  name: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string // User ID
  createdBy: string // User ID
  dueDate?: string
  completedAt?: string
  estimatedHours?: number
  actualHours?: number
  tags: string[]
  dependencies: string[] // Task IDs
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: 'task' | 'project' | 'team' | 'system' | 'deadline'
  title: string
  message: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  relatedId?: string // Project/Task ID
  actionUrl?: string
  createdAt: string
}

export interface FileAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedBy: string // User ID
  projectId?: string
  taskId?: string
  createdAt: string
}

// Database class
class LocalDatabase {
  private storageKeys = {
    users: 'montajko_users',
    projects: 'montajko_projects', 
    tasks: 'montajko_tasks',
    notifications: 'montajko_notifications',
    files: 'montajko_files',
    settings: 'montajko_settings',
    currentUser: 'montajko_current_user'
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  }

  private getStorageData<T>(key: string): T[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  }

  private setStorageData<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify(data))
  }

  // Initialize database with sample data
  initialize(): void {
    if (this.getStorageData(this.storageKeys.users).length === 0) {
      this.seedDatabase()
    }
  }

  private seedDatabase(): void {
    // Create sample users
    const users: User[] = [
      {
        id: 'user-1',
        name: 'أحمد محمد',
        email: 'ahmed@company.com',
        role: 'مدير عام',
        department: 'إدارة المشاريع',
        phone: '+966501234567',
        bio: 'مدير عام مختص في إدارة المشاريع التقنية',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      },
      {
        id: 'user-2', 
        name: 'فاطمة علي',
        email: 'fatima@company.com',
        role: 'مطورة أول',
        department: 'التطوير',
        phone: '+966502345678',
        bio: 'مطورة متخصصة في تطوير تطبيقات الويب',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      },
      {
        id: 'user-3',
        name: 'محمد حسن',
        email: 'mohammed@company.com', 
        role: 'مصمم أول',
        department: 'التصميم',
        phone: '+966503456789',
        bio: 'مصمم UI/UX مبدع ومختص في تصميم التطبيقات',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      }
    ]

    // Create sample projects
    const projects: Project[] = [
      {
        id: 'project-1',
        name: 'تطوير موقع الشركة الجديد',
        description: 'إنشاء موقع ويب حديث وتفاعلي للشركة مع لوحة إدارة متكاملة',
        status: 'active',
        priority: 'high',
        progress: 75,
        startDate: '2024-01-15',
        endDate: '2024-03-30',
        budget: 50000,
        category: 'تطوير ويب',
        tags: ['ويب', 'React', 'تصميم'],
        teamMembers: ['user-1', 'user-2', 'user-3'],
        managerId: 'user-1',
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'project-2',
        name: 'حملة التسويق الرقمي',
        description: 'استراتيجية تسويق شاملة عبر منصات التواصل الاجتماعي',
        status: 'active',
        priority: 'medium',
        progress: 60,
        startDate: '2024-02-01',
        endDate: '2024-04-15',
        budget: 25000,
        category: 'تسويق',
        tags: ['تسويق', 'سوشيال ميديا'],
        teamMembers: ['user-2', 'user-3'],
        managerId: 'user-2',
        createdAt: '2024-02-01T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      }
    ]

    // Create sample tasks  
    const tasks: Task[] = [
      {
        id: 'task-1',
        projectId: 'project-1',
        name: 'تصميم واجهة المستخدم الرئيسية',
        description: 'إنشاء تصميم تفاعلي للصفحة الرئيسية',
        status: 'in-progress',
        priority: 'high',
        assignedTo: 'user-3',
        createdBy: 'user-1',
        dueDate: '2024-02-15',
        estimatedHours: 40,
        actualHours: 30,
        tags: ['UI', 'تصميم'],
        dependencies: [],
        createdAt: '2024-01-20T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'task-2',
        projectId: 'project-1',
        name: 'تطوير API النهاية الخلفية',
        description: 'إنشاء APIs للتعامل مع البيانات',
        status: 'completed',
        priority: 'high',
        assignedTo: 'user-2',
        createdBy: 'user-1',
        dueDate: '2024-02-10',
        completedAt: '2024-02-09T00:00:00.000Z',
        estimatedHours: 60,
        actualHours: 55,
        tags: ['API', 'Backend'],
        dependencies: [],
        createdAt: '2024-01-18T00:00:00.000Z',
        updatedAt: '2024-02-09T00:00:00.000Z'
      }
    ]

    // Create sample notifications
    const notifications: Notification[] = [
      {
        id: 'notif-1',
        userId: 'user-1',
        type: 'task',
        title: 'مهمة جديدة تحتاج موافقة',
        message: 'تم إنشاء مهمة جديدة وتحتاج إلى مراجعتك',
        isRead: false,
        priority: 'medium',
        relatedId: 'task-1',
        actionUrl: '/tasks/task-1',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      },
      {
        id: 'notif-2', 
        userId: 'user-1',
        type: 'project',
        title: 'تحديث حالة المشروع',
        message: 'تم تحديث تقدم مشروع تطوير الموقع إلى 75%',
        isRead: false,
        priority: 'high',
        relatedId: 'project-1',
        actionUrl: '/projects/project-1',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
      }
    ]

    // Save to localStorage
    this.setStorageData(this.storageKeys.users, users)
    this.setStorageData(this.storageKeys.projects, projects)
    this.setStorageData(this.storageKeys.tasks, tasks)
    this.setStorageData(this.storageKeys.notifications, notifications)
    this.setStorageData(this.storageKeys.files, [])
    
    // Set current user
    localStorage.setItem(this.storageKeys.currentUser, JSON.stringify(users[0]))
  }

  // User methods
  getUsers(): User[] {
    return this.getStorageData<User>(this.storageKeys.users)
  }

  getUserById(id: string): User | null {
    const users = this.getUsers()
    return users.find(user => user.id === id) || null
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    const userData = localStorage.getItem(this.storageKeys.currentUser)
    return userData ? JSON.parse(userData) : null
  }

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastActive'>): User {
    const users = this.getUsers()
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }
    users.push(newUser)
    this.setStorageData(this.storageKeys.users, users)
    return newUser
  }

  updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): boolean {
    const users = this.getUsers()
    const index = users.findIndex(user => user.id === id)
    
    if (index === -1) return false
    
    users[index] = {
      ...users[index],
      ...userData,
      lastActive: new Date().toISOString()
    }
    this.setStorageData(this.storageKeys.users, users)
    return true
  }

  deleteUser(id: string): boolean {
    const users = this.getUsers()
    const index = users.findIndex(user => user.id === id)
    
    if (index === -1) return false
    
    users.splice(index, 1)
    this.setStorageData(this.storageKeys.users, users)
    return true
  }

  // Project methods
  getProjects(): Project[] {
    return this.getStorageData<Project>(this.storageKeys.projects)
  }

  getProjectById(id: string): Project | null {
    const projects = this.getProjects()
    return projects.find(project => project.id === id) || null
  }

  createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const projects = this.getProjects()
    const newProject: Project = {
      ...projectData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    projects.push(newProject)
    this.setStorageData(this.storageKeys.projects, projects)
    
    // Create notification for team members
    this.createNotificationForUsers(newProject.teamMembers, {
      type: 'project',
      title: 'مشروع جديد',
      message: `تم إنشاء مشروع جديد: ${newProject.name}`,
      priority: 'medium',
      relatedId: newProject.id,
      actionUrl: `/projects/${newProject.id}`,
      isRead: false
    })
    
    return newProject
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const projects = this.getProjects()
    const index = projects.findIndex(project => project.id === id)
    
    if (index === -1) return null
    
    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.setStorageData(this.storageKeys.projects, projects)
    return projects[index]
  }

  deleteProject(id: string): boolean {
    const projects = this.getProjects()
    const filteredProjects = projects.filter(project => project.id !== id)
    
    if (filteredProjects.length === projects.length) return false
    
    this.setStorageData(this.storageKeys.projects, filteredProjects)
    
    // Also delete related tasks
    const tasks = this.getTasks()
    const filteredTasks = tasks.filter(task => task.projectId !== id)
    this.setStorageData(this.storageKeys.tasks, filteredTasks)
    
    return true
  }

  // Task methods
  getTasks(): Task[] {
    return this.getStorageData<Task>(this.storageKeys.tasks)
  }

  getTasksByProject(projectId: string): Task[] {
    const tasks = this.getTasks()
    return tasks.filter(task => task.projectId === projectId)
  }

  getTasksByUser(userId: string): Task[] {
    const tasks = this.getTasks()
    return tasks.filter(task => task.assignedTo === userId || task.createdBy === userId)
  }

  getProjectsByUser(userId: string): Project[] {
    const projects = this.getProjects()
    return projects.filter(project => 
      project.managerId === userId || project.teamMembers.includes(userId)
    )
  }

  getTaskById(id: string): Task | null {
    const tasks = this.getTasks()
    return tasks.find(task => task.id === id) || null
  }

  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const tasks = this.getTasks()
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    tasks.push(newTask)
    this.setStorageData(this.storageKeys.tasks, tasks)
    
    // Create notification for assigned user
    if (newTask.assignedTo) {
      this.createNotificationForUsers([newTask.assignedTo], {
        type: 'task',
        title: 'مهمة جديدة',
        message: `تم تعيين مهمة جديدة لك: ${newTask.name}`,
        priority: newTask.priority === 'urgent' ? 'high' : 'medium',
        relatedId: newTask.id,
        actionUrl: `/tasks/${newTask.id}`,
        isRead: false
      })
    }
    
    return newTask
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const tasks = this.getTasks()
    const index = tasks.findIndex(task => task.id === id)
    
    if (index === -1) return null
    
    const oldTask = tasks[index]
    tasks[index] = {
      ...oldTask,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    // If task status changed to completed, set completedAt
    if (updates.status === 'completed' && oldTask.status !== 'completed') {
      tasks[index].completedAt = new Date().toISOString()
    }
    
    this.setStorageData(this.storageKeys.tasks, tasks)
    return tasks[index]
  }

  // Notification methods
  getNotifications(): Notification[] {
    return this.getStorageData<Notification>(this.storageKeys.notifications)
  }

  getUserNotifications(userId: string): Notification[] {
    const notifications = this.getNotifications()
    return notifications.filter(notif => notif.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  markNotificationAsRead(id: string): boolean {
    const notifications = this.getNotifications()
    const index = notifications.findIndex(notif => notif.id === id)
    
    if (index === -1) return false
    
    notifications[index].isRead = true
    this.setStorageData(this.storageKeys.notifications, notifications)
    return true
  }

  deleteNotification(id: string): boolean {
    const notifications = this.getNotifications()
    const index = notifications.findIndex(notif => notif.id === id)
    
    if (index === -1) return false
    
    notifications.splice(index, 1)
    this.setStorageData(this.storageKeys.notifications, notifications)
    return true
  }

  createNotificationForUsers(userIds: string[], notifData: Omit<Notification, 'id' | 'userId' | 'createdAt'>): void {
    const notifications = this.getNotifications()
    
    userIds.forEach(userId => {
      const newNotification: Notification = {
        ...notifData,
        id: this.generateId(),
        userId,
        createdAt: new Date().toISOString()
      }
      notifications.push(newNotification)
    })
    
    this.setStorageData(this.storageKeys.notifications, notifications)
  }

  // Analytics methods
  getProjectStats(): {
    total: number
    active: number
    completed: number
    overdue: number
  } {
    const projects = this.getProjects()
    const now = new Date()
    
    return {
      total: projects.length,
      active: projects.filter(p => p.status === 'active').length,
      completed: projects.filter(p => p.status === 'completed').length,
      overdue: projects.filter(p => 
        p.endDate && new Date(p.endDate) < now && p.status !== 'completed'
      ).length
    }
  }

  getTaskStats(): {
    total: number
    completed: number
    inProgress: number
    overdue: number
  } {
    const tasks = this.getTasks()
    const now = new Date()
    
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      overdue: tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
      ).length
    }
  }
}

// Export singleton instance
export const database = new LocalDatabase()

// Initialize on first import
if (typeof window !== 'undefined') {
  database.initialize()
}