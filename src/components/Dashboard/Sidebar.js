import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4 space-y-4">
      <h2 className="text-xl font-bold">Tactical-Button</h2>
      <nav className="flex flex-col space-y-2">
        <Link href="/dashboard">Profile</Link>
        <Link href="/dashboard/analyze">Analyze</Link>
        <Link href="/dashboard/record">Record</Link>
        <Link href="/dashboard/subscription">Subscription</Link>
      </nav>
    </div>
  );
}

