import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | BumpWin",
  description: "Terms of Service for BumpWin flight compensation assistance platform.",
};

export default function TermsPage() {
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
            <h1 className="text-3xl sm:text-4xl font-black font-display mb-2">Terms of Service</h1>
            <p className="text-slate-400 text-sm">Last Updated: {lastUpdated}</p>
          </div>

          <div className="space-y-8 text-slate-300 leading-relaxed">
            
            {/* Agreement */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing or using BumpWin ("the Service," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
              </p>
              <p className="mt-3">
                These Terms constitute a legally binding agreement between you and BumpWin. Please read them carefully before using our platform.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
              <p>
                BumpWin is an <strong>informational and document generation platform</strong> that helps users understand their potential rights regarding airline compensation and generates template demand letters. Our Service includes:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Flight delay and disruption monitoring</li>
                <li>Information about passenger rights regulations (US DOT, EU EC 261/2004)</li>
                <li>Generation of template demand letters</li>
                <li>Educational resources about compensation claims</li>
              </ul>
            </section>

            {/* NOT Legal Advice */}
            <section className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-amber-300 mb-3">3. IMPORTANT: Not Legal Advice</h2>
              <p className="text-amber-100">
                <strong>BUMPWIN DOES NOT PROVIDE LEGAL ADVICE.</strong> The information, templates, and tools provided through our Service are for <strong>informational and educational purposes only</strong> and do not constitute legal advice, legal representation, or the practice of law.
              </p>
              <p className="mt-3 text-amber-100">
                We are not a law firm. We do not represent you in any legal capacity. The use of our Service does not create an attorney-client relationship between you and BumpWin.
              </p>
              <p className="mt-3 text-amber-100">
                You should consult with a qualified attorney licensed in your jurisdiction for advice regarding your specific legal situation. Laws and regulations vary by jurisdiction and change over time. We make no guarantees that the information on our platform is current, complete, or applicable to your situation.
              </p>
            </section>

            {/* No Guarantee */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. No Guarantee of Results</h2>
              <p>
                <strong>WE DO NOT GUARANTEE ANY OUTCOME.</strong> BumpWin provides tools and information to assist you in pursuing compensation claims on your own behalf. However:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>We cannot guarantee that you will receive any compensation from any airline.</li>
                <li>We cannot guarantee that our information is accurate, complete, or up-to-date.</li>
                <li>We cannot guarantee that any airline will respond to or honor any demand letter generated through our Service.</li>
                <li>Compensation amounts, eligibility criteria, and airline policies vary and are subject to change without notice.</li>
                <li>Your individual circumstances may differ from general guidelines.</li>
              </ul>
              <p className="mt-3">
                Any estimated compensation amounts shown on our platform are <strong>estimates only</strong> based on publicly available regulations and are not guarantees of payment.
              </p>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. User Responsibilities</h2>
              <p>By using our Service, you agree to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Provide accurate and truthful information about your flights and circumstances.</li>
                <li>Verify all information in any generated documents before submitting them to airlines.</li>
                <li>Take full responsibility for any claims you submit to airlines.</li>
                <li>Not use the Service for fraudulent, deceptive, or illegal purposes.</li>
                <li>Not submit false or misleading claims to airlines.</li>
                <li>Comply with all applicable laws and regulations.</li>
              </ul>
              <p className="mt-3">
                <strong>You are solely responsible</strong> for the accuracy of any claims you make and any documents you submit. BumpWin is not responsible for any consequences arising from inaccurate, incomplete, or fraudulent claims.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-red-300 mb-3">6. Limitation of Liability</h2>
              <p className="text-red-100">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, BUMPWIN AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AFFILIATES, AND LICENSORS SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-red-100">
                <li>Any indirect, incidental, special, consequential, or punitive damages.</li>
                <li>Any loss of profits, revenue, data, or business opportunities.</li>
                <li>Any damages arising from your use of or inability to use the Service.</li>
                <li>Any damages arising from any claim you submit to an airline.</li>
                <li>Any damages arising from airline responses or lack thereof.</li>
                <li>Any damages arising from reliance on information provided through the Service.</li>
                <li>Any damages arising from unauthorized access to your account or data.</li>
              </ul>
              <p className="mt-3 text-red-100">
                IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
              </p>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</li>
                <li>Warranties that the Service will be uninterrupted, error-free, or secure.</li>
                <li>Warranties regarding the accuracy, reliability, or completeness of any information.</li>
                <li>Warranties that defects will be corrected.</li>
              </ul>
              <p className="mt-3">
                We do not warrant that the information on our platform reflects current laws, regulations, or airline policies. Regulations change frequently, and there may be delays in updating our content.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">8. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless BumpWin and its officers, directors, employees, agents, affiliates, and licensors from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from or related to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Your use of the Service.</li>
                <li>Your violation of these Terms.</li>
                <li>Your violation of any applicable law or regulation.</li>
                <li>Any claim you submit to an airline.</li>
                <li>Any content or information you provide through the Service.</li>
                <li>Your infringement of any third-party rights.</li>
              </ul>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">9. Payment and Refunds</h2>
              <p>
                Certain features of the Service require payment. By making a payment, you agree to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Pay all fees associated with your purchase.</li>
                <li>Provide accurate and complete billing information.</li>
                <li>Authorize us to charge your payment method for the fees.</li>
              </ul>
              <p className="mt-3">
                <strong>Refund Policy:</strong> Due to the nature of digital products and immediate access to generated documents, all sales are final. We do not offer refunds once you have accessed or downloaded any generated content. If you believe there has been an error with your purchase, please contact us within 7 days at support@bumpwin.com.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">10. Intellectual Property</h2>
              <p>
                All content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, images, and software, are owned by BumpWin or its licensors and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="mt-3">
                You may use generated documents solely for your personal, non-commercial use in pursuing compensation claims. You may not reproduce, distribute, modify, or create derivative works of our content without our express written permission.
              </p>
            </section>

            {/* Account Termination */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">11. Account Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account and access to the Service at any time, without notice, for any reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Violation of these Terms.</li>
                <li>Fraudulent or illegal activity.</li>
                <li>Abuse of the Service.</li>
                <li>At our sole discretion.</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">12. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
              </p>
              <p className="mt-3">
                Any dispute arising from or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in Delaware, and the arbitrator's decision shall be final and binding.
              </p>
              <p className="mt-3">
                <strong>Class Action Waiver:</strong> You agree that any disputes will be resolved on an individual basis and not as part of any class, consolidated, or representative action.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">13. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">14. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            {/* Entire Agreement */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">15. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and BumpWin regarding the Service and supersede all prior agreements and understandings.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold text-white mb-3">16. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-3 bg-slate-800 rounded-lg p-4">
                <p><strong>BumpWin</strong></p>
                <p>Email: legal@bumpwin.com</p>
                <p>Support: support@bumpwin.com</p>
              </div>
            </section>

          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/privacy" className="hover:text-lime-400 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/" className="hover:text-lime-400 transition-colors">Home</Link>
        </div>
      </main>
    </div>
  );
}

