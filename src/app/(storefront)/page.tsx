import Link from 'next/link';

export default function PublicLandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-center items-center p-6 text-black border-4 border-black m-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <header className="border-b-4 border-black pb-4">
          <h1 className="text-4xl font-extrabold uppercase tracking-tighter">Petromus Salon</h1>
          <p className="text-sm tracking-widest uppercase text-gray-500 mt-1">Premium Pet Care Ecosystem</p>
        </header>
        <p className="text-sm leading-relaxed text-gray-700">
          Tailored styling treatments, structured health monitoring, and direct conversational scheduling infrastructure.
        </p>
        <div className="grid grid-cols-1 gap-2 pt-4">
          <Link href="/services" className="bg-black text-white text-center font-bold uppercase tracking-widest text-xs p-4 hover:bg-gray-800 border border-black transition-colors">
            Explore Styling Menu
          </Link>
          <Link href="/bookings" className="bg-white text-black text-center font-bold uppercase tracking-widest text-xs p-4 hover:bg-black hover:text-white border-2 border-black transition-all">
            Manage Client Portal
          </Link>
        </div>
      </div>
    </main>
  );
}