import React, { useState } from 'react'
import { useForm, Controller, set } from 'react-hook-form'
import DateTimePicker from '@react-native-community/datetimepicker'

import dayjs from 'dayjs'
import { Text } from './Themed'
import Input from './Input'
import { Button } from 'react-native'

interface DatePickerFormItemProps {
	control: any
}

const DatePickerFormItem = ({ control }: DatePickerFormItemProps) => {
	const [showPicker, setShowPicker] = useState(false)
	return (
		<>
			<Input.Label label="Date">
				<Controller
					control={control}
					render={({ field: { onChange, onBlur, value } }) => {
						return showPicker ? (
							<DateTimePicker
								value={value}
								onChange={(val, date) => {
									onChange(date)
									setShowPicker(false)
								}}
								display="spinner"
							/>
						) : (
							<Button title={dayjs(value).format('MM/DD/YYYY')} onPress={() => setShowPicker(!showPicker)} />
						)
					}}
					name="date"
					rules={{ required: 'This is required' }}
				/>
			</Input.Label>
		</>
	)
}

export default DatePickerFormItem
