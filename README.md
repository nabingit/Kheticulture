# 🌱 Kheticulture – A Freelance Platform for Farm Work

## 🚜 Inspiration

I grew up in the village of **Nawalpur District**, **Kawasoti Municipality**, where farming is not just a livelihood — it's a way of life. My family has always owned farmland, and I’ve seen firsthand the struggle of finding farm workers, especially during peak agricultural seasons.

Back then, even with the community-based support system, the process of finding willing and available workers was tedious. Today, it’s become even more difficult due to the rising number of people migrating abroad for employment. This creates an increasing labor gap in rural farming communities.

The idea for **Kheticulture** started in my university days as a dream to build something impactful for villages. Now, after four years, I’m building this app with the help of Bolt.new for the **Bolt Hackathon**, with a mission to:
- Help farmers find timely labor support
- Provide income opportunities for local youth and seasonal workers
- Promote dignity of labor in agriculture

---

## 🛠️ What I Built

Name: "Kheti" means Farming in Nepali. "Culture" is a way of living. Substituting "Agro" from "Agriculture", I come up with the name "KhetiCulture" as a Nepali Brand.

**Kheticulture** is a mobile-first app that connects **farmers who need help** with **individuals seeking short- or long-term farm-related jobs** — just like a freelancing or gig platform, but for agriculture. 
KhetiCulture is a freelancing app designed specifically for farming-related chores. It allows farmers to post tasks such as planting, harvesting, or irrigation, specifying details like time duration and location radius. Workers can browse available jobs and apply based on their skills and availability. The app uses a matchmaking system similar to dating apps, helping users find the best fit quickly and conveniently. This fosters a trusted network where farmers get timely help and workers find income opportunities.

# 🔑 Key Features:
- **Dual User System**: Separate roles for Farmers (job posters) and Workers (job seekers).
- **Secure Sign-Up**: Email/password authentication with user-type selection and age verification.
- **Profile Management**: Farmers add basic info; Workers provide health metrics and pictures for verification.
- **Multi-Worker Jobs**: Support for assigning multiple workers to a single job post with tracking.
- **Auto Status Flow**: Jobs automatically progress from Open → Filled → In-Progress → Completed.
- **One-Click Apply**: Simple application process with real-time status tracking.
- **Reapplication Logic**: 24-hour cooldown for workers after rejection.

### 👀 Worker Transparency:
- **Detailed Portfolios**: Farmers can review worker profiles with job history and photos.
- **BMI Insights**: Worker health metrics are auto-calculated and categorized.
- **Secure Contact Access**: Farmers can reach workers securely post-acceptance.

### 📊 Real-Time Analytics:
- **Farmer Dashboard**: Track jobs posted, hires made, and hiring success rate.
- **Worker Stats**: See how many jobs applied, completed, and accepted.
- **Live Updates**: Application status and job metrics update instantly.

### 🔒 Security & Optimization:
- **Wage Locking**: Prevents wage tampering once applications begin.
- **Row-Level Security**: Users can only access their own data.
- **Strict Validation**: Age, contact, and data inputs are tightly verified.
- **PWA Design**: Works offline, installable on mobile, with responsive UI for all devices.

---

## 💡 What I Learned
We learned that simplicity and reliability are key to adoption in rural communities. Connectivity issues require fallback mechanisms and offline-friendly design. Matching workers to jobs effectively goes beyond location — trust, reputation, and clear communication matter a lot. We also gained insights into the cultural aspects of farm labor and how technology can support, rather than replace, personal relationships in the community.

- Learned how to think deeply about **user personas** in rural areas: farmers with basic smartphones, and workers with limited digital experience.
- Explored balancing **modern UX** with **local cultural relevance**.
- Gained insight into **designing systems with dignity in mind**, not just efficiency.
- Understood the challenge of **low-connectivity optimization** and **interface simplicity**.

---

## ⚙️ How I Built It
We built Kheticulture as a Progressive Web App (PWA), ensuring mobile-first usability and offline access for rural areas with limited connectivity. The stack leverages modern web technologies like React 18 and TypeScript for performance and maintainability. Supabase powers the backend with robust authentication, real-time data handling, and PostgreSQL for structured storage. The user interface was carefully crafted with simplicity and clarity in mind, using Tailwind CSS and iconography suited for a rural-modern aesthetic. Real-time updates, status automation, and personalized job discovery were key focuses to streamline the hiring process.

- **Frontend**: React 18 + TypeScript (mobile-first, responsive)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **State Management**: React Context + localStorage caching
- **Design**: Tailwind CSS with color-coded themes (green for farmers, blue for workers)
- **Build Tool**: Vite for fast development and optimized production builds
- **Security**: Row-Level Security (RLS) with strict validation and permissions


## 🚧 Challenges Faced
Building Kheticulture presented several complex challenges that required innovative solutions:

- **Data Consistency & Fairness**: Ensuring immutability of critical fields like wages after workers applied, while supporting automatic job status transitions based on dates and worker acceptance.
- **UX for Diverse Users**: Designing a mobile-first interface intuitive enough for users with varying levels of digital literacy—especially rural workers—required a focus on visual clarity and minimal cognitive load.
- **Real-Time State Management**: Coordinating actions like job posting, applications, acceptances, and status transitions in real time without race conditions or data conflicts was technically demanding.
- **Secure Role-Based Access**: Implementing Row Level Security (RLS) in Supabase to ensure farmers and workers only accessed appropriate data, all while keeping the UX smooth and responsive.
- **Complex Business Logic**: Supporting features like reapplication cooldowns, multi-worker job quotas, and simultaneous application handling needed robust validation and smart state handling.
- **Robust Feedback & Error Handling**: Building responsive, user-friendly feedback mechanisms to maintain platform reliability, trust, and transparency across all interactions.

---
## 🏆 Accomplishments We're Proud Of
We successfully built a full-stack, production-ready agricultural job platform that tackles real-world rural employment challenges with thoughtful technical solutions. From protecting worker wages with wage-locking to ensuring fair access through real-time status updates and RLS-secured data handling, every part of Kheticulture was designed with trust, accessibility, and usability in mind. Our mobile-first Progressive Web App delivers an app-like experience even in low-connectivity areas, with intuitive design suited for users with varying digital literacy. The system also handles complex workflows like reapplications, multi-worker jobs, and real-time interactions with consistency and security. Above all, we've built a reliable, scalable solution that connects agricultural workers and employers meaningfully.

- **Wage Protection**: Implemented wage-locking to ensure fairness post-application.
- **Smart Job Flow**: Automated status transitions based on worker actions and job scheduling.
- **Mobile-First Design**: Intuitive UI with contextual feedback for digitally diverse users.
- **Security & Access**: Supabase RLS ensures secure, role-based data visibility.
- **Complex Workflow Handling**: Reapplications, quotas, and multi-worker logic managed seamlessly.
- **Real-Time Communication**: Instant updates for job status and application responses.
- **Progressive Web App**: Offline-ready, installable experience optimized for rural accessibility.
- **Clean, Scalable Codebase**: TypeScript-based architecture with robust validation and error handling.

---

## 🌾 Impact Vision

**Kheticulture** is not just an app. It's a community enabler. It has the potential to:
- Create **dignified employment** in villages
- Support **local food production** through timely labor
- Reduce dependency on expensive seasonal contractors
- Empower **digital inclusion** in agriculture

---

## 🚀 Improvements Required and Future Plans
While Kheticulture successfully addresses essential job-matching needs in the agricultural sector, several key improvements will elevate its reach, reliability, and social impact. In the immediate future, we aim to implement real-time **push notifications** for application status, integrate **secure digital payment systems** (like UPI) for wage disbursement, and introduce a **rating and review system** to foster trust between farmers and workers. Near-term goals include adding **in-app messaging** for direct communication, **GPS-based location verification** to prevent fraudulent job posts, and **multi-language support** (Hindi, Nepali, and regional dialects) to ensure accessibility across diverse linguistic groups.

As part of the long-term roadmap, we envision building **AI-powered job recommendations** that consider skills, proximity, and performance history, alongside **native mobile apps** for more robust offline support in remote regions. Given your background and vision, future iterations will expand beyond job-matching to include a broader ecosystem: **weather forecasting**, **government scheme integration**, **crop advisory**, and an **agricultural equipment rental marketplace**. Further enhancements include **farmer analytics dashboards**, **worker certification modules**, and collaborations with **cooperatives and government agencies**. Ultimately, our goal is to make Kheticulture a national platform—empowering millions, reducing rural unemployment, and redefining the dignity of agricultural labor through technology.

> “It’s time to bring gig economy models to our fields – not just cities.”

---

