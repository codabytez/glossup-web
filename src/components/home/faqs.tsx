"use client";

import { motion } from "motion/react";
import Image from "next/image";

import { MinusIcon } from "@/components/icons/minus-icon";
import { PlusIcon } from "@/components/icons/plus-icon";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqs from "@/data/faqs.json";
import { fadeUpContainer, fadeUpItem } from "@/lib/motion";

export function Faqs() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUpContainer}
      className="px-4 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-30 xl:px-20"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-6 2xl:mx-auto 2xl:max-w-384">
        <motion.div variants={fadeUpItem} className="flex flex-1 flex-col gap-4">
          <div className="flex items-center gap-2">
            <Image src="/icons/question.svg" alt="Question icon" width={16} height={16} />
            <span className="text-grey-500 text-sm font-medium uppercase">FAQs</span>
          </div>
          <h2 className="text-grey-950 text-header-h1 leading-[1.13] font-light tracking-[-0.64px] sm:text-5xl sm:tracking-[-1.28px] md:text-[64px] lg:text-[64px] lg:tracking-[-1.28px]">
            Got questions?
          </h2>
        </motion.div>

        <motion.div variants={fadeUpItem} className="flex-1">
          <Accordion defaultValue={[0]} className="border-grey-100 border-t">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={index}>
                <AccordionTrigger className="group">
                  <span className="text-grey-950 flex-1 text-sm leading-[1.4] font-medium">
                    {faq.question}
                  </span>
                  <span className="text-grey-500 relative size-6 shrink-0">
                    <PlusIcon className="size-6 group-data-panel-open:hidden" />
                    <MinusIcon className="hidden size-6 group-data-panel-open:block" />
                  </span>
                </AccordionTrigger>
                <AccordionPanel>
                  <p className="text-grey-700 px-6 text-sm leading-[1.4]">{faq.answer}</p>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </motion.section>
  );
}
