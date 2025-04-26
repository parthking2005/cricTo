export default function Contact() {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Contact Us</h2>
          <p className="text-center text-gray-600 mb-6">
            We'd love to hear from you! Drop us a message, and we'll get back to you as soon as possible.
          </p>
  
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Send Message
            </button>
          </form>
  
          <div className="mt-8 text-center">
            <p className="text-gray-600">Or contact us via:</p>
            <p className="text-green-500">contact@cricketwebsite.com</p>
            <p className="text-green-500">+123 456 7890</p>
          </div>
        </div>
      </div>
    );
  }
  