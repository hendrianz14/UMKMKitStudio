import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4">The page you are looking for does not exist.</p>
      <Link href="/landing" className="mt-8 px-4 py-2 bg-blue-600 rounded-md">
        Go to Homepage
      </Link>
    </div>
  );
}
