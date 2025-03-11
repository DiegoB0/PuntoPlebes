import * as Yup from 'yup'

export const orderSchema = Yup.object().shape({
  client_name: Yup.string(),
  client_phone: Yup.string(),
  items: Yup.array().of(
    Yup.object().shape({
      meal_id: Yup.number().required(),
      quantity: Yup.number().required(),
      details: Yup.array()
    })
  ),
  payments: Yup.array().of(
    Yup.object().shape({
      payment_method: Yup.string().required('El método de pago es obligatorio'),
      amount_given: Yup.number().required('El monto es obligatorio')
    })
  )
})
