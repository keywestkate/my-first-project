import React, { createContext, useContext, useReducer } from 'react'
import { COACHES, STUDENTS, INITIAL_BOOKINGS } from '../data/mockData'

const AppContext = createContext(null)

const initialState = {
  currentUser: null,
  coaches: COACHES,
  students: STUDENTS,
  bookings: INITIAL_BOOKINGS,
  notification: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      const { email, password } = action.payload
      const coach = state.coaches.find(c => c.email === email && c.password === password)
      if (coach) return { ...state, currentUser: coach, notification: null }
      const parent = state.students.find(p => p.email === email && p.password === password)
      if (parent) return { ...state, currentUser: parent, notification: null }
      return { ...state, notification: { type: 'error', message: 'Invalid email or password.' } }
    }

    case 'LOGOUT':
      return { ...state, currentUser: null }

    case 'REGISTER_COACH': {
      const newCoach = {
        ...action.payload,
        id: 'coach_' + Date.now(),
        role: 'coach',
        rating: 0,
        reviewCount: 0,
        sessionCount: 0,
        availability: {},
        joinedDate: new Date().toISOString().split('T')[0],
      }
      return { ...state, coaches: [...state.coaches, newCoach], currentUser: newCoach }
    }

    case 'REGISTER_PARENT': {
      const newParent = {
        ...action.payload,
        id: 'parent_' + Date.now(),
        role: 'parent',
      }
      return { ...state, students: [...state.students, newParent], currentUser: newParent }
    }

    case 'UPDATE_AVAILABILITY': {
      const { coachId, availability } = action.payload
      const updatedCoaches = state.coaches.map(c =>
        c.id === coachId ? { ...c, availability } : c
      )
      const updatedUser =
        state.currentUser?.id === coachId
          ? { ...state.currentUser, availability }
          : state.currentUser
      return { ...state, coaches: updatedCoaches, currentUser: updatedUser }
    }

    case 'CREATE_BOOKING': {
      const newBooking = {
        ...action.payload,
        id: 'booking_' + Date.now(),
        status: 'pending_approval',
        createdAt: new Date().toISOString().split('T')[0],
      }
      return { ...state, bookings: [...state.bookings, newBooking] }
    }

    case 'APPROVE_BOOKING': {
      const updated = state.bookings.map(b =>
        b.id === action.payload ? { ...b, status: 'approved' } : b
      )
      return { ...state, bookings: updated }
    }

    case 'DECLINE_BOOKING': {
      const updated = state.bookings.map(b =>
        b.id === action.payload ? { ...b, status: 'cancelled' } : b
      )
      return { ...state, bookings: updated }
    }

    case 'SET_NOTIFICATION':
      return { ...state, notification: action.payload }

    case 'CLEAR_NOTIFICATION':
      return { ...state, notification: null }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const login = (email, password) => dispatch({ type: 'LOGIN', payload: { email, password } })
  const logout = () => dispatch({ type: 'LOGOUT' })
  const registerCoach = (data) => dispatch({ type: 'REGISTER_COACH', payload: data })
  const registerParent = (data) => dispatch({ type: 'REGISTER_PARENT', payload: data })
  const updateAvailability = (coachId, availability) =>
    dispatch({ type: 'UPDATE_AVAILABILITY', payload: { coachId, availability } })
  const createBooking = (data) => dispatch({ type: 'CREATE_BOOKING', payload: data })
  const approveBooking = (id) => dispatch({ type: 'APPROVE_BOOKING', payload: id })
  const declineBooking = (id) => dispatch({ type: 'DECLINE_BOOKING', payload: id })
  const notify = (type, message) => dispatch({ type: 'SET_NOTIFICATION', payload: { type, message } })
  const clearNotification = () => dispatch({ type: 'CLEAR_NOTIFICATION' })

  const getCoachBookings = (coachId) => state.bookings.filter(b => b.coachId === coachId)
  const getParentBookings = (parentId) => state.bookings.filter(b => b.parentId === parentId)
  const getCoachById = (id) => state.coaches.find(c => c.id === id)

  return (
    <AppContext.Provider value={{
      ...state,
      login, logout,
      registerCoach, registerParent,
      updateAvailability,
      createBooking, approveBooking, declineBooking,
      notify, clearNotification,
      getCoachBookings, getParentBookings, getCoachById,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
