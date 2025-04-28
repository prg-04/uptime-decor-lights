"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { footerNav } from "@/constants";
import { Form } from "./ui/form";
import { Button } from "./ui/button";
import Link from "next/link";
import { AuthFormData, schema } from "@/schemas/authSchema";
import FormField from "./FormField";

export default function Footer() {
  const form = useForm<AuthFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (_data: AuthFormData) => {
    form.reset();
  };

  return (
    <footer className="bg-black/90 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {footerNav.map((section, idx) => (
          <div
            key={idx}
            className={`lg:col-span-1 ${idx === footerNav.length - 1 ? "col-span-2" : ""}`}
          >
            <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
            <ul className="space-y-2 text-sm text-white/80">
              {section.links?.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
              {section.services?.map((service, serviceIdx) => (
                <li key={serviceIdx}>
                  {service.href ? (
                    <Link
                      href={service.href}
                      className="flex items-start gap-2 hover:text-white transition"
                    >
                      {service.icon && <span>{service.icon}</span>}
                      <div>
                        {service.title && (
                          <p className="font-medium">{service.title}</p>
                        )}
                        {service.text && <p>{service.text}</p>}
                        {service.subText && (
                          <p className="text-xs text-white/60">
                            {service.subText}
                          </p>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-start gap-2">
                      {service.icon && <span>{service.icon}</span>}
                      <div>
                        {service.title && (
                          <p className="font-medium">{service.title}</p>
                        )}
                        {service.text && <p>{service.text}</p>}
                        {service.subText && (
                          <p className="text-xs text-white/60">
                            {service.subText}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Mailing List */}
        <div className="lg:col-span-2 col-span-2 space-y-4 lg:ml-4">
          <h2 className="text-xl md:text-2xl font-semibold">
            Join our mailing list for the latest Uptime Decor Lights news
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="relative max-w-md">
                <FormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  className="pr-12 py-4"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-gray-400 hover:bg-white/90 rounded-full h-8 w-8"
                >
                  &gt;
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <div className="text-center text-xs text-white/50 mt-12">
        &copy; {new Date().getFullYear()} Uptime Decor Lights. All rights
        reserved.
      </div>
    </footer>
  );
}
