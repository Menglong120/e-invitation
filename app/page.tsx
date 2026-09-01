import Invitation from './components/Invitation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Nak & Ravan - Wedding Invitation",
  description: "Elegant wedding invitation with minimalism blue theme",
};

export default function Home() {
  return <Invitation />;
}
