import type { Metadata } from 'next';
import PeerLendingClient from '@/components/concept/PeerLendingClient';

export const metadata: Metadata = {
  title: 'Concept: Peer Trust Lending — Vision Demo',
};

export default function PeerLendingConceptPage() {
  return <PeerLendingClient />;
}
