"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BookOpen, Lightbulb, HelpCircle } from "lucide-react";
import Link from "next/link";

// Define types for the help data structure
export interface HelpData {
  title: string;
  description: string;
  quickStart: {
    title: string;
    content: string;
  }[];
  faqs: {
    question: string;
    answer: string;
    category: string;
  }[];
  features: {
    name: string;
    description: string;
    tips: string[];
  }[];
  tips: {
    icon: string;
    title: string;
    description: string;
  }[];
}

// Reusable Help Component that accepts helpData as props
export function HelpComponent({ helpData }: { helpData: HelpData }) {
  const faqsByCategory = helpData.faqs.reduce(
    (acc, faq) => {
      if (!acc[faq.category]) acc[faq.category] = [];
      acc[faq.category].push(faq);
      return acc;
    },
    {} as Record<string, typeof helpData.faqs>,
  );

  // Get number of categories for dynamic grid columns
  const categoryCount = Object.keys(faqsByCategory).length;
  // Determine grid column class based on category count
  const gridColClass = cn({
    "grid-cols-1": categoryCount === 1,
    "grid-cols-2": categoryCount === 2,
    "grid-cols-3": categoryCount === 3,
    "grid-cols-4": categoryCount === 4,
    "grid-cols-5": categoryCount === 5,
    "grid-cols-6": categoryCount >= 6, // Maximum of 6 columns
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{helpData.title}</h1>
        <p className="text-muted-foreground text-lg">{helpData.description}</p>
      </div>

      {/* Quick Tips Alert */}
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          Baru menggunakan dashboard? Mulai dengan bagian Panduan Cepat di bawah
          untuk memahami dasar-dasar dalam hitungan menit.
        </AlertDescription>
      </Alert>

      {/* Main Tabs */}
      <Tabs defaultValue="quick-start" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick-start">Panduan Cepat</TabsTrigger>
          <TabsTrigger value="features">Fitur</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Quick Start Tab */}
        <TabsContent value="quick-start" className="space-y-4">
          <div className="grid gap-4">
            {helpData.quickStart.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge variant="outline">{index + 1}</Badge>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4">
            {helpData.features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {feature.name}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Kiat:</p>
                    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                      {feature.tips.map((tip, tipIndex) => (
                        <li key={tipIndex}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <Tabs
            defaultValue={Object.keys(faqsByCategory)[0]}
            className="w-full"
          >
            <TabsList className={`grid w-full ${gridColClass}`}>
              {Object.keys(faqsByCategory).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="text-xs"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(faqsByCategory).map(([category, faqs]) => (
              <TabsContent
                key={category}
                value={category}
                className="space-y-4"
              >
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`${category}-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-start gap-2 text-left">
                          <HelpCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Pro Tips Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tips Pro</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {helpData.tips.map((tip, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">{tip.icon}</span>
                  {tip.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {tip.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Tidak menemukan informasi yang Anda cari?{" "}
          <span className="font-medium">
            Hubungi tim dukungan kami di{" "}
            <Link
              href="mailto:rizkyfauziilmi@gmail.com"
              className="hover:underline hover:text-blue-500"
            >
              rizkyfauziilmi@gmail.com
            </Link>{" "}
            untuk mendapatkan bantuan lebih lanjut.
          </span>
        </AlertDescription>
      </Alert>
    </div>
  );
}
