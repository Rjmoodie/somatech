import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Eye, FileText } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
            Privacy Policy
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
      </Card>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Introduction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            SomaTech ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our financial intelligence platform and related services.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            By using our services, you agree to the collection and use of information in accordance with this policy.
          </p>
        </CardContent>
      </Card>

      {/* Information We Collect */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Information We Collect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Personal Information</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Name and email address when you create an account</li>
              <li>Profile information you choose to provide</li>
              <li>Payment information processed securely through Stripe</li>
              <li>Communication preferences and settings</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Financial Data</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Investment portfolios and watchlist data</li>
              <li>Financial calculations and projections you create</li>
              <li>Business valuation models and cash flow simulations</li>
              <li>Real estate investment calculations</li>
              <li>Retirement planning data</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Technical Information</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Device information and browser type</li>
              <li>IP address and location data</li>
              <li>Usage patterns and feature interactions</li>
              <li>Performance metrics and error logs</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* How We Use Information */}
      <Card>
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Provide and maintain our financial intelligence services</li>
            <li>Process transactions and manage subscriptions</li>
            <li>Personalize your experience and improve our platform</li>
            <li>Send important updates and service notifications</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>Detect fraud and ensure platform security</li>
            <li>Comply with legal obligations and regulatory requirements</li>
            <li>Conduct analytics to improve our services</li>
          </ul>
        </CardContent>
      </Card>

      {/* Information Sharing */}
      <Card>
        <CardHeader>
          <CardTitle>Information Sharing and Disclosure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Service Providers</h4>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li><strong>Stripe:</strong> Payment processing and subscription management</li>
                <li><strong>Supabase:</strong> Database and authentication services</li>
                <li><strong>Analytics providers:</strong> Usage analytics and performance monitoring</li>
                <li><strong>Cloud infrastructure:</strong> Hosting and data storage</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Legal Requirements</h4>
              <p className="text-muted-foreground">
                We may disclose your information if required by law, court order, or regulatory authority, or to protect our rights, property, or safety.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Business Transfers</h4>
              <p className="text-muted-foreground">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Data Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We implement industry-standard security measures to protect your information:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>End-to-end encryption for data transmission</li>
            <li>Secure cloud infrastructure with regular backups</li>
            <li>Multi-factor authentication options</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>PCI DSS compliance for payment processing</li>
            <li>Role-based access controls for internal systems</li>
          </ul>
        </CardContent>
      </Card>

      {/* Cookies and Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Cookies and Tracking Technologies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We use cookies and similar technologies to enhance your experience:
          </p>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">Essential Cookies</h4>
              <p className="text-muted-foreground text-sm">Required for basic platform functionality and security</p>
            </div>
            <div>
              <h4 className="font-semibold">Analytics Cookies</h4>
              <p className="text-muted-foreground text-sm">Help us understand how you use our platform to improve services</p>
            </div>
            <div>
              <h4 className="font-semibold">Preference Cookies</h4>
              <p className="text-muted-foreground text-sm">Remember your settings and personalize your experience</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            You can control cookies through your browser settings, though this may affect platform functionality.
          </p>
        </CardContent>
      </Card>

      {/* Your Rights */}
      <Card>
        <CardHeader>
          <CardTitle>Your Privacy Rights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Depending on your location, you may have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
            <li><strong>Restriction:</strong> Limit how we process your information</li>
            <li><strong>Objection:</strong> Object to certain types of processing</li>
            <li><strong>Withdraw consent:</strong> Revoke previously given consent</li>
          </ul>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We retain your information for as long as necessary to provide our services and comply with legal obligations:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-1 text-muted-foreground">
            <li>Account information: Until account deletion</li>
            <li>Financial calculations: Until you delete them or close your account</li>
            <li>Transaction records: 7 years for tax and regulatory compliance</li>
            <li>Usage logs: 2 years for security and analytics purposes</li>
          </ul>
        </CardContent>
      </Card>

      {/* Third-Party Services */}
      <Card>
        <CardHeader>
          <CardTitle>Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Our platform integrates with third-party services that have their own privacy policies:
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="font-medium">Stripe</span>
              <a 
                href="https://stripe.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Privacy Policy
              </a>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="font-medium">Supabase</span>
              <a 
                href="https://supabase.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Privacy Policy
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* International Transfers */}
      <Card>
        <CardHeader>
          <CardTitle>International Data Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your information may be transferred to and processed in countries other than your country of residence. 
            We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws, 
            including the GDPR for EU residents and CCPA for California residents.
          </p>
        </CardContent>
      </Card>

      {/* Children's Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Children's Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
            information from children under 13. If you are a parent or guardian and believe your child has provided 
            us with personal information, please contact us to have it removed.
          </p>
        </CardContent>
      </Card>

      {/* Updates to Policy */}
      <Card>
        <CardHeader>
          <CardTitle>Changes to This Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
            new Privacy Policy on this page and updating the "Last updated" date. For material changes, we may also 
            send you an email notification. Your continued use of our services after any modifications constitutes 
            acceptance of the updated Privacy Policy.
          </p>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2 text-muted-foreground">
            <p><strong>Email:</strong> privacy@somatech.com</p>
            <p><strong>Address:</strong> SomaTech Inc., [Your Address]</p>
            <p><strong>Data Protection Officer:</strong> dpo@somatech.com</p>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />
      
      <div className="text-center text-sm text-muted-foreground">
        <p>This privacy policy is designed to be compliant with GDPR, CCPA, and other major privacy regulations.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;