// File: src/schemas/orderSchema.ts
import * as Yup from 'yup'

export const orderSchema = Yup.object().shape({
  client_name: Yup.string().optional(),
  client_phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional(),
  total_price: Yup.number().required('Total price is required').positive(),
  items: Yup.array()
    .of(
      Yup.object().shape({
        meal_id: Yup.number().required('Meal ID is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .positive('Quantity must be positive')
          .integer('Quantity must be an integer'),
        notes: Yup.string().optional().nullable()
      })
    )
    .min(1, 'At least one item is required')
})
