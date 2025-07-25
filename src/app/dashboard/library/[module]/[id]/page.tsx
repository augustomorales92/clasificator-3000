import FileDetailPage from './content'

async function LibraryDetailPageContent({
  params,
}: {
  params: Promise<{ id: string; module: string }>
}) {
  const { id, module } = await params
  return <FileDetailPage id={id} module={module} />
}

export default  function LibraryDetailPage({
  params,
}: {
  params: Promise<{ id: string; module: string }>
}) {
  return <LibraryDetailPageContent params={params} />
}
