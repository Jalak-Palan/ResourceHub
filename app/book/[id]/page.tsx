import BookingFormScreen from '@/components/screens/BookingFormScreen';

export default function BookResourcePage({
  params,
}: {
  params: { id: string };
}) {
  return <BookingFormScreen resourceId={params.id} />;
}
