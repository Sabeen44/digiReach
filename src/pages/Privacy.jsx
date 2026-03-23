export default function Privacy() {
  return (
    <section className="bg-gray-900 py-24 px-6 lg:px-8 min-h-screen">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-10 space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account,
              subscribe to a plan, or contact us for support. This includes your name, email address,
              and payment information processed securely through Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services,
              process transactions, send you technical notices and support messages, and respond
              to your comments and questions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Storage</h2>
            <p>
              Your account data is stored securely using Supabase. Payment information is handled
              entirely by Stripe and is never stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Sharing of Information</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information
              to third parties without your consent, except as required to provide our services
              (e.g., payment processing via Stripe).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data at any
              time by contacting us at{" "}
              <a href="/contact" className="text-indigo-400 hover:underline">
                our contact page
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us via our{" "}
              <a href="/contact" className="text-indigo-400 hover:underline">
                contact form
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}