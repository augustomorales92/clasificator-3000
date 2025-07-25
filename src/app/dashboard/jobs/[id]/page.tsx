import JobDetailContent from './content'

async function JobDetailPageContent({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <JobDetailContent id={id} />
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <JobDetailPageContent params={params} />
}
