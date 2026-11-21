export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  profileImage: string;
  department?: string;
  studentId?: string;
  phone?: string;
}

export type ResourceCategory =
  | 'Laptops'
  | 'Projectors'
  | 'Cameras'
  | 'Lab Equip.'
  | 'Meeting Rooms'
  | 'Others';

export interface Resource {
  id: string;
  name: string;
  description: string;
  category: ResourceCategory;
  image: string;
  specifications: string[];
  totalQuantity: number;
  availableQuantity: number;
  location: string;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole?: UserRole;
  resourceId: string;
  resourceName: string;
  resourceImage: string;
  resourceCategory: ResourceCategory;
  bookingDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: BookingStatus;
  issueDate?: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  isOverdue?: boolean;
  createdAt: string;
}

export type NotificationType = 'approved' | 'rejected' | 'reminder' | 'overdue' | 'system' | 'new_request';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  bookingId?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalResources: number;
  totalBookings: number;
  pendingRequests: number;
  overdueReturns: number;
  availableResources: number;
}
