import React from "react";

const faqData = [
  {
    question: "What is Blast?",
    answer: "Blast is a Facebook advertising product designed real estate agents generate leads and promote their listings through targeted social media ads. Listing Blast: Best for agents looking to maximize exposure for specific properties. Zip Code Blast: Best for agents aiming to dominate their local market and maintain continuous visibility."
  },
  {
    question: "Why do I need to connect my MLS?",
    answer: "Connecting your MLS allows Blast to automatically access and update your property listings in real time. This ensures your ads reflect the latest listing status, maximizing accuracy and engagement while saving you time on manual updates."
  },
  {
    question: "How do I receive leads with Blast?",
    answer: "Any time a lead registers on your Blast ad, you will receive an email with their details like name, email, phone number, and tag."
  },
  {
    question: "Can I choose how long Blast runs?",
    answer: "Yes, you can set the duration of your ad from 1 to 4 weeks. You can also choose if you'd like to set your Blast to run once, or automatically renew."
  }
];

export const FrequentlyAskedQuestions: React.FC = () => {
  return (
    <section className="bg-[#F8F9FF] flex w-full flex-col items-center justify-center py-20 px-25 max-md:px-5">
      <div className="flex w-full max-w-[1240px] flex-col items-center">
        <h2 className="text-[34px] leading-none text-center text-gray-900 font-medium mb-16">
          Frequently Asked Questions
        </h2>

        <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4 leading-tight">
                {faq.question}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
