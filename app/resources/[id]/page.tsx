import ResourceDetailsScreen from '@/components/screens/ResourceDetailsScreen';

export default function ResourceDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <ResourceDetailsScreen resourceId={params.id} />;
}
