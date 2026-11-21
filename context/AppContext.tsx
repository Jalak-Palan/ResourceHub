'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Resource,
  Booking,
  NotificationItem,
  UserRole,
  ResourceCategory,
  DashboardStats,
  BookingStatus,
} from '@/lib/types';
import {
  INITIAL_USERS,
  INITIAL_RESOURCES,
  INITIAL_BOOKINGS,
  INITIAL_NOTIFICATIONS,
} from '@/lib/mock-data';
import { generateBookingId } from '@/lib/utils';

interface AppContextType {
  currentUser: User;
  users: User[];
  resources: Resource[];
  bookings: Booking[];
  notifications: NotificationItem[];
  selectedCategory: ResourceCategory | 'All';
  searchQuery: string;
  favorites: string[];
  unreadCount: number;
  viewMode: 'preview-deck' | 'device-frame' | 'responsive';
  activeScreenId: string;
  
  // Setters
  setCurrentUser: (user: User) => void;
  setSelectedCategory: (cat: ResourceCategory | 'All') => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'preview-deck' | 'device-frame' | 'responsive') => void;
  setActiveScreenId: (id: string) => void;
  toggleFavorite: (resourceId: string) => void;
  
  // Role switcher
  switchUserRole: (role: UserRole) => void;
  
  // Resource actions
  addResource: (resource: Omit<Resource, 'id'>) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  toggleResourceActive: (id: string) => void;
  
  // Booking actions
  createBooking: (bookingData: {
    resourceId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    purpose: string;
  }) => { success: boolean; booking?: Booking; error?: string };
  updateBookingStatus: (bookingId: string, status: BookingStatus, reason?: string) => void;
  markAsReturned: (bookingId: string) => void;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Stats
  getStats: () => DashboardStats;
  
  // Auth simulation
  login: (email: string, role?: UserRole) => boolean;
  signup: (name: string, email: string, role: UserRole) => User;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'rh_current_user',
  USERS: 'rh_users',
  RESOURCES: 'rh_resources',
  BOOKINGS: 'rh_bookings',
  NOTIFICATIONS: 'rh_notifications',
  FAVORITES: 'rh_favorites',
  VIEW_MODE: 'rh_view_mode',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [favorites, setFavorites] = useState<string[]>(['res-laptop-1']);
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'preview-deck' | 'device-frame' | 'responsive'>('responsive');
  const [activeScreenId, setActiveScreenId] = useState<string>('welcome');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const storedResources = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      const storedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const storedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      const storedViewMode = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);

      if (storedUser) setCurrentUser(JSON.parse(storedUser));
      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedResources) setResources(JSON.parse(storedResources));
      if (storedBookings) setBookings(JSON.parse(storedBookings));
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      if (storedViewMode) setViewMode(storedViewMode as any);
    } catch (e) {
      console.warn('LocalStorage error, using initial defaults:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
    } catch (e) {
      console.error('Failed to sync state to LocalStorage', e);
    }
  }, [currentUser, users, resources, bookings, notifications, favorites, viewMode, isLoaded]);

  const switchUserRole = (role: UserRole) => {
    const existing = users.find((u) => u.role === role);
    if (existing) {
      setCurrentUser(existing);
    } else {
      const fallback: User = {
        id: `user-${role}-${Date.now()}`,
        name: role === 'admin' ? 'Admin Officer' : role === 'staff' ? 'Staff Member' : 'Student Scholar',
        email: `${role}@resourcehub.edu`,
        role,
        profileImage:
          role === 'admin'
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
            : role === 'staff'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      };
      setUsers((prev) => [...prev, fallback]);
      setCurrentUser(fallback);
    }
  };

  const toggleFavorite = (resourceId: string) => {
    setFavorites((prev) =>
      prev.includes(resourceId) ? prev.filter((id) => id !== resourceId) : [...prev, resourceId]
    );
  };

  // Resources
  const addResource = (res: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
      ...res,
      id: `res-${Date.now()}`,
    };
    setResources((prev) => [newResource, ...prev]);

    // Admin notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'New resource added',
      message: `${newResource.name} (${newResource.category}) was successfully added to inventory.`,
      type: 'system',
      isRead: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleResourceActive = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  // Bookings
  const createBooking = (bookingData: {
    resourceId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    purpose: string;
  }) => {
    const targetResource = resources.find((r) => r.id === bookingData.resourceId);
    if (!targetResource) {
      return { success: false, error: 'Resource not found' };
    }

    if (targetResource.availableQuantity <= 0) {
      return {
        success: false,
        error: `Sorry, no available units remaining for ${targetResource.name}.`,
      };
    }

    // Check overlap for the exact resource
    const hasOverlap = bookings.some(
      (b) =>
        b.resourceId === bookingData.resourceId &&
        b.bookingDate === bookingData.bookingDate &&
        b.status === 'approved' &&
        b.startTime === bookingData.startTime
    );

    // If available units is only 1 and slot taken
    if (hasOverlap && targetResource.availableQuantity <= 1) {
      return {
        success: false,
        error: 'This time slot is already fully reserved for this resource.',
      };
    }

    const newBookingId = generateBookingId();
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      bookingId: newBookingId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      resourceId: targetResource.id,
      resourceName: targetResource.name,
      resourceImage: targetResource.image,
      resourceCategory: targetResource.category,
      bookingDate: bookingData.bookingDate,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      purpose: bookingData.purpose,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Decrement available quantity temporarily while reserved or pending
    setResources((prev) =>
      prev.map((r) =>
        r.id === targetResource.id
          ? { ...r, availableQuantity: Math.max(0, r.availableQuantity - 1) }
          : r
      )
    );

    // Notify user & admins
    const userNotif: NotificationItem = {
      id: `notif-${Date.now()}-user`,
      userId: currentUser.id,
      title: 'Booking Submitted',
      message: `Your booking request for ${targetResource.name} (${newBookingId}) has been received and is pending admin approval.`,
      type: 'reminder',
      isRead: false,
      bookingId: newBookingId,
      createdAt: 'Just now',
    };

    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}-admin`,
      userId: 'user-3', // admin
      title: 'New booking request',
      message: `${currentUser.name} requested ${targetResource.name} on ${bookingData.bookingDate}. Needs approval.`,
      type: 'new_request',
      isRead: false,
      bookingId: newBookingId,
      createdAt: 'Just now',
    };

    setNotifications((prev) => [userNotif, adminNotif, ...prev]);

    return { success: true, booking: newBooking };
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId) {
          const isNowApproved = status === 'approved';
          const isNowRejected = status === 'rejected';

          return {
            ...b,
            status,
            issueDate: isNowApproved ? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : b.issueDate,
            expectedReturnDate: isNowApproved
              ? new Date(Date.now() + 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
              : b.expectedReturnDate,
          };
        }
        return b;
      })
    );

    const booking = bookings.find((b) => b.bookingId === bookingId);
    if (!booking) return;

    // If rejected or cancelled, restore quantity
    if (status === 'rejected' || status === 'cancelled') {
      setResources((prev) =>
        prev.map((r) =>
          r.id === booking.resourceId
            ? { ...r, availableQuantity: Math.min(r.totalQuantity, r.availableQuantity + 1) }
            : r
        )
      );
    }

    // Notify user
    const notifTitle =
      status === 'approved'
        ? 'Your booking is approved'
        : status === 'rejected'
        ? 'Your booking is rejected'
        : `Booking status updated to ${status}`;

    const notifMsg =
      status === 'approved'
        ? `Great news! Your booking for ${booking.resourceName} (${booking.bookingId}) has been approved.`
        : status === 'rejected'
        ? `Your booking for ${booking.resourceName} (${booking.bookingId}) was declined.${reason ? ` Reason: ${reason}` : ''}`
        : `Your booking ${booking.bookingId} is now ${status}.`;

    const statusNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: booking.userId,
      title: notifTitle,
      message: notifMsg,
      type: status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'reminder',
      isRead: false,
      bookingId: booking.bookingId,
      createdAt: 'Just now',
    };

    setNotifications((prev) => [statusNotif, ...prev]);
  };

  const markAsReturned = (bookingId: string) => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId) {
          return {
            ...b,
            status: 'completed',
            actualReturnDate: todayStr,
            isOverdue: false,
          };
        }
        return b;
      })
    );

    const booking = bookings.find((b) => b.bookingId === bookingId);
    if (booking) {
      // Increment available resource quantity
      setResources((prev) =>
        prev.map((r) =>
          r.id === booking.resourceId
            ? { ...r, availableQuantity: Math.min(r.totalQuantity, r.availableQuantity + 1) }
            : r
        )
      );

      // Notification
      const returnNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: booking.userId,
        title: 'Equipment Returned',
        message: `${booking.resourceName} (${booking.bookingId}) has been successfully returned and checked in.`,
        type: 'reminder',
        isRead: false,
        bookingId: booking.bookingId,
        createdAt: 'Just now',
      };
      setNotifications((prev) => [returnNotif, ...prev]);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getStats = (): DashboardStats => {
    const totalUsers = users.length + 117; // matches demo 120
    const totalResources = resources.reduce((acc, r) => acc + r.totalQuantity, 0);
    const availableResources = resources.reduce((acc, r) => acc + r.availableQuantity, 0);
    const totalBookings = bookings.length + 239; // matches demo 245
    const pendingRequests = bookings.filter((b) => b.status === 'pending').length;
    const overdueReturns = bookings.filter((b) => b.isOverdue).length;

    return {
      totalUsers,
      totalResources,
      totalBookings,
      pendingRequests,
      overdueReturns,
      availableResources,
    };
  };

  const login = (email: string, role?: UserRole) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // create and log in
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: role || 'student',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const signup = (name: string, email: string, role: UserRole) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    // reset to student guest/demo
    setCurrentUser(INITIAL_USERS[0]);
  };

  const unreadCount = notifications.filter(
    (n) => !n.isRead && (currentUser.role === 'admin' ? true : n.userId === currentUser.id)
  ).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        resources,
        bookings,
        notifications,
        selectedCategory,
        searchQuery,
        favorites,
        unreadCount,
        viewMode,
        activeScreenId,
        setCurrentUser,
        setSelectedCategory,
        setSearchQuery,
        setViewMode,
        setActiveScreenId,
        toggleFavorite,
        switchUserRole,
        addResource,
        updateResource,
        deleteResource,
        toggleResourceActive,
        createBooking,
        updateBookingStatus,
        markAsReturned,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getStats,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
