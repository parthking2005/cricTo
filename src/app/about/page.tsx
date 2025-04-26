'use client';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-700">
          About Our Cricket Platform
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Your go-to place for the latest cricket scores, match history, and updates—delivered with precision and passion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white shadow-md rounded-2xl p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">🎯 Our Mission</h2>
            <p className="text-sm text-gray-700">
              To bring fans closer to the game by providing real-time data, match summaries, and cricket insights—all in one platform.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 border border-green-100">
            <h2 className="text-xl font-semibold text-green-600 mb-2">📊 What We Offer</h2>
            <p className="text-sm text-gray-700">
              International, league, domestic, and women's match histories with detailed scores and timelines—beautifully organized and always accessible.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 border border-indigo-100">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">🚀 Built for Fans</h2>
            <p className="text-sm text-gray-700">
              Whether you're a stat nerd or a casual fan, our platform is crafted to keep you engaged and informed every day.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-sm p-8 border border-gray-200 text-left">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Behind the Scenes</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            This platform is powered by <span className="font-medium text-blue-600">Next.js</span> and leverages live data from the Cricbuzz API.
            Data is cached smartly to ensure fast load times and up-to-date results. Every match, every score, and every moment is just a click away.
          </p>
        </div>
      </div>
    </main>
  );
}
