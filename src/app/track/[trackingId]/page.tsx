import TrackingClient from './TrackingClient';

export default async function TrackingPage({ params }: { params: Promise<{ trackingId: string }> }) {
  const { trackingId } = await params;
  return <TrackingClient trackingId={trackingId} />;
}
