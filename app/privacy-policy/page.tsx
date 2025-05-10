import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Uptime Decor Lights",
  description:
    "Read how Uptime Decor Lights handles your data, cookies, and personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-900">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground mb-6">Last updated: May 8, 2025</p>

      <section className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p className="text-muted-foreground">
            This Privacy Policy explains how Uptime Decor Lights collects, uses,
            discloses, and protects your personal information when you use our
            website. By using our site, you agree to our use of cookies and to
            the terms described here.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">2. What We Collect</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>IP address, browser type, and general location</li>
            <li>
              Details about your visit (pages viewed, time spent, referrals)
            </li>
            <li>
              Name, email, phone, and address (if you create an account or place
              an order)
            </li>
            <li>Messages or form submissions, including metadata</li>
            <li>Public information you submit (e.g. reviews or comments)</li>
            <li>Newsletter subscriptions and marketing preferences</li>
            <li>
              Transaction and payment information (via third-party processors)
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">3. How We Use Your Data</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>To operate, maintain, and personalize the website</li>
            <li>To fulfill orders and communicate transaction updates</li>
            <li>
              To send newsletters and marketing communications if you opt in
            </li>
            <li>To respond to inquiries or support requests</li>
            <li>To improve our services using analytics</li>
            <li>To prevent fraud and ensure site security</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">4. Sharing & Disclosure</h2>
          <p className="text-muted-foreground">
            We do not sell your data. We may share your personal data with
            trusted third parties such as:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Payment processors and delivery providers</li>
            <li>Marketing and analytics service providers</li>
            <li>Legal or regulatory bodies if required by law</li>
            {/* <li>Potential buyers if we undergo a business sale or merger</li> */}
            <li>
              Our group companies, contractors, and service providers as
              necessary
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">5. Data Retention</h2>
          <p className="text-muted-foreground">
            We retain personal data only for as long as needed for the purposes
            stated in this policy or as required by law. This includes records
            necessary for legal, accounting, or fraud prevention purposes.
          </p>
        </div>


        <div>
          <h2 className="text-xl font-semibold">6. Security</h2>
          <p className="text-muted-foreground">
            We implement technical and organizational safeguards to protect your
            data. These include encrypted connections, firewalls, and limited
            access. No system is 100% secure, but we take all reasonable steps
            to protect your data.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">7. Cookies</h2>
          <p className="text-muted-foreground">
            We use cookies to enhance your experience, analyze site usage, and
            deliver relevant ads. You can disable cookies in your browser
            settings if preferred.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">8. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. When we do, we
            will revise the “Last updated” date above.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">9. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions or concerns about this policy, contact us
            at:{" "}
            <a
              href="mailto:support@uptimedecorlights.com"
              className="underline"
            >
              support@uptimedecorlights.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
