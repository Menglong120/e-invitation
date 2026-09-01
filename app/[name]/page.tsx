import { notFound } from 'next/navigation';
import Invitation from '../components/Invitation';
import guests from '../../data/guests.json';

// Type the JSON as a plain record
const guestMap = guests as Record<string, string>;

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  return Object.keys(guestMap).map((slug) => ({ name: slug }));
}

export default async function GuestPage({ params }: Props) {
  const { name } = await params;
  const slug = name.toLowerCase();
  const guestName = guestMap[slug];

  // Unknown slug → 404
  if (!guestName) notFound();

  return <Invitation guestName={guestName} />;
}
