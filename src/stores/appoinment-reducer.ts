import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface BookingState {
  lawyerName: string
  lawyerId: number
  userFirstName: string
  userLastName: string
  userPhoneNumber: number
  appointmentTime: string
}

const initialState: BookingState[] = []

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    bookAppointment: (state, action: PayloadAction<BookingState>) => {
      state.push(action.payload)
    }
  }
})

export const { bookAppointment } = bookingSlice.actions
export default bookingSlice.reducer
