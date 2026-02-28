"use client";

import React, { useState } from "react";
import FAQModal from "@/components/home/FAQModal";

export default function FAQFooterLink() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="text-gray-400 hover:text-white transition-colors"
      >
        FAQ
      </button>
      <FAQModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
