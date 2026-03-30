export default function Terms() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <a href="/" className="text-blue-400 text-sm">
            ← Back to TempMail.in
          </a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Last updated: March 2026
        </p>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              1. Acceptance
            </h2>
            <p>
              By using TempMail.in you agree to these terms.
              If you disagree please stop using our service.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              2. Permitted Use
            </h2>
            <p>You may use TempMail.in for:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Protecting your privacy online</li>
              <li>Avoiding spam in your personal inbox</li>
              <li>Testing and development purposes</li>
              <li>One-time website registrations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              3. Prohibited Use
            </h2>
            <p>You may NOT use TempMail.in for:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Any illegal activities</li>
              <li>Fraud or impersonation</li>
              <li>Spamming or harassment</li>
              <li>Violating any third party terms of service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibent text-lg mb-2">
              4. Service Availability
            </h2>
            <p>
              We provide this service free of charge and
              make no guarantees of uptime or availability.
              We reserve the right to modify or discontinue
              the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              5. Email Deletion
            </h2>
            <p>
              All emails are permanently deleted after 24 hours.
              We are not responsible for any loss of data
              after deletion.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              6. Limitation of Liability
            </h2>
            <p>
              TempMail.in is provided as-is without warranty.
              We are not liable for any damages arising
              from use of this service.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}