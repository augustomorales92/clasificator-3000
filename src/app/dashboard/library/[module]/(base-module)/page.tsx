import Content from './content'

async function BaseModuleContent({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params
  return <Content module={module} />
}

export default function BaseModulePage({
  params,
}: {
  params: Promise<{ module: string }>
}) {
  return <BaseModuleContent params={params} />
}
