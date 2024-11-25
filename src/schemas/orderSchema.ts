import * as Yup from 'yup'

export const orderSchema = Yup.object().shape({
  client_name: Yup.string().required('El nombre del cliente es obligatorio'),
  client_phone: Yup.string().required('El teléfono del cliente es obligatorio'),
  items: Yup.array().of(
    Yup.object().shape({
      meal_id: Yup.number().required('El ID del platillo es obligatorio'),
      quantity: Yup.number()
        .positive()
        .integer()
        .required('La cantidad es obligatoria'),
      details: Yup.array()
        .of(
          Yup.object().shape({
            detail: Yup.string().required('El detalle es obligatorio')
          })
        )
        .required('Los detalles son obligatorios')
    })
  ),
  payments: Yup.array().of(
    Yup.object().shape({
      payment_method: Yup.string().required('El método de pago es obligatorio'),
      amount_given: Yup.number().required('El monto es obligatorio')
    })
  )
})
