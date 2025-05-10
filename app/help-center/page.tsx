// app/help-center/page.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function HelpCenterPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold">Help Center</h1>
        <p className="text-muted-foreground mt-2">
          We&apos;re here to help you with your lighting journey.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="order">
            <AccordionTrigger>How do I place an order?</AccordionTrigger>
            <AccordionContent>
              Add products to your cart, go to checkout, and complete your
              purchase. We&apos;ll send a confirmation email right away.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="payment">
            <AccordionTrigger>
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent>
              We accept M-Pesa, Visa, Mastercard, and other major payment
              methods.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>Do you offer delivery services?</AccordionTrigger>
            <AccordionContent>
              Yes! We deliver across Kenya. Fees are calculated based on
              distance and shown at checkout.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns">
            <AccordionTrigger>What is your return policy?</AccordionTrigger>
            <AccordionContent>
              Items can be returned within 7 days if unused and in original
              packaging. Email us to begin a return.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="track">
            <AccordionTrigger>How can I track my order?</AccordionTrigger>
            <AccordionContent>
              Once your order ships, you&apos;ll receive an email or SMS with a
              tracking link.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-4 border rounded-2xl shadow-sm">
            <Mail className="text-primary" />
            <div>
              <p className="font-medium">Email Support</p>
              <p className="text-muted-foreground text-sm">
                support@uptimedecorlights.com
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 border rounded-2xl shadow-sm">
            <Phone className="text-primary" />
            <div>
              <p className="font-medium">Call Us</p>
              <p className="text-muted-foreground text-sm">
                +254 7 (06) 969 085
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 border rounded-2xl shadow-sm">
            <MapPin className="text-primary" />
            <div>
              <p className="font-medium">Store Location</p>
              <p className="text-muted-foreground text-sm">
                Visit us in Nairobi, Mon–Sat, 9 AM–5 PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
