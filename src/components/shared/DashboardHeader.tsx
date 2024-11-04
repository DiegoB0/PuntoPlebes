const DashboardHeader = ({
  title,
  subtitle = ''
}: {
  title: string
  subtitle?: string
}): JSX.Element => {
  return (
    <div className="w-full my-2 px-2">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-gray-500 text-md text-justify mt-2">{subtitle}</p>
      {/* <Divider /> */}
    </div>
  )
}

export default DashboardHeader
