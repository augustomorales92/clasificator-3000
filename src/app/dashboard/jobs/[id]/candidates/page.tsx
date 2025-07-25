import JobCandidatesContent from './content'

async function JobCandidatesPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <JobCandidatesContent id={id} />
}

export default  function JobCandidatesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <JobCandidatesPageContent params={params} />
}