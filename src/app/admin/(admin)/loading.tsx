import { Spinner } from '@nextui-org/react'

export default function Loading(): JSX.Element {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Spinner size="lg" color="danger" />
    </div>
  )
}
