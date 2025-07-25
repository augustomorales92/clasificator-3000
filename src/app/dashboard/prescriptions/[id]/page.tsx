import { Suspense } from 'react'
import PrescriptionDetailsPage from './content'

interface Props {
  params: Promise<{ id: string }>
}

async function PrescriptionDetailsPageWrapper({ params }: Props) {
  const { id } = await params

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando prescripción...</p>
          </div>
        </div>
      }
    >
      <PrescriptionDetailsPage id={id} />
    </Suspense>
  )
}

export default function PrescriptionDetails({ params }: Props) {
  return <PrescriptionDetailsPageWrapper params={params} />
}
