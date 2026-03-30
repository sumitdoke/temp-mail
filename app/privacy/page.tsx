export default function Privacy() {
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
          Privacy Policy
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Last updated: March 2026
        </p>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              1. What We Do
            </h2>
            <p>
              TempMail.in provides free temporary email addresses
              for privacy protection. We do not require registration
              or any personal information to use our service.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              2. Data We Collect
            </h2>
            <p>We collect absolutely no personal data. Specifically:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>No accounts created or stored</li>
              <li>No names or personal details collected</li>
              <li>No IP addresses logged</li>
              <li>No tracking cookies used</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              3. Email Data
            </h2>
            <p>
              Emails received on our platform are stored temporarily
              and automatically deleted after 24 hours without
              any manual intervention. We do not read, scan,
              or analyze email content.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              4. Cookies
            </h2>
            <p>
              We use only essential cookies required for the
              service to function. We do not use advertising
              or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              5. GDPR Compliance
            </h2>
            <p>
              Our service operates under GDPR Article 6(1)(f)
              legitimate interest basis. Since we collect no
              personal data, GDPR obligations are minimal.
              Users in the EU have full rights under GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-2">
              6. Contact
            </h2>
            <p>
              For any privacy concerns contact us at:
              <span className="text-blue-400 ml-1">
                privacy@tempmail.in
              </span>
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}