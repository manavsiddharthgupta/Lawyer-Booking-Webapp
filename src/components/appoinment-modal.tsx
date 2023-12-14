import { BuildingIcon } from 'lucide-react'
import { Input as ChakraInput } from '@chakra-ui/react'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { Badge } from './ui/badge'
import { Date1 } from './date'
import { Button } from './ui/button'
import { Lawyers } from './data-table'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../stores/store'
import { isDoctorAvailable } from '../lib/helpers'
import { storeBookingData } from '../stores/appoinment-reducer'

const AppoinmentModal = ({ lawyer }: { lawyer: Lawyers | undefined }) => {
  const [firstName, setFirstname] = useState<string | undefined>()
  const [lastName, setLastName] = useState<string | undefined>()
  const [appoinmentDateTime, setAppoinmnetDateTime] = useState<
    string | undefined
  >()
  const [phoneNumber, setPhoneNumber] = useState<number | string | undefined>()

  const dispatch = useDispatch<AppDispatch>()
  const toast = useToast()

  const bookedAppointments = useSelector((state: RootState) => state.booking)

  const onSubmit = () => {
    if (
      !firstName ||
      firstName.trim() === '' ||
      !appoinmentDateTime ||
      !phoneNumber
    ) {
      console.log('Invalid Details')
      toast({
        title: 'Invalid Details',
        description: 'Please fill valid details',
        status: 'error',
        duration: 900,
        position: 'top'
      })
      return
    }

    if (!lawyer) {
      return
    }

    if (
      !isDoctorAvailable(
        appoinmentDateTime,
        lawyer?.availableTime.from,
        lawyer?.availableTime.to
      )
    ) {
      toast({
        title: 'Lawyer Unavailable',
        description: 'Please choose another time.',
        status: 'error',
        duration: 900,
        position: 'top'
      })
      return
    }

    if (!isTimeSlotAvailable(appoinmentDateTime)) {
      toast({
        title: 'Appointment Overlap',
        description:
          'The selected time slot overlaps with an existing appointment. Please choose another time.',
        status: 'error',
        duration: 900,
        position: 'top'
      })
      return
    }

    dispatch(
      storeBookingData({
        lawyerName: lawyer?.name,
        lawyerId: lawyer?.id,
        userFirstName: firstName,
        userLastName: lastName || '',
        userPhoneNumber: +phoneNumber,
        appointmentTime: appoinmentDateTime
      })
    )
    toast({
      title: 'Booked Successfull',
      description: 'Your appoinment has been booked',
      status: 'success',
      duration: 900,
      position: 'top'
    })

    setFirstname(undefined)
    setLastName(undefined)
    setAppoinmnetDateTime(undefined)
    setPhoneNumber(undefined)
  }

  const isTimeSlotAvailable = (time: Date | string) => {
    const appointmentTime = new Date(time)

    return !bookedAppointments.appointment.some((appointment) => {
      const bookedStartTime = new Date(appointment.appointmentTime)
      const bookedEndTime = new Date(bookedStartTime)
      bookedEndTime.setHours(bookedEndTime.getHours() + 1)

      const isSameLawyer = appointment.lawyerId === lawyer?.id

      const isOverlap =
        appointmentTime >= bookedStartTime && appointmentTime < bookedEndTime

      return isSameLawyer && isOverlap
    })
  }

  const firms = lawyer?.firms.join(', ')

  return (
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>Book an Appoinment</DialogTitle>
        <DialogDescription>
          Select a convenient time slot and provide your details to schedule an
          appointment.
        </DialogDescription>
      </DialogHeader>
      <div className='my-2'>
        <div className='flex gap-2 items-center'>
          <h1 className='text-3xl font-semibold'>{lawyer?.name}</h1>
          <Badge>{lawyer?.speciality}</Badge>
        </div>
        <div className='flex my-1 gap-2 items-center'>
          <BuildingIcon size={20} />
          <p className='text-xs font-medium'>{firms}</p>
        </div>
        <Date1 date={lawyer?.availableTime} />
        <div className='mt-4'>
          <div className='flex gap-2'>
            <ChakraInput
              value={firstName || ''}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder='First Name'
              size='sm'
            />
            <ChakraInput
              value={lastName || ''}
              onChange={(e) => setLastName(e.target.value)}
              placeholder='Last Name'
              size='sm'
            />
          </div>
          <ChakraInput
            value={phoneNumber || ''}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder='Phone Number'
            className='my-1'
            size='sm'
            type='number'
          />
          <ChakraInput
            value={appoinmentDateTime || ''}
            min={new Date(Date.now()).toISOString().slice(0, 16)}
            max={new Date(new Date().setMonth(new Date().getMonth() + 1))
              .toISOString()
              .slice(0, 16)}
            placeholder='Select Date and Time'
            size='sm'
            type='datetime-local'
            onChange={(e) => setAppoinmnetDateTime(e.target.value)}
          />
        </div>
      </div>
      <Button
        variant='default'
        disabled={bookedAppointments.isLoading}
        onClick={onSubmit}
      >
        Book Appointment
      </Button>
    </DialogContent>
  )
}

export default AppoinmentModal
