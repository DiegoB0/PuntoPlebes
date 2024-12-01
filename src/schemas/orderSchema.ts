import * as Yup from 'yup'

export const orderSchema = Yup.object().shape({
  client_name: Yup.string().required('El nombre del cliente es obligatorio'),
  client_phone: Yup.string().required('El teléfono del cliente es obligatorio'),
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
