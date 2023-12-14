import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface BookingState {
  lawyerName: string
  lawyerId: number
  userFirstName: string
  userLastName: string
  userPhoneNumber: number
  appointmentTime: string
}

export interface InitialsBookingState {
  appointment: BookingState[]
  isLoading: boolean
  isError: boolean
}
const initialState: InitialsBookingState = {
  appointment: [],
  isLoading: false,
  isError: false
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    bookAppointment: (state, action: PayloadAction<BookingState>) => {
      state.appointment.push(action.payload)
    }
  },
  extraReducers(builder) {
    builder.addCase(storeBookingData.fulfilled, (state, action) => {
      state.isError = false
      state.isLoading = false
      state.appointment.push(action.payload)
    })
    builder.addCase(storeBookingData.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(storeBookingData.rejected, (state, action) => {
      state.isError = true
    })
  }
})

export const storeBookingData = createAsyncThunk(
  'storeBookingData',
  async (bookingData: BookingState) => {
    // send booking data using POST method
    return bookingData
  }
)

export const { bookAppointment } = bookingSlice.actions
export default bookingSlice.reducer
