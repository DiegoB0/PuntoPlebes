import { Spinner } from '@nextui-org/react'

export const Loader = (): JSX.Element => {
  return (
    <div className="flex justify-center">
      <Spinner />
    </div>
  )
}
