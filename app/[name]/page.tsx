import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const slug = name.toLowerCase();
  const guestName = guestMap[slug];

  if (!guestName) {
    return {
      title: "Nak & Ravan - Wedding Invitation",
    };
  }

  return {
    title: `${guestName} - Wedding Invitation`,
  };
}

export default async function GuestPage({ params }: Props) {
  const { name } = await params;
  const slug = name.toLowerCase();
  const guestName = guestMap[slug];

  // Unknown slug → 404
  if (!guestName) notFound();

  return <Invitation guestName={guestName} />;
}
