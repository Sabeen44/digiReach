export default function Terms() {
  return (
    <section className="bg-gray-900 py-24 px-6 lg:px-8 min-h-screen">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-10 space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using digiReach, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Use of Service</h2>
            <p>
              You agree to use digiReach only for lawful purposes and in accordance with these
              Terms. You are responsible for all content displayed on screens managed through
              your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Subscriptions & Billing</h2>
            <p>
              Subscriptions are billed monthly. You may cancel at any time through your billing
              portal. Cancellations take effect at the end of the current billing period.
              Refunds are not provided for partial months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the security of your account credentials. Notify
              us immediately if you suspect unauthorized access to your account. We are not liable
              for losses caused by unauthorized account use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Prohibited Content</h2>
            <p>
              You may not use digiReach to display content that is unlawful, harmful, threatening,
              abusive, defamatory, obscene, or otherwise objectionable. We reserve the right to
              suspend accounts that violate these guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
            <p>
              digiReach is provided "as is" without warranties of any kind. We are not liable for
              any indirect, incidental, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. Continued use of the service
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contact</h2>
            <p>
              Questions about these Terms? Reach us via our{" "}
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
