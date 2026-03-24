// import drSelamawit from "@/assets/dr-selamawit.png";
// import drAbebe from "@/assets/dr-abebe.png";
// import drTigist from "@/assets/dr-tigist.png";
// import drDawit from "@/assets/dr-dawit.png";

export interface ChatContact {
  id: string;
  name: string;
  role: string;
  image: string;
  online: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

export interface ChatMessage {
  id: number;
  sender: "doctor" | "patient";
  text: string;
  time: string;
  type: "text" | "document";
  fileName?: string;
  fileSize?: string;
}

export const chatContacts: ChatContact[] = [
  {
    id: "dr-selamawit",
    name: "Dr. Selamawit",
    role: "Clinical Herbalist",
    image: "../assets/dr-dawit.png",
    online: true,
    lastMessage: "I've attached your updated prescription.",
    lastTime: "09:20 AM",
    unread: 1,
  },
  {
    id: "dr-abebe",
    name: "Dr. Abebe",
    role: "Integrative Medicine",
    image: "../assets/dr-dawit.png",
    online: false,
    lastMessage: "Your follow-up is scheduled for next week.",
    lastTime: "Yesterday",
    unread: 0,
  },
  {
    id: "dr-tigist",
    name: "Dr. Tigist",
    role: "Botanical Dermatologist",
    image: "../assets/dr-dawit.png",
    online: true,
    lastMessage: "The skin patch test results are in.",
    lastTime: "Mon",
    unread: 3,
  },
  {
    id: "dr-dawit",
    name: "Dr. Dawit",
    role: "Phytotherapist",
    image: "../assets/dr-dawit.png",
    online: false,
    lastMessage: "Remember to continue the inhalation therapy.",
    lastTime: "Oct 20",
    unread: 0,
  },
];

export const chatThreads: Record<string, ChatMessage[]> = {
  "dr-selamawit": [
    { id: 1, sender: "doctor", text: "Hello! I've reviewed your latest lab results. Your inflammation markers are trending downwards since we started the customized herbal blend. How are you feeling this morning?", time: "09:12 AM", type: "text" },
    { id: 2, sender: "patient", text: "I'm feeling much better, thank you Doctor! The morning fatigue has definitely decreased. I've also been consistent with the Koseret tea as you suggested.", time: "09:15 AM", type: "text" },
    { id: 3, sender: "doctor", text: "That's wonderful to hear. I've attached your updated botanical prescription. Please ensure you source the Tena Adam seeds from the marketplace link I've pinned.", time: "09:20 AM", type: "text" },
    { id: 4, sender: "doctor", text: "", time: "09:20 AM", type: "document", fileName: "Updated_Prescription.pdf", fileSize: "1.2 MB" },
  ],
  "dr-abebe": [
    { id: 1, sender: "doctor", text: "Good morning! I wanted to check in about the Nigella sativa oil regimen. Have you noticed any improvements in your digestion?", time: "10:00 AM", type: "text" },
    { id: 2, sender: "patient", text: "Yes, the bloating has reduced significantly. I'm taking it with honey as you recommended.", time: "10:15 AM", type: "text" },
    { id: 3, sender: "doctor", text: "Excellent. Your follow-up is scheduled for next week. We'll review the full panel then.", time: "10:20 AM", type: "text" },
  ],
  "dr-tigist": [
    { id: 1, sender: "doctor", text: "Hi! I have your skin patch test results. The Endod formulation is showing promising results for your condition.", time: "02:00 PM", type: "text" },
    { id: 2, sender: "patient", text: "That's great to hear! The itching has reduced a lot since I started the treatment.", time: "02:10 PM", type: "text" },
    { id: 3, sender: "doctor", text: "The skin patch test results are in. I'll prepare a detailed report for our next consultation.", time: "02:15 PM", type: "text" },
  ],
  "dr-dawit": [
    { id: 1, sender: "doctor", text: "I hope the Damakesse steam inhalation is helping with your respiratory comfort.", time: "11:00 AM", type: "text" },
    { id: 2, sender: "patient", text: "It's been very helpful. My breathing feels much clearer in the mornings.", time: "11:30 AM", type: "text" },
    { id: 3, sender: "doctor", text: "Remember to continue the inhalation therapy. We'll adjust the protocol in our next session.", time: "11:45 AM", type: "text" },
  ],
};
