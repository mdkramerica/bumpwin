import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | BumpWin",
  description: "Privacy Policy for BumpWin flight compensation assistance platform.",
};

export default function PrivacyPage() {
  const lastUpdated = "November 29, 2025";
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="font-display font-bold text-sm sm:text-xl text-lime-400">
            BUMPWIN
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="prose prose-invert prose-slate max-w-none">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black font-display mb-2">Privacy Policy</h1>
            <p className="text-slate-400 text-sm">Last Updated: {lastUpdated}</p>
          </div>

          <div className="space-y-8 text-slate-300 leading-relaxed">
            
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
              <p>
                BumpWin ("we," "us," or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services (collectively, the "Service").
              </p>
              <p className="mt-3">
                Please read this Privacy Policy carefully. By using the Service, you consent to the practices described in this policy. If you do not agree with this policy, please do not use our Service.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-slate-200 mt-4 mb-2">2.1 Information You Provide</h3>
              <p>We collect information that you voluntarily provide when using our Service, including:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Account Information:</strong> Email address and password when you create an account.</li>
                <li><strong>Flight Information:</strong> Airline codes, flight numbers, travel dates, and related flight details.</li>
                <li><strong>Payment Information:</strong> Payment card details processed securely through our payment processor (Stripe). We do not store your full credit card number.</li>
                <li><strong>Communication Data:</strong> Information you provide when contacting our support team.</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-200 mt-4 mb-2">2.2 Information Collected Automatically</h3>
              <p>When you use our Service, we automatically collect certain information, including:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Device Information:</strong> Browser type, operating system, device type, and unique device identifiers.</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on pages, and navigation patterns.</li>
                <li><strong>Log Data:</strong> IP address, access times, and referring URLs.</li>
                <li><strong>Cookies and Similar Technologies:</strong> See Section 6 below.</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Provide the Service:</strong> To operate, maintain, and improve our platform and generate compensation-related documents.</li>
                <li><strong>Process Payments:</strong> To process transactions and send related information.</li>
                <li><strong>Communicate:</strong> To respond to inquiries, send service-related notices, and provide customer support.</li>
                <li><strong>Personalize Experience:</strong> To tailor content and features to your preferences.</li>
                <li><strong>Analytics:</strong> To understand how users interact with our Service and improve it.</li>
                <li><strong>Security:</strong> To detect, prevent, and address fraud, abuse, and security issues.</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. How We Share Your Information</h2>
              <p>We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., payment processing, hosting, analytics). These providers are contractually obligated to protect your information.</li>
                <li><strong>Legal Requirements:</strong> When required by law, regulation, legal process, or governmental request.</li>
                <li><strong>Protection of Rights:</strong> To protect the rights, property, or safety of BumpWin, our users, or others.</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</li>
                <li><strong>With Your Consent:</strong> When you have given us explicit consent to share your information.</li>
              </ul>
              <p className="mt-3">
                <strong>We do not sell your personal information to third parties.</strong>
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Third-Party Services</h2>
              <p>Our Service integrates with the following third-party services:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Stripe:</strong> For payment processing. Stripe's privacy policy: <a href="https://stripe.com/privacy" className="text-lime-400 hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a></li>
                <li><strong>Supabase:</strong> For authentication and data storage. Supabase's privacy policy: <a href="https://supabase.com/privacy" className="text-lime-400 hover:underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a></li>
                <li><strong>Vercel/Railway:</strong> For hosting services.</li>
              </ul>
              <p className="mt-3">
                These third parties have their own privacy policies, and we encourage you to review them.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar tracking technologies to collect and store information. Types of cookies we use:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the Service to function (e.g., authentication, session management).</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our Service.</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences.</li>
              </ul>
              <p className="mt-3">
                You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our Service.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide the Service and fulfill the purposes described in this policy, unless a longer retention period is required by law.
              </p>
              <p className="mt-3">
                Account information is retained until you delete your account. After account deletion, we may retain certain information as required for legal, accounting, or business purposes.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">8. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Encryption of data in transit (HTTPS/TLS)</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Access controls and authentication</li>
                <li>Regular security assessments</li>
              </ul>
              <p className="mt-3">
                However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">9. Your Rights and Choices</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements).</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format.</li>
                <li><strong>Opt-Out:</strong> Opt out of marketing communications at any time.</li>
                <li><strong>Withdraw Consent:</strong> Where processing is based on consent, you may withdraw it at any time.</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us at privacy@bumpwin.com. We will respond to your request within 30 days.
              </p>
            </section>

            {/* California Residents */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">10. California Privacy Rights (CCPA)</h2>
              <p>
                If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Right to know what personal information is collected, used, shared, or sold.</li>
                <li>Right to delete personal information held by businesses.</li>
                <li>Right to opt-out of the sale of personal information. <strong>Note: We do not sell personal information.</strong></li>
                <li>Right to non-discrimination for exercising your CCPA rights.</li>
              </ul>
              <p className="mt-3">
                To exercise your CCPA rights, contact us at privacy@bumpwin.com or call us at the number provided below.
              </p>
            </section>

            {/* EU/EEA Residents */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">11. European Users (GDPR)</h2>
              <p>
                If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have rights under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Right to access, rectify, or erase your personal data.</li>
                <li>Right to restrict or object to processing.</li>
                <li>Right to data portability.</li>
                <li>Right to lodge a complaint with a supervisory authority.</li>
              </ul>
              <p className="mt-3">
                <strong>Legal Basis for Processing:</strong> We process your data based on: (a) your consent, (b) performance of a contract, (c) compliance with legal obligations, or (d) our legitimate interests.
              </p>
              <p className="mt-3">
                <strong>International Transfers:</strong> Your data may be transferred to and processed in the United States. We use appropriate safeguards (such as Standard Contractual Clauses) to protect your data during international transfers.
              </p>
            </section>

            {/* Children */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">12. Children's Privacy</h2>
              <p>
                Our Service is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child under 18, please contact us immediately at privacy@bumpwin.com, and we will delete such information.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">13. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website and updating the "Last Updated" date. Your continued use of the Service after any changes constitutes acceptance of the updated policy.
              </p>
              <p className="mt-3">
                We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">14. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-3 bg-slate-800 rounded-lg p-4">
                <p><strong>BumpWin</strong></p>
                <p>Privacy Inquiries: privacy@bumpwin.com</p>
                <p>General Support: support@bumpwin.com</p>
                <p>Legal: legal@bumpwin.com</p>
              </div>
              <p className="mt-3">
                For GDPR-related inquiries, you may also contact our Data Protection contact at the email above.
              </p>
            </section>

          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/terms" className="hover:text-lime-400 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="/" className="hover:text-lime-400 transition-colors">Home</Link>
        </div>
      </main>
    </div>
  );
}

