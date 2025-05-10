"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AffiliatePage() {
  const [open, setOpen] = useState(false);

  return (
    <section className="min-h-screen py-16 px-4 md:px-12 bg-white text-gray-900">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Join the Uptime Decor Lights Affiliate Program
        </h1>
        <p className="text-lg text-muted-foreground">
          Love our lights? Earn commissions by sharing them with your audience.
          Get paid for every sale you refer.
        </p>

        <Card className="max-w-2xl mx-auto mt-10">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Why Become an Affiliate?</h2>
            <ul className="list-disc list-inside space-y-2 text-left text-muted-foreground">
              <li>Earn up to 15% commission on every sale</li>
              <li>30-day tracking cookies</li>
              <li>Custom affiliate dashboard</li>
              <li>Exclusive promotions & early access</li>
            </ul>

            <div className="pt-6">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full text-lg">Apply Now</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Affiliate Program</DialogTitle>
                    <DialogDescription>
                      We’re sorry, we’re not accepting new affiliates at this
                      time.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <div className="pt-8 text-sm text-muted-foreground">
          Questions?{" "}
          <a href="/contact" className="underline">
            Contact our team
          </a>
        </div>
      </div>
    </section>
  );
}
