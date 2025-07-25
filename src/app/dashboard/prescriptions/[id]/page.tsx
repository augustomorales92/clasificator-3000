import PrescriptionDetailsPage from './content'

interface Props {
  params: Promise<{ id: string }>
}

async function PrescriptionDetailsPageWrapper({ params }: Props) {
  const { id } = await params

  return <PrescriptionDetailsPage id={id} />
}

export default function PrescriptionDetails({ params }: Props) {
  return <PrescriptionDetailsPageWrapper params={params} />
}
