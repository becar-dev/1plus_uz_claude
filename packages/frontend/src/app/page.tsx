export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">
          1<span className="text-primary-500">Plus</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Premium Creative Agency
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/portfolio"
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            View Portfolio
          </a>
          <a
            href="/contact"
            className="px-6 py-3 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}
