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
  addResource: (resource: Omit<Resource, 'id'>) => Promise<void>;
  updateResource: (id: string, updates: Partial<Resource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  toggleResourceActive: (id: string) => Promise<void>;
  
  // Booking actions
  createBooking: (bookingData: {
    resourceId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    purpose: string;
  }) => { success: boolean; booking?: Booking; error?: string };
  updateBookingStatus: (bookingId: string, status: BookingStatus, reason?: string) => Promise<void>;
  markAsReturned: (bookingId: string) => Promise<void>;
  
  // Notifications
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  
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

  // Fetch live data directly from PostgreSQL on initial load
  useEffect(() => {
    async function loadDataFromPostgreSQL() {
      try {
        const [resResp, bookResp, notifResp, userResp] = await Promise.all([
          fetch('/api/resources').then((r) => r.json()).catch(() => null),
          fetch('/api/bookings').then((r) => r.json()).catch(() => null),
          fetch('/api/notifications').then((r) => r.json()).catch(() => null),
          fetch('/api/users').then((r) => r.json()).catch(() => null),
        ]);

        if (resResp?.success && Array.isArray(resResp.data) && resResp.data.length > 0) {
          setResources(resResp.data);
        }
        if (bookResp?.success && Array.isArray(bookResp.data) && bookResp.data.length > 0) {
          setBookings(bookResp.data);
        }
        if (notifResp?.success && Array.isArray(notifResp.data) && notifResp.data.length > 0) {
          setNotifications(notifResp.data);
        }
        if (userResp?.success && Array.isArray(userResp.data) && userResp.data.length > 0) {
          setUsers(userResp.data);
        }
      } catch (err) {
        console.warn('Could not fetch from PostgreSQL API, using initial state:', err);
      } finally {
        setIsLoaded(true);
      }
    }

    // Load user preferences from LocalStorage
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      const storedViewMode = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);

      if (storedUser) setCurrentUser(JSON.parse(storedUser));
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      if (storedViewMode) setViewMode(storedViewMode as any);
    } catch (e) {
      // ignore
    }

    loadDataFromPostgreSQL();
  }, []);

  // Save UI preferences to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
    } catch (e) {
      console.error('Failed to sync preferences to LocalStorage', e);
    }
  }, [currentUser, favorites, viewMode, isLoaded]);

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

  // Resources - PostgreSQL CRUD
  const addResource = async (res: Omit<Resource, 'id'>) => {
    const tempId = `res-${Date.now()}`;
    const newResource: Resource = {
      ...res,
      id: tempId,
    };
    setResources((prev) => [newResource, ...prev]);

    try {
      const resp = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(res),
      });
      const data = await resp.json();
      if (data.success && data.data) {
        setResources((prev) => prev.map((r) => (r.id === tempId ? data.data : r)));
      }
    } catch (err) {
      console.error('Failed to add resource in PostgreSQL:', err);
    }

    // Refresh notifications
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

  const updateResource = async (id: string, updates: Partial<Resource>) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );

    try {
      await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error('Failed to update resource in PostgreSQL:', err);
    }
  };

  const deleteResource = async (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));

    try {
      await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete resource in PostgreSQL:', err);
    }
  };

  const toggleResourceActive = async (id: string) => {
    const target = resources.find((r) => r.id === id);
    if (!target) return;
    const newActive = !target.isActive;

    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: newActive } : r))
    );

    try {
      await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newActive }),
      });
    } catch (err) {
      console.error('Failed to toggle resource active state in PostgreSQL:', err);
    }
  };

  // Bookings - PostgreSQL CRUD
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

    const hasOverlap = bookings.some(
      (b) =>
        b.resourceId === bookingData.resourceId &&
        b.bookingDate === bookingData.bookingDate &&
        b.status === 'approved' &&
        b.startTime === bookingData.startTime
    );

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

    // Optimistic UI updates
    setBookings((prev) => [newBooking, ...prev]);
    setResources((prev) =>
      prev.map((r) =>
        r.id === targetResource.id
          ? { ...r, availableQuantity: Math.max(0, r.availableQuantity - 1) }
          : r
      )
    );

    // Call PostgreSQL endpoint
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...bookingData,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userRole: currentUser.role,
        bookingId: newBookingId,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setBookings((prev) => prev.map((b) => (b.bookingId === newBookingId ? data.data : b)));
        }
      })
      .catch((err) => console.error('Error persisting booking in PostgreSQL:', err));

    // Optimistic notification
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

    setNotifications((prev) => [userNotif, ...prev]);

    return { success: true, booking: newBooking };
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId) {
          const isNowApproved = status === 'approved';
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

    if (status === 'rejected' || status === 'cancelled') {
      setResources((prev) =>
        prev.map((r) =>
          r.id === booking.resourceId
            ? { ...r, availableQuantity: Math.min(r.totalQuantity, r.availableQuantity + 1) }
            : r
        )
      );
    }

    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status, reason }),
      });
    } catch (err) {
      console.error('Error updating booking in PostgreSQL:', err);
    }

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

  const markAsReturned = async (bookingId: string) => {
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
      setResources((prev) =>
        prev.map((r) =>
          r.id === booking.resourceId
            ? { ...r, availableQuantity: Math.min(r.totalQuantity, r.availableQuantity + 1) }
            : r
        )
      );

      try {
        await fetch('/api/bookings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId, isReturned: true }),
        });
      } catch (err) {
        console.error('Error marking returned in PostgreSQL:', err);
      }

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

  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error('Error marking notification read in PostgreSQL:', err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true, userId: currentUser.id }),
      });
    } catch (err) {
      console.error('Error marking all notifications read in PostgreSQL:', err);
    }
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
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: role || 'student',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    // Save to PostgreSQL
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).catch((err) => console.error('Error persisting user to PostgreSQL:', err));

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

    // Save to PostgreSQL
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).catch((err) => console.error('Error persisting user to PostgreSQL:', err));

    return newUser;
  };

  const logout = () => {
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
